using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using PUMS.Data;
using PUMS.Models;
using System.Globalization;
using System.Linq;
using System.Security.Policy;

namespace PUMS.Services
{
    public class Service
    {
        private readonly DatasContext _context;
        // 用于timestr格式的时间字串转为x年x月x日x时的格式转换
        private readonly Dictionary<string, (string inputFormat, string outputFormat)> _timeStrFormat = new ()
            {
                {Constants.HOUR, ("yyyy-MM-dd-HH", "M月d日H时") },
                {Constants.DAY, ("yyyy-MM-dd", "M月d日") },
                {Constants.MONTH, ("yyyy-MM", "M月") }
            };
        // 用于： 请求类型为日实际是请求时序列， 请求类型为月实际是请求日序列， 此字典用于快速转换为实际请求类型
        private readonly Dictionary<string, string> _dtypeMap = new()
            {
                {Constants.DAY, Constants.HOUR },
                {Constants.MONTH, Constants.DAY },
                {Constants.YEAR, Constants.MONTH }
            };

        public Service(DatasContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 读取<current_datas>中最晚时刻的某站点数据, 生成RealTimeData类型的数据
        /// </summary>
        /// <param name="siteId">能源系统站点ID</param>
        /// <returns></returns>
        public async Task<CollectData> getRealTimeDataBySiteIdAsync(string siteId)
        {
            var siteRoom = _context.siteRooms.Where(s => s.SiteID == siteId).FirstOrDefault();            
            if (siteRoom == null ) return new CollectData();

            var currentQuery = _context.CurrentDatas.Where(c => c.RoomID == siteRoom.RoomID && c.DType == "HOUR");
            
            var realTimestr = currentQuery.OrderByDescending(c => c.TimeStr).FirstOrDefault()?.TimeStr;
            if (realTimestr == null) return new CollectData();

            /// 生成RealTimeData的步骤:
            /// 1. 直接可得: siteId, roomid, site, timestr
            /// 2. LINQ生成tagCurrents
            /// 3. 由tagCurrents计算得来: pue, proportions

            var rtd = new CollectData
            {
                SiteID = siteId,
                RoomID = siteRoom?.RoomID ?? "",
                Site = siteRoom?.Site ?? "",
                TimeStr = realTimestr
            };

            /*var rand = new Random();
            //var pueOffset = (float)Math.Round((rand.NextSingle() - 0.5) * 0.05, 1);
            var productOffset = (float)Math.Round((rand.NextSingle() - 0.5) * 3, 1);
            var deviceOffset = (float)Math.Round((rand.NextSingle() - 0.7) * 10, 1);*/

            rtd.TagCurrents = await currentQuery
                .Where(c => c.TimeStr == realTimestr && c.DType == Constants.HOUR
                && c.Category == Constants.VECTOR)
                .ToDictionaryAsync(c => c.Tag, c => c.Current);

            /*rtd.TagCurrents[Constants.PRODUCT] = rtd.TagCurrents[Constants.PRODUCT] + productOffset;
            rtd.TagCurrents[Constants.DEVICE] = rtd.TagCurrents[Constants.DEVICE] + deviceOffset;*/

            /*rtd.PUE = rtd.TagCurrents.TryGetValue(Constants.PRODUCT, out float facilityCurrent) &&
                rtd.TagCurrents.TryGetValue(Constants.DEVICE, out float equipmentCurrent) ?
                facilityCurrent / equipmentCurrent : -1;*/

            if (rtd.TagCurrents.TryGetValue(Constants.TOTAL, out float total))
            {
                rtd.TagCurrents.TryGetValue(Constants.PRODUCT, out float product);
                rtd.TagCurrents.TryGetValue(Constants.OFFICE, out float office);
                rtd.TagCurrents.TryGetValue(Constants.BUSINESS, out float business);
                rtd.TagCurrents.TryGetValue(Constants.LEASE, out float lease);

                rtd.Proportions[Constants.PRODUCT] = product / (total - lease);
                rtd.Proportions[Constants.OFFICE] = office / (total - lease);
                rtd.Proportions[Constants.BUSINESS] = business / (total - lease);
                rtd.Proportions[Constants.LEASE] = lease / total;
            }


            return rtd;
        }

        /// <summary>
        /// 获取指定站点, 指定时间类型, 指定时间点的CollectData数据
        /// </summary>
        /// <param name="siteId"></param>
        /// <param name="dType"></param>
        /// <param name="timeStr"></param>
        /// <returns></returns>
        public async Task<CollectData> getCollectDataAsync(string siteId, string dType, string timeStr)
        {
            var siteRoom = _context.siteRooms.Where(s => s.SiteID == siteId).FirstOrDefault();
            if (siteRoom == null) return new CollectData();

            var vectorCurrents = await _context.CurrentDatas
                .Where(c => c.RoomID == siteRoom.RoomID && c.DType == dType 
                            && c.TimeStr == timeStr && c.Category == Constants.VECTOR)
                .ToDictionaryAsync(c => c.Tag, c => c.Current);
            var proportions = calculateVectorDicToProportions(vectorCurrents); 

            return new CollectData
            {
                SiteID = siteId,
                RoomID = siteRoom?.RoomID ?? "",
                Site = siteRoom?.Site ?? "",
                TimeStr = timeStr,
                TagCurrents = vectorCurrents,
                Proportions = proportions
            };

        }


        /// <summary>
        /// 获取某站点某天的VectorSeries数据
        /// </summary>
        /// <param name="siteId"></param>
        /// <param name="dayTimeStr"></param>
        /// <returns></returns>
        public VectorSeries getVectorSeriesOfOneDay(string siteId, string dayTimeStr)
        {
            var vs = new VectorSeries();

            var siteRoom = _context.siteRooms.Where(s => s.SiteID == siteId).FirstOrDefault();
            if (siteRoom != null)
            {
                var currentQuery = _context.CurrentDatas                    
                    .Where(c => c.RoomID == siteRoom.RoomID && c.DType == "HOUR" 
                    && c.Category == Constants.VECTOR && c.TimeStr.StartsWith(dayTimeStr))
                    .OrderBy(c => c.TimeStr)
                    .GroupBy(c => c.TimeStr, c => c);

                /*var rand = new Random();*/
                //var deltaDays = rand.Next(-6, 6);
                foreach (IGrouping<string, CurrentData> cg in currentQuery)
                {
                    /*var lease = Math.Round((rand.NextSingle() - 0.5) * 5, 1);
                    var product = Math.Round((rand.NextSingle() - 0.5) * 6, 1);
                    var device = Math.Round((rand.NextSingle() - 0.5) * 4, 1);
                    var office = Math.Round((rand.NextSingle() - 0.5) * 3, 1);*/

                    var currentTagMap = cg.ToDictionary(c => c.Tag, c => Math.Round(c.Current, 2));

                    vs.TimeSeries.Add(convertTimeStr(cg.Key, Constants.HOUR));
                    vs.Total.Add(currentTagMap.TryGetFloat(Constants.TOTAL));
                    vs.Product.Add(currentTagMap.TryGetFloat(Constants.PRODUCT));
                    vs.Device.Add(currentTagMap.TryGetFloat(Constants.DEVICE));
                    vs.Office.Add(currentTagMap.TryGetFloat(Constants.OFFICE));
                    vs.Business.Add(currentTagMap.TryGetFloat(Constants.BUSINESS));
                    vs.Lease.Add(currentTagMap.TryGetFloat(Constants.LEASE));
                    vs.Pue.Add(currentTagMap.TryGetFloat(Constants.PUE));

                }

            }
            
            return vs;

        }

        /// <summary>
        /// 获取某站点指定时间类型和时间点的VectorSeries数据
        /// </summary>
        /// <param name="siteId"></param>
        /// <param name="dayTimeStr"></param>
        /// <returns></returns>
        public VectorSeries getVectorSeries(string siteId, string timeType, string timeStr)
        {
            var vs = new VectorSeries();

            /*var dtypeMap = new Dictionary<string, string>()
            {
                {Constants.DAY, Constants.HOUR },
                {Constants.MONTH, Constants.DAY },
                {Constants.YEAR, Constants.MONTH }
            };*/
            var siteRoom = _context.siteRooms.Where(s => s.SiteID == siteId).FirstOrDefault();
            if (siteRoom != null && _dtypeMap.ContainsKey(timeType))
            {
                var currentQuery = _context.CurrentDatas
                    .Where(c => c.RoomID == siteRoom.RoomID && c.DType == _dtypeMap[timeType]
                    && c.Category == Constants.VECTOR && c.TimeStr.StartsWith(timeStr))
                    .OrderBy(c => c.TimeStr)
                    .GroupBy(c => c.TimeStr, c => c);

                foreach (IGrouping<string, CurrentData> cg in currentQuery)
                {
                    var currentTagMap = cg.ToDictionary(c => c.Tag, c => Math.Round(c.Current, 2));

                    vs.TimeSeries.Add(convertTimeStr(cg.Key, _dtypeMap[timeType]));
                    vs.Total.Add(currentTagMap.TryGetFloat(Constants.TOTAL));
                    vs.Product.Add(currentTagMap.TryGetFloat(Constants.PRODUCT));
                    vs.Device.Add(currentTagMap.TryGetFloat(Constants.DEVICE));
                    vs.Office.Add(currentTagMap.TryGetFloat(Constants.OFFICE));
                    vs.Business.Add(currentTagMap.TryGetFloat(Constants.BUSINESS));
                    vs.Lease.Add(currentTagMap.TryGetFloat(Constants.LEASE));
                    vs.Pue.Add(currentTagMap.TryGetFloat(Constants.PUE));
                }

            }

            return vs;
        }


        /// <summary>
        /// 获取指定站点的有效采集数据的日期列表, 分为时(只查询当日的有效时数据), 日, 月,年四类
        /// </summary>
        /// <param name="siteId"></param>
        /// <returns></returns>
        public SiteValidDate getValidDateBySiteId(string? siteId)
        {
            /*var todayStr = DateTime.Today.ToString("yyyy-MM-dd");
            var currentMonthStr = DateTime.Today.ToString("yyyy-MM");
            var currentYearStr = DateTime.Today.ToString("yyyy");

            // 1. 当日的小时列表
            var hours = _context.CurrentDatas
                .Where(c => c.RoomID == roomid && c.DType == Constants.HOUR
                    && c.Category == Constants.VECTOR
                    && c.TimeStr.StartsWith(todayStr))
                .Select(c => c.TimeStr)
                .Distinct()
                .ToList();

            // 2. 日列表, 再加上当日的判断
            var days = _context.CurrentDatas
                .Where(c => c.RoomID == roomid && c.DType == Constants.DAY
                    && c.Category == Constants.VECTOR)
                .Select(c => c.TimeStr)
                .Distinct()
                .ToList();
            if (hours.Count > 0)  days.Add(todayStr);

            // 3. 月列表, 再加上当月的判断
            var months = _context.CurrentDatas
                .Where(c => c.RoomID == roomid && c.DType == Constants.MONTH
                    && c.Category == Constants.VECTOR)
                .Select(c => c.TimeStr)
                .Distinct()
                .ToList();
            if (days.Any(d => d.StartsWith(currentMonthStr)))
                months.Add(currentMonthStr);

            // 4. 年列表, 再加上当年的判断
            var years = _context.CurrentDatas
                .Where(c => c.RoomID == roomid && c.DType == Constants.YEAR
                    && c.Category == Constants.VECTOR)
                .Select(c => c.TimeStr)
                .Distinct()
                .ToList();
            if (months.Any(d => d.StartsWith(currentYearStr)))
                years.Add(currentYearStr);

            return new SiteValidDate
                        {
                            RoomID = roomid,
                            HourTimeStrs = hours,
                            DayTimeStrs = days,
                            MonthTimeStrs = months,
                            YearTimeStrs = years
                        };*/
            if (siteId.IsNullOrEmpty()) return new SiteValidDate();

            var siteRoom = _context.siteRooms.Where(s => s.SiteID == siteId).FirstOrDefault();
            if (siteRoom != null)
            {
                return GenValidDate(siteRoom.RoomID,
                _context.CurrentDatas.Where(c => c.Category == Constants.VECTOR
                                                && c.RoomID == siteRoom.RoomID));
            }
            return new SiteValidDate();
        }

        /// <summary>
        /// 获取current_datas中所有有效采集日期的SiteValidDate集合
        /// </summary>
        /// <returns></returns>
        public List<SiteValidDate> getValidDateOfSites()
        {
           
            var datas = new List<SiteValidDate>();
            var roomGroup = _context.CurrentDatas
                .Where(c => c.Category == Constants.VECTOR)
                .GroupBy(c => c.RoomID);

            foreach (var g in roomGroup)
            {
                datas.Add(GenValidDate(g.Key, g));
            }

            return datas;

        }

        /// <summary>
        /// 返回"全市用电报表"数据
        /// </summary>
        /// <param name="timestr">指定的时间串</param>
        /// <returns></returns>
        public List<Dictionary<string, string>> getSiteStatement(string timestr)
        {
            var siteStatement = new List<Dictionary<string, string>>();
            if (string.IsNullOrEmpty(timestr)) return siteStatement;

            
            var currentDatasQuery = _context.CurrentDatas
                .Where(c => c.TimeStr == timestr && c.DType == Constants.MONTH && c.Category == Constants.VECTOR);
            // 1. roomid列表
            var rooms = currentDatasQuery.Select(c => c.RoomID).ToList();
            // 2. 联表查询site_rooms -> energy_datas
            var fakeTimestr = "2023-01";
            var roomMapEnergyData = _context.siteRooms.Where(s => rooms.Contains(s.RoomID))
                .Join(_context.EnergyDatas.Where(e => e.CheckMonth == fakeTimestr), // 正式部署时要将fakeTimestr替换为timestr
                    s => new {SiteID = s.SiteID, MeterID = s.MeterID}, 
                    e => new {SiteID = e.SiteID, MeterID = e.MeterID}, 
                    (s, e) => new {SiteRoom=s, EnergyData=e})
                .ToDictionary(u => u.SiteRoom.RoomID!, u => u);
            
            // 2. groupby去生成最终数据  
            
            foreach (var g in currentDatasQuery.GroupBy(c => c.RoomID))
            {
                var vectorCurrents = g.ToDictionary(c => c.Tag, c => c.Current);
                var proportions = calculateVectorDicToProportions(vectorCurrents);
                var energyData = roomMapEnergyData[g.Key].EnergyData;

                var paymentRemoveLease = float.Parse(energyData.PaymentCheck!) * (1 - proportions[Constants.LEASE]);
                siteStatement.Add(new Dictionary<string, string>
                {
                    {"timestr", timestr},
                    {"county",  energyData.County??""},
                    {"site", energyData.Site! },
                    {"consumption_check", energyData.ConsumptionCheck! },
                    {"payment_check", energyData.PaymentCheck! },
                    {"current_price", energyData.CurrentPrice! },
                    {"proportion_product", proportions[Constants.PRODUCT].ToString()},
                    {"proportion_office", proportions[Constants.OFFICE].ToString()},
                    {"proportion_business", proportions[Constants.BUSINESS].ToString()},
                    {"proportion_lease", proportions[Constants.LEASE].ToString()},
                    {"pue", vectorCurrents[Constants.PUE].ToString()},
                    {"payment_product", (paymentRemoveLease * proportions[Constants.PRODUCT]).ToString()},
                    {"payment_office", (paymentRemoveLease * proportions[Constants.OFFICE]).ToString()},
                    {"payment_business", (paymentRemoveLease * proportions[Constants.BUSINESS]).ToString()},
                    {"payment_lease", (float.Parse(energyData.PaymentCheck!) * proportions[Constants.LEASE]).ToString()},

                });
                
            }
            

            return siteStatement;
        }

        /// <summary>
        /// 返回办公营业预警日报的数据
        /// </summary>
        /// <param name="timeStr">日字串</param>
        /// <returns></returns>
        public List<Dictionary<string, string>> getNonproductiveAlarmData(string timeStr)
        {
            var result = new List<Dictionary<string, string>>();
            // todo 由timestr生成hourList (从当天22点到次日6点)
            DateTime.TryParseExact(timeStr, _timeStrFormat[Constants.DAY].inputFormat, CultureInfo.InvariantCulture,
               DateTimeStyles.None, out DateTime ts);
            var endtime = ts.AddDays(1).AddHours(6);
            var hourList = new List<string>();
            for (var t = ts.AddHours(22); t <= endtime; t = t.AddHours(1))
            {
                hourList.Add(t.ToString(_timeStrFormat[Constants.HOUR].inputFormat));
            }
           
            List<string> nonproductiveTags = [Constants.OFFICE, Constants.BUSINESS];

            var roomidMapSite = _context.siteRooms.ToDictionary(s => s.RoomID!, s => s.Site);
            
            var currentDatasQuery = _context.CurrentDatas
                .Where(c => c.DType == Constants.HOUR && hourList.Contains(c.TimeStr) && nonproductiveTags.Contains(c.Tag));

            foreach (var g in currentDatasQuery.GroupBy(c => c.RoomID))
            {
                var key = g.Key;
                // [{timestr, sum(office+business)
                var datas = g.GroupBy(c => c.TimeStr, (timestr, c) => new { timestr = timestr, current = c.Sum(c => c.Current) })
                    .Where(d => d.current > 1.0)
                    .ToList();
                if (datas.Any())
                {
                    // append result
                    var hours = datas.Select(d => d.timestr.Split('-')[^1]).ToList();
                    var currents = datas.Select(d => d.current).ToList();
                    var estimate = currents.Aggregate(0.0, (total, next) => total + (next * 220 * 1.52) / (54 * 24));
                    result.Add(new Dictionary<string, string>
                    {
                        {"site", roomidMapSite[g.Key]!},  // todo roomid替换为sitename
                        {"costHours", String.Join(',', hours)},
                        {"averageCurrent",  currents.Average().ToString()},
                        {"maxCurrent", currents.Max().ToString()},
                        {"estimateConsumption", estimate.ToString()}
                    });
                }
               
            }

            return result;
        }

        /// <summary>
        /// 静态方法: 按照约定的规则生成单个站点的ValidDate数据
        /// </summary>
        /// <param name="roomid"></param>
        /// <param name="query">指定roomid的currentData数据</param>
        /// <returns></returns>
        public static  SiteValidDate GenValidDate(string roomid,
            IEnumerable<CurrentData> query)
        {
            var todayStr = DateTime.Today.ToString("yyyy-MM-dd");
            var currentMonthStr = DateTime.Today.ToString("yyyy-MM");
            var currentYearStr = DateTime.Today.ToString("yyyy");

            

            // 1. 当日的小时列表
            var hours = query.AsEnumerable()
                .Where(c => c.DType == Constants.HOUR && c.TimeStr.StartsWith(todayStr))
                .Select(c => c.TimeStr)
                .Distinct()
                .ToList();

            // 2. 日列表, 再加上当日的判断
            var days = query.AsEnumerable()
                .Where(c => c.DType == Constants.DAY)
                .Select(c => c.TimeStr)
                .Distinct()
                .ToList();
            if (hours.Count > 0) days.Add(todayStr);

            // 3. 月列表, 再加上当月的判断
            var months = query.AsEnumerable()
                .Where(c => c.DType == Constants.MONTH)
                .Select(c => c.TimeStr)
                .Distinct()
                .ToList();
            if (days.Any(d => d.StartsWith(currentMonthStr)))
                months.Add(currentMonthStr);

            // 4. 年列表, 再加上当年的判断
            var years = query.AsEnumerable()
                .Where(c => c.DType == Constants.YEAR)
                .Select(c => c.TimeStr)
                .Distinct()
                .ToList();
            if (months.Any(d => d.StartsWith(currentYearStr)))
                years.Add(currentYearStr);

            return new SiteValidDate
            {
                RoomID = roomid,
                HourTimeStrs = hours,
                DayTimeStrs = days,
                MonthTimeStrs = months,
                YearTimeStrs = years
            };
        }

        /// <summary>
        /// 将"2024-05-22-09"字串转换为"5月22日9时"
        /// </summary>
        /// <param name="timeStr"></param>
        /// <param name="dType">HOUR/DAY/MONTH</param>
        /// <returns></returns>
        private string convertTimeStr(string timeStr, string dType)
        {
            DateTime.TryParseExact(timeStr, _timeStrFormat[dType].inputFormat, CultureInfo.InvariantCulture,
                DateTimeStyles.None, out DateTime ts);
           return ts.ToString(_timeStrFormat[dType].outputFormat);
        }


        /// <summary>
        /// 由Vector->电流字典计算出各vector占比字典
        /// </summary>
        /// <param name="vectors"></param>
        /// <returns></returns>
        private Dictionary<string, float> calculateVectorDicToProportions(Dictionary<string, float> vectors)
        {
            var proportions = new Dictionary<string, float>();

            
            vectors.TryGetValue(Constants.TOTAL, out float total);
            vectors.TryGetValue(Constants.PRODUCT, out float product);
            vectors.TryGetValue(Constants.OFFICE, out float office);
            vectors.TryGetValue(Constants.BUSINESS, out float business);
            vectors.TryGetValue(Constants.LEASE, out float lease);

            if (total > 0 && total - lease > 0)
            {
                proportions[Constants.PRODUCT] = product / (total - lease);
                proportions[Constants.OFFICE] = office / (total - lease);
                proportions[Constants.BUSINESS] = business / (total - lease);
                proportions[Constants.LEASE] = lease / total;
            
            }else
            {
                proportions[Constants.PRODUCT] = 0;
                proportions[Constants.OFFICE] = 0;
                proportions[Constants.BUSINESS] = 0;
                proportions[Constants.LEASE] = 0;
            }

            return proportions;
        }




    }
}
