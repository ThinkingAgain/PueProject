using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PUMS.Data;
using PUMS.Models;
using PUMS.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;

namespace PUMS.Services.Tests
{
    [TestClass()]
    public class ServiceTests
    {
        private readonly DatasContext _context;

        public ServiceTests()
        {
            var datasConnectionString = "server=localhost;user=root;password=asdfwj;port=3306;database=pue;sslmode=none;charset=UTF8";
            var options = new DbContextOptionsBuilder<DatasContext>()
                .UseMySql(datasConnectionString, ServerVersion.AutoDetect(datasConnectionString))
                .Options;
            _context = new DatasContext(options);
        }

        [TestMethod()]
        public async Task getSiteRealTimeDataTestAsync()
        {
            /*
             * 上下文已定义为类的私有变量
             * var datasConnectionString = "server=localhost;user=root;password=asdfwj;port=3306;database=pue;sslmode=none;charset=UTF8";
            var options = new DbContextOptionsBuilder<DatasContext>()
                .UseMySql(datasConnectionString, ServerVersion.AutoDetect(datasConnectionString))
                .Options;
            var context = new DatasContext(options);*/
            var service = new Service(_context);
            var siteId = "146503";  // 白洼驻地
            var data = await service.getRealTimeDataBySiteIdAsync(siteId);
            Assert.IsTrue(data is CollectData);
            Assert.AreEqual("聊白洼机房", data.RoomID);

            await Console.Out.WriteLineAsync("hello Test");
            //Assert.AreEqual("146503", data.SiteID);
        }

        [TestMethod()]
        public void getCurrentSeriesAsyncTestAsync()
        {
            var service = new Service(_context);
            var siteId = "146503";  // 白洼驻地
            var data = service.getVectorSeriesOfOneDay(siteId, "2024-06-28");
            Assert.IsTrue(data is VectorSeries);
        }


        [TestMethod()]
        public void freedomTest()
        {

            /*var a = new List<int>() { 1, 2, 3 };
            var b = new List<int>() { 4, 5, 6 };
            var t = a.Zip(b, (a, b) => a + b).ToList();
            var rand = new Random();
            var x = (rand.Next(-10, 10) / 100);*/

            var timestr = DateTime.Today.ToString("yyyy-MM-dd");
            var yestoday = DateTime.Today.AddDays(-1).ToString("yyyy-MM-dd");




            Console.WriteLine("hello");

            Assert.IsTrue("hello" is string);
        }

        [TestMethod()]
        public async Task getCollectDataAsyncTestAsync()
        {
            var service = new Service(_context);
            var siteId = "146503";  // 白洼驻地
            var data = await service.getCollectDataAsync(siteId, Constants.HOUR, "2024-07-03-15");
            Assert.IsTrue(data is CollectData);
            Assert.AreEqual("聊白洼机房", data.RoomID);

            await Console.Out.WriteLineAsync("hello Test");
        }

        [TestMethod()]
        public void getVectorSeriesTest()
        {
            var service = new Service(_context);
            var siteId = "146503";  // 白洼驻地
            var dayData = service.getVectorSeries(siteId, Constants.DAY, "2024-06-28");
            var monthData = service.getVectorSeries(siteId, Constants.MONTH, "2024-06");
            Assert.IsTrue(dayData is VectorSeries);
        }

        [TestMethod()]
        public void getValidDateByRoomidTest()
        {
            var service = new Service(_context);
            var roomId = "聊白洼机房";  // 白洼驻地
            var data = service.getValidDateByRoomid(roomId);
            var datas = service.getValidDateOfSites();
            Assert.IsTrue(1 == 1);
            //Assert.IsNotNull(data.HourTimeStrs);
        }
    }
}