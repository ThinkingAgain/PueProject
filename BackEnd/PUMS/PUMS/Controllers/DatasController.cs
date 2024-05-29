using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PUMS.Data;
using PUMS.Models;

namespace PUMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasController : ControllerBase
    {
        private readonly DatasContext _datasContext; 

        public DatasController(DatasContext datasContext)
        {
            _datasContext = datasContext;
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

        #region 测试
        [HttpGet("test")]
        public ActionResult<EnergyData> Test() 
        { 
            return _datasContext.EnergyDatas.First();
        }
        #endregion

    }
}
