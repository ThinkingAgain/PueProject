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

        public Service(DatasContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 读取<current_datas>中最晚时刻的某站点数据, 生成RealTimeData类型的数据
        /// </summary>
        /// <param name="siteId">能源系统站点ID</param>
        /// <returns></returns>
        public async Task<RealTimeData> getSiteRealTimeDataAsync(string siteId)
        {
            var siteRoom = _context.siteRooms.Where(s => s.SiteID == siteId).FirstOrDefault();            
            if (siteRoom == null ) return new RealTimeData();

            var currentQuery = _context.CurrentDatas.Where(c => c.RoomID == siteRoom.RoomID && c.DType == "HOUR");
            
            var realTimestr = currentQuery.OrderByDescending(c => c.TimeStr).FirstOrDefault()?.TimeStr;
            if (realTimestr == null) return new RealTimeData();

            /// 生成RealTimeData的步骤:
            /// 1. 直接可得: siteId, roomid, site, timestr
            /// 2. LINQ生成tagCurrents
            /// 3. 由tagCurrents计算得来: pue, proportions

            var rtd = new RealTimeData
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

                rtd.Proportions[Constants.PRODUCT] = product / total;
                rtd.Proportions[Constants.OFFICE] = office / total;
                rtd.Proportions[Constants.BUSINESS] = business / total;
                rtd.Proportions[Constants.LEASE] = lease / total;
            }


            return rtd;
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

                    vs.TimeSeries.Add(convertTimeStr(cg.Key));
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
        /// <returns></returns>
        private string convertTimeStr(string timeStr)
        {
            DateTime.TryParseExact(timeStr, "yyyy-MM-dd-HH", CultureInfo.InvariantCulture,
                DateTimeStyles.None, out DateTime ts);
           return ts.ToString("M月d日H时");
        }





    }
}
