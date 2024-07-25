namespace PUMS.Models
{
    public class VectorSeries
    {
        public List<string> TimeSeries { get; set; } = new List<string>();
        public List<float> Total { get; set; } = new List<float>();
        public List<float> Product { get; set;} = new List<float>();
        public List<float> Office { get; set; } = new List<float>();
        public List<float> Business { get; set; } = new List<float>();
        public List<float> Lease { get; set; } = new List<float>();
        public List<float> Device { get; set; } = new List<float>();
        public List<float> Pue { get; set; } = new List<float>();
    }
}
