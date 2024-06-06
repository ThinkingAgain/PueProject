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

        [HttpGet("collectdatas/realtimedata/{siteId}")]
        public async Task<ActionResult<RealTimeData>> GetRealTimeDataAsync(string siteId)
        {
            return await _service.getSiteRealTimeDataAsync(siteId);
        }

        [HttpGet("collectdatas/currentseriesdata/{siteId}")]
        public ActionResult<CurrentSeries> GetCurrentSeriesData(string siteId)
        {
            return  _service.getCurrentSeries(siteId);
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
