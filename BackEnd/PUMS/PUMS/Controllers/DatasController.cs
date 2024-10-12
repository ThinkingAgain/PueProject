using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PUMS.Data;
using PUMS.Models;
using PUMS.Services;
using System.Security.Policy;

namespace PUMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasController : ControllerBase
    {
        private readonly DatasContext _datasContext;
        private readonly Service _service;

        public DatasController(DatasContext datasContext, Service service)
        {
            _datasContext = datasContext;
            _service = service;
        }

        /// <summary>
        /// 指定站点某月的能源数据, 默认为存储的最后月份
        /// </summary>
        /// <param name="siteId"></param>
        /// <param name="meterId"></param>
        /// <param name="checkMonth"></param>
        /// <returns></returns>
        [HttpGet("energydata/{siteId}/{meterId}")]
        [HttpGet("energydata/{siteId}/{meterId}/{checkMonth}")]
        public ActionResult<EnergyData> EnergyData(string siteId, string meterId,
            string? checkMonth)
        {
            
            var query = _datasContext.EnergyDatas
                .Where(e => e.SiteID == siteId && e.MeterID == meterId);

            return (string.IsNullOrEmpty(checkMonth) ?
                query.OrderByDescending(e => e.CheckMonth).FirstOrDefault()
                : query.Where(e => e.CheckMonth == checkMonth).FirstOrDefault())
                ?? new Models.EnergyData();

        }

        /// <summary>
        /// 指定站点的实时数据
        /// </summary>
        /// <param name="siteId"></param>
        /// <returns>RealTimeData</returns>
        [HttpGet("collectdatas/realtimedata/{siteId}")]
        public async Task<ActionResult<CollectData>> GetRealTimeDataAsync(string siteId)
        {
            return await _service.getRealTimeDataBySiteIdAsync(siteId);
        }

        /// <summary>
        /// 指定站点 指定时间类型和指定时间点的CollectData
        /// 缺省为前一日的dtype=DAY类型的CollectData
        /// </summary>
        /// <param name="siteId"></param>
        /// <param name="dType"></param>
        /// <param name="timeStr"></param>
        /// <returns></returns>
        [HttpGet("collectdatas/sometime/{siteId}")]
        [HttpGet("collectdatas/sometime/{siteId}/{dType}/{timeStr}")]
        public async Task<ActionResult<CollectData>> GetCollectData(string siteId, 
            string? dType, string? timeStr)
        {
            return await _service.getCollectDataAsync(siteId, 
                dType ?? Constants.DAY, 
                timeStr ?? DateTime.Today.AddDays(-1).ToString("yyyy-MM-dd"));
        }

        /// <summary>
        /// 指定站点某日的电流序列数据, 默认为当日
        /// </summary>
        /// <param name="siteId"></param>
        /// <returns></returns>
        [HttpGet("collectdatas/currentseriesdata/{siteId}")]
        [HttpGet("collectdatas/currentseriesdata/{siteId}/{timeType}/{timeStr}")]
        public ActionResult<VectorSeries> GetCurrentSeriesData(string siteId, string? timeType,
            string? timeStr)
        {
            if (String.IsNullOrEmpty(timeType) || String.IsNullOrEmpty(timeStr))
            {
                return _service.getVectorSeriesOfOneDay(siteId, 
                    DateTime.Today.ToString("yyyy-MM-dd"));
            }
            return  _service.getVectorSeries(siteId, timeType.ToUpper(), timeStr);
        }

        /// <summary>
        /// 指定站点某日的PUE序列数据, 默认为当日
        /// </summary>
        /// <param name="siteId"></param>
        /// <param name="timeStr"></param>
        /// <returns></returns>
        [HttpGet("collectdatas/pueseriesdata/{siteId}")]
        [HttpGet("collectdatas/pueseriesdata/{siteId}/{timeType}/{timeStr}")]
        public ActionResult GetPueSeriesData(string siteId, string? timeType,
            string? timeStr)
        {
            VectorSeries series;
            if (String.IsNullOrEmpty(timeType) || String.IsNullOrEmpty(timeStr))            
                series = _service.getVectorSeriesOfOneDay(siteId, DateTime.Today.ToString("yyyy-MM-dd"));            
            else            
                series = _service.getVectorSeries(siteId, timeType.ToUpper(), timeStr);
              
            return Ok(new { 
                timeSeries = series.TimeSeries,
                product = series.Product,
                device = series.Device,
                pue = series.Pue
            });
        }

        /// <summary>
        /// 返回站点配置信息
        /// </summary>
        /// <returns></returns>
        [HttpGet("collectdatas/sitedatas")]
        public ActionResult<IEnumerable<SiteRoom>> GetSiteRooms()
        {
            return _datasContext.siteRooms.ToList();
        }

        /// <summary>
        /// 返回指定站点的有效采集数据日期，分为时(只查询当日的有效时数据), 日, 月,年四类
        /// 无roomid则返回所有站点（指current_datas中有的站点）的有效采集数据日期
        /// </summary>
        /// <param name="roomid"></param>
        /// <returns></returns>
        [HttpGet("collectdatas/sitevaliddates")]
        [HttpGet("collectdatas/sitevaliddates/{siteId?}")]
        public ActionResult<IEnumerable<SiteValidDate>> GetSiteValidDates(string? siteId)
        {
            if (siteId.IsNullOrEmpty())
                return _service.getValidDateOfSites();
            return new List<SiteValidDate> { _service.getValidDateBySiteId(siteId) };
        }

        /// <summary>
        /// 返回"全市用电报表"数据, 以站点为单位
        /// </summary>
        /// <param name="timestr">指定时间串</param>
        /// <returns></returns>
        [HttpGet("statistics/sitestatement/{timestr}")]
        public ActionResult<List<Dictionary<string, string>>> GetSiteStatement(string timestr)
        {
            return _service.getSiteStatement(timestr);
        }

        /// <summary>
        /// 返回"办公营业用电预警表"数据, 日报表
        /// </summary>
        /// <param name="timestr">指定日字符串</param>
        /// <returns></returns>
        [HttpGet("statistics/nonproductive-alarm/{timestr}")]
        public ActionResult<List<Dictionary<string, string>>> GetNonproductiveAlarm(string timestr)
        {
            return _service.getNonproductiveAlarmData(timestr);
        }

        /// <summary>
        /// 返回"二级用电点夜间用电预警表"数据, 日报表
        /// </summary>
        /// <param name="timestr">指定日字符串</param>
        /// <returns></returns>
        [HttpGet("statistics/l2site-alarm/{timestr}")]
        public ActionResult<List<Dictionary<string, string>>> GetLevel2SiteAlarm(string timestr)
        {
            return _service.getLevel2SiteAlarmData(timestr);
        }

        /// <summary>
        /// 返回"实时报表"数据
        /// </summary>
        /// <param name="timestr">指定时刻字串</param>
        /// <returns></returns>
        [HttpGet("statistics/sometime")]
        [HttpGet("statistics/sometime/{dtype}/{timestr}")]
        public ActionResult<List<CollectData>> GetRealTableDatas(string? dtype, 
            string? timestr) =>
         _service.getCollectDatasByTimestr(dtype ?? Constants.HOUR, 
                timestr ?? DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd-HH"));

        /// <summary>
        /// 返回"二级用电点实时报表"数据
        /// </summary>
        /// <param name="timestr">指定时刻字串</param>
        /// <returns></returns>
        [HttpGet("statistics/l2site-sometime")]
        [HttpGet("statistics/l2site-sometime/{dtype}/{timestr}")]
        public ActionResult<List<Dictionary<string, string>>> GetLevel2SiteRealTableDatas(string? dtype,
            string? timestr) =>
         _service.getLevel2SiteDatasByTimestr(dtype ?? Constants.HOUR,
                timestr ?? DateTime.Now.AddHours(-1).ToString("yyyy-MM-dd-HH"));






        #region 测试
        [HttpGet("test")]
        public IActionResult Test() 
        {

            string[] tt = ["a", "b"];
            float[] t2 = [1.1f, 2.2f];
            return Ok(new { message="ok", content = t2 });
        }
        #endregion

    }
}
