using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PUMS.Models
{
    [Table("energy_datas")]
    public class EnergyData
    {
        public int Id { get; set; }

        [Display(Name = "城市")]
        [Column("city")]
        public string? City { get; set; }

        [Display(Name = "区县")]
        [Column("county")]
        public string? County { get; set; }

        [Display(Name = "乡镇")]
        [Column("town")]
        public string? Town { get; set; }

        [Display(Name = "站点名称")]
        [Column("site")]
        public string? Site { get; set; }

        [Display(Name = "电表名称")]
        [Column("meter_name")]
        public string? MeterName { get; set; }

        [Display(Name = "预警状态")]
        [Column("alarm")]
        public string? Alarm { get; set; }

        [Display(Name = "预警原因")]
        [Column("alarm_reason")]
        public string? AlarmReason { get; set; }

        [Display(Name = "报账月份")]
        [Column("check_month")]
        public string? CheckMonth { get; set; }

        [Display(Name = "供电方式")]
        [Column("supply_type")]
        public string? SupplyType { get; set; }

        [Display(Name = "上次抄表时间")]
        [Column("last_meter_reading_time")]
        public string? LastMeterReadingTime { get; set; }

        [Display(Name = "本次抄表时间")]
        [Column("current_meter_reading_time")]
        public string? CurrentMeterReadingTime { get; set; }

        [Display(Name = "报账用电量")]
        [Column("consumption_check")]
        public string? ConsumptionCheck { get; set; }
       
        [Display(Name = "电表用电量")]
        [Column("meter_consumption")]
        public string? MeterConsumption { get; set; }

        [Display(Name = "本次单价")]
        [Column("current_price")]
        public string? CurrentPrice { get; set; }

        [Display(Name = "报账电费")]
        [Column("payment_check")]
        public string? PaymentCheck { get; set; }

        [Display(Name = "归属信息")]
        [Column("vest_in")]
        public string? VestIn { get; set; }

        [Display(Name = "过户状态")]
        [Column("transfer_status")]
        public string? TransferStatus { get; set; }

        [Display(Name = "代缴状态")]
        [Column("pay_behalf_status")]
        public string? PayBehalfStatus { get; set; }

        [Display(Name = "我方共享比例")]
        [Column("cucc_share_ratio")]
        public string? CUCCShareRatio { get; set; }

        [Display(Name = "移动共享比例")]
        [Column("cmcc_share_ratio")]
        public string? CMCCShareRatio { get; set; }

        [Display(Name = "电信共享比例")]
        [Column("ctc_share_ratio")]
        public string? CTCShareRatio { get; set; }

        [Display(Name = "责任部门")]
        [Column("responsible_department")]
        public string? ResponsibleDepartment { get; set; }

        [Display(Name = "责任人")]
        [Column("responsible_person")]
        public string? ResponsiblePerson { get; set; }

        [Display(Name = "责任人联系电话")]
        [Column("responsible_phone")]
        public string? ResponsiblePhone { get; set; }

        [Display(Name = "站点类型")]
        [Column("site_type")]
        public string? SiteType { get; set; }

        [Display(Name = "站点ID")]
        [Column("site_id")]
        public string? SiteID { get; set; }

        [Display(Name = "电表ID")]
        [Column("meter_id")]
        public string? MeterID { get; set; }

        [Display(Name = "上期电表用电量")]
        [Column("last_consumption")]
        public string? LastConsumption { get; set; }

        [Display(Name = "报账日均电量")]
        [Column("consumption_daily_check")]
        public string? ConsumptionDailyCheck { get; set; }

        [Display(Name = "电量超省标比例")]
        [Column("superscalar")]
        public string? Superscalar { get; set; }

        [Display(Name = "生产标")]
        [Column("scalar")]
        public string? Scalar { get; set; }

        [Display(Name = "营服中心组织")]
        [Column("service_center")]
        public string? ServiceCenter { get; set; }

        [Display(Name = "联通物理站址编码")]
        [Column("cucc_site_code")]
        public string? CUCCSiteCode { get; set; }

        [Display(Name = "网格名称")]
        [Column("grid_name")]
        public string? GridName { get; set; }

        [Display(Name = "责任人联系电话")]
        [Column("responsible_phone2")]
        public string? ResponsiblePhone2 { get; set; }

        [Display(Name = "是否光伏发电")]
        [Column("photovoltaic")]
        public string? Photovoltaic { get; set; }

        [Display(Name = "生产")]
        [Column("production")]
        public string? Production { get; set; }

        [Display(Name = "营业")]
        [Column("business")]
        public string? Business { get; set; }

        [Display(Name = "办公")]
        [Column("office")]
        public string? Office { get; set; }

        [Display(Name = "能耗状态")]
        [Column("consumption_status")]
        public string? ConsumptionStatus { get; set; }


    }
}
