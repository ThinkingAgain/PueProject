namespace PUMS.Models
{
    /// <summary>
    /// 站点的有效采集数据的日期列表, 分为时, 日, 月,年四类
    /// </summary>
    public class SiteValidDate
    {
        public string RoomID { get; set; }
        public List<string> HourTimeStrs { get; set;}
        public List<string> DayTimeStrs { get;set;}
        public List<string> MonthTimeStrs { get; set;}
        public List<string> YearTimeStrs { get; set;}
    }
}
