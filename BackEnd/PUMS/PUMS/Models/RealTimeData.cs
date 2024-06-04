namespace PUMS.Models
{
    public class RealTimeData
    {
        public string SiteID { get; set; }
        public string RoomID { get; set; }
        public string Site { get; set; }
        public string TimeStr { get; set; }

        public float PUE { get; set; }
        public Dictionary<string, float> TagCurrents { get; set; }

        public Dictionary<string, float> Proportions { get; set; }

    }
}
