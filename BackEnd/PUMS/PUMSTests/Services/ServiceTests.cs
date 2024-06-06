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
            var data = await service.getSiteRealTimeDataAsync(siteId);
            Assert.IsTrue(data is RealTimeData);
            Assert.AreEqual("聊白洼机房", data.RoomID);

            await Console.Out.WriteLineAsync("hello Test");
            //Assert.AreEqual("146503", data.SiteID);
        }

        [TestMethod()]
        public void getCurrentSeriesAsyncTestAsync()
        {
            var service = new Service(_context);
            var siteId = "146503";  // 白洼驻地
            var data = service.getCurrentSeries(siteId);
            Assert.IsTrue(data is CurrentSeries);
        }


        [TestMethod()]
        public void freedomTest()
        {

            var a = new List<int>() { 1, 2, 3 };
            var b = new List<int>() { 4, 5, 6 };
            var t = a.Zip(b, (a, b) => a + b).ToList();
            var rand = new Random();
            var x = (rand.Next(-10, 10) / 100);


            Console.WriteLine("hello");

            Assert.IsTrue("hello" is string);
        }


    }
}