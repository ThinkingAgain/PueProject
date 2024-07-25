namespace PUMS.Models
{
    public class CollectData
    {
        public string SiteID { get; set; }
        public string RoomID { get; set; }
        public string Site { get; set; }
        public string TimeStr { get; set; }

        //public float PUE { get; set; } 放在TagCurrents中了
        public Dictionary<string, float> TagCurrents { get; set; }

        public Dictionary<string, float> Proportions { get; set; } = new Dictionary<string, float>();

    }
}
