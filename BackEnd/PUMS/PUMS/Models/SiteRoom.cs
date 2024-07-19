using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PUMS.Models
{
    [Table("site_rooms")]
    [PrimaryKey(nameof(SiteID), nameof(RoomID))]
    public class SiteRoom
    {
        [Display(Name = "站点ID")]
        [Column("site_id")]
        public string? SiteID { get; set; }

        [Display(Name = "采集机房")]
        [Column("roomid")]
        public string? RoomID { get; set; }

        [Display(Name = "站点名称")]
        [Column("site")]
        public string? Site { get; set; }

        [Display(Name = "电表ID")]
        [Column("meter_id")]
        public string? MeterID { get; set; }
    }
}
