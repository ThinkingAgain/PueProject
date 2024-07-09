using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PUMS.Data;
using PUMS.Models;
using System.Globalization;
using System.Linq;

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
                //rtd.Proportions[Constants.LEASE] = lease / total;
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

            proportions[Constants.PRODUCT] = product / (total - lease);
            proportions[Constants.OFFICE] = office / (total - lease);
            proportions[Constants.BUSINESS] = business / (total - lease);
            //proportions[Constants.LEASE] = lease / total;

            return proportions;
        }




    }
}
