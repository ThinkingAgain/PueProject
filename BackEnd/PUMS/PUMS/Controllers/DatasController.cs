using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PUMS.Data;
using PUMS.Models;
using PUMS.Services;

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
        /// <param name="dayTimeStr"></param>
        /// <returns></returns>
        [HttpGet("collectdatas/pueseriesdata/{siteId}")]
        [HttpGet("collectdatas/pueseriesdata/{siteId}/{dayTimeStr}")]
        public ActionResult GetPueSeriesData(string siteId, string? dayTimeStr)
        {
            var currentSeries = _service.getVectorSeriesOfOneDay(siteId, 
                                        dayTimeStr ?? DateTime.Today.ToString("yyyy-MM-dd"));
            
            return Ok(new { 
                timeSeries = currentSeries.TimeSeries,
                product = currentSeries.Product,
                device = currentSeries.Device,
                pue = currentSeries.Pue
            });
        }




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
