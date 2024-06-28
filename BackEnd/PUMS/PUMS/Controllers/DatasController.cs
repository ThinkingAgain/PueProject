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
        public async Task<ActionResult<RealTimeData>> GetRealTimeDataAsync(string siteId)
        {
            return await _service.getSiteRealTimeDataAsync(siteId);
        }

        /// <summary>
        /// 指定站点某日的Vector序列数据, 默认为当日
        /// </summary>
        /// <param name="siteId"></param>
        /// <returns></returns>
        [HttpGet("collectdatas/currentseriesdata/{siteId}")]
        [HttpGet("collectdatas/currentseriesdata/{siteId}/{dayTimeStr}")]
        public ActionResult<VectorSeries> GetCurrentSeriesData(string siteId, 
            string? dayTimeStr)
        {
            return  _service.getVectorSeriesOfOneDay(siteId, 
                dayTimeStr?? DateTime.Today.ToString("yyyy-MM-dd"));
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
