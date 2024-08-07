﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PUMS.Models
{
    [Table("current_datas")]
    [PrimaryKey(nameof(RoomID), nameof(TimeStr), nameof(DType), nameof(Category), nameof(Tag))]
    public class CurrentData
    {
        [Display(Name = "采集机房")]
        [Column("roomid")]
        public string RoomID { get; set; } = string.Empty;

        [Display(Name = "时间")]
        [Column("timestr")]
        public string TimeStr { get; set; } = string.Empty;

        [Display(Name = "时间类型")]
        [Column("dtype")]
        public string DType { get; set; } = string.Empty;

        [Display(Name = "数据类型")]
        [Column("category")]
        public string Category { get; set; } = string.Empty;

        [Display(Name = "数据标签")]
        [Column("tag")]
        public string Tag { get; set; } = string.Empty;

        [Display(Name = "电流值")]
        [Column("current")]
        public float Current { get; set; }
        
    }
}
