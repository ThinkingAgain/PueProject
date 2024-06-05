using Microsoft.EntityFrameworkCore;
using PUMS.Data;
using PUMS.Models;

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
        /// 读取<current_datas>中最后时刻的数据, 生成RealTimeData类型的数据
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

            rtd.TagCurrents = await currentQuery.Where(c => c.TimeStr == realTimestr)
                .ToDictionaryAsync(c => c.Tag, c => c.Current);

            rtd.PUE = rtd.TagCurrents.TryGetValue(Constants.PRODUCT, out float facilityCurrent) &&
                rtd.TagCurrents.TryGetValue(Constants.DEVICE, out float equipmentCurrent) ?
                facilityCurrent / equipmentCurrent : -1;

            if (rtd.TagCurrents.TryGetValue(Constants.TOTAL, out float total))
            {
                rtd.TagCurrents.TryGetValue(Constants.OFFICE, out float office);
                rtd.TagCurrents.TryGetValue(Constants.BUSINESS, out float business);
                rtd.TagCurrents.TryGetValue(Constants.LEASE, out float lease);

                rtd.Proportions[Constants.PRODUCT] = facilityCurrent / total;
                rtd.Proportions[Constants.OFFICE] = office / total;
                rtd.Proportions[Constants.BUSINESS] = business / total;
                rtd.Proportions[Constants.LEASE] = lease / total;
            }


            return rtd;
        }

    }
}
