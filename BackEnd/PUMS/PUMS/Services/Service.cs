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
        public async Task<List<CurrentData>> getSiteRealTimeDataAsync(string siteId)
        {
            var roomId = _context.siteRooms.Where(s => s.SiteID == siteId).FirstOrDefault()?.RoomID;            
            if (roomId == null ) return new List<CurrentData>(){ new CurrentData()};

            var currentQuery = _context.CurrentDatas.Where(c => c.RoomID == roomId && c.DType == "HOUR");
            
            var realTimestr = currentQuery.OrderByDescending(c => c.TimeStr).FirstOrDefault()?.TimeStr;
            if (realTimestr == null) return new List<CurrentData>() { new CurrentData() };

            /// 生成RealTimeData的步骤:
            /// 1. 直接可得: siteId, roomid, site, timestr
            /// 2. 循环迭代生成tagCurrents
            /// 3. 由tagCurrents计算得来: pue, proportions
            
            
            foreach (var cd in  await currentQuery.Where(c => c.TimeStr == realTimestr).ToListAsync())
            {

            }
            // 生成RealTimeData数据
            return currentDatas;
        }

    }
}
