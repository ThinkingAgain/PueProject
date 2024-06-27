建库
CREATE DATABASE pue character set utf8;

建表
CREATE TABLE energy_datas
     (
        id  int  primary key auto_increment,
        city    varchar(200) ,
        county  varchar(200) ,
        town    varchar(200) ,
        site    varchar(200) ,
        meter_name  varchar(200) ,
        alarm   varchar(200) ,
        alarm_reason    varchar(500) ,
        payment_type    varchar(200) ,
        check_month varchar(200) ,
        accounting_month    varchar(200) ,
        supply_type varchar(200) ,
        lump    varchar(200) ,
        lump_type   varchar(200) ,
        meter_start_reading varchar(200) ,
        meter_end_reading   varchar(200) ,
        last_meter_reading_time varchar(200) ,
        current_meter_reading_time  varchar(200) ,
        consumption_check   varchar(200) ,
        site_consumption    varchar(200) ,
        off_consumption varchar(200) ,
        meter_consumption   varchar(200) ,
        consumption_adjust  varchar(200) ,
        consumption_adjust_memo varchar(200) ,
        rated_consumption   varchar(200) ,
        current_price   varchar(200) ,
        lump_price  varchar(200) ,
        payment_adjust  varchar(200) ,
        payment_adjust_memo varchar(200) ,
        payment_check   varchar(200) ,
        tower_fee   varchar(200) ,
        tower_tax   varchar(200) ,
        payment_excluding_tax   varchar(200) ,
        payment_period  varchar(200) ,
        rated_payment   varchar(200) ,
        tower_ac_load   varchar(200) ,
        tower_dc_load   varchar(200) ,
        environment_factor  varchar(200) ,
        dc_load varchar(200) ,
        ac_load varchar(200) ,
        power_loss  varchar(200) ,
        vest_in varchar(200) ,
        transfer_status varchar(200) ,
        pay_behalf_status   varchar(200) ,
        cucc_share_ratio    varchar(200) ,
        cmcc_share_ratio    varchar(200) ,
        ctc_share_ratio varchar(200) ,
        other_share_ratio   varchar(200) ,
        lease_site  varchar(200) ,
        lease_location  varchar(200) ,
        responsible_department  varchar(200) ,
        responsible_person  varchar(200) ,
        responsible_phone   varchar(200) ,
        entry_time  varchar(200) ,
        entry_person    varchar(200) ,
        rate    varchar(200) ,
        site_attribution    varchar(200) ,
        site_type   varchar(200) ,
        site_alias  varchar(200) ,
        process_number  varchar(200) ,
        note_number varchar(200) ,
        note_type   varchar(200) ,
        site_id varchar(200) ,
        meter_id    varchar(200) ,
        self_account_number varchar(200) ,
        adjust_mul_rate varchar(200) ,
        last_consumption    varchar(200) ,
        last_adjust_mul_rate    varchar(200) ,
        consumption_loss    varchar(200) ,
        consumption_daily_check varchar(200) ,
        superscalar varchar(200) ,
        scalar  varchar(200) ,
        period_days varchar(200) ,
        service_center_superior varchar(200) ,
        service_center  varchar(200) ,
        tower_site_code varchar(500) ,
        cucc_site_code  varchar(200) ,
        grid_name   varchar(200) ,
        responsible_phone2  varchar(200) ,
        payee   varchar(200) ,
        photovoltaic    varchar(200) ,
        charge_off  varchar(200) ,
        county_audit    varchar(200) ,
        county_audit_person varchar(200) ,
        county_audit_time   varchar(200) ,
        county_audit_reason varchar(200) ,
        city_audit  varchar(200) ,
        city_audit_person   varchar(200) ,
        city_audit_time varchar(200) ,
        city_audit_reason   varchar(200) ,
        accounting_audit    varchar(200) ,
        accounting_audit_person varchar(200) ,
        accounting_audit_time   varchar(200) ,
        accounting_audit_reason varchar(200) ,
        production  varchar(200) ,
        business    varchar(200) ,
        office  varchar(200) ,
        information_support varchar(200) ,
        investment  varchar(200) ,
        advance varchar(200) ,
        by_interface    varchar(200) ,
        consumption_status  varchar(200) 
     );
     
表增加自增主键  
alter table pue.energy_datas add column id int auto_increment primary key;

CSV倒入表：
LOAD DATA INFILE '/var/lib/mysql-files/energy_datas_init_noid.csv'
INTO TABLE energy_datas
FIELDS TERMINATED BY ',' 
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n' 
IGNORE 1 ROWS;





/* 数据处理程序 - python 生成的表 ***********************************************************/

/* todos   存储记录处理 <时间点-类型> 的处理完成状态 */
CREATE TABLE todos
    (
        timestr    varchar(30) not null ,
        dtype  varchar(30) not null,  /* HOUR/DAY/MONTH */
        status    varchar(30) ,  /* COMPLETED/NODATAS/UNCOMPLETED */
        primary key (timestr, dtype)
	);
  

/* current_datas   存储采集及计算汇总的电流值 */
CREATE TABLE current_datas
    (
        roomid  varchar(60) not null ,
		timestr    varchar(30) not null ,
        dtype  varchar(30) not null,  /* HOUR/DAY/MONTH */
		category varchar(30) not null,  /* TAG/POINT/VECTOR */
        tag   varchar(200) not null,  /* TOTAL/PRODUCT/DEVICE/BUSINESS/OFFICE/LEASE */
		current		float,
        primary key (roomid,timestr,dtype,category,tag)
	);
	

/* site_rooms   存储能源系统和采集系统的站点对应关系 */
CREATE TABLE site_rooms
    (
        site_id varchar(60) not null,
		roomid  varchar(60) not null ,
		site    varchar(200),      
        primary key (site_id,roomid)
	);
	

/* collector  采集元数据定义: 采集标签与采集点的对应关系 tag -> collectpoint  */
CREATE TABLE collector
    (
        roomid  varchar(60) not null ,
		groupid varchar(200) not null,
		tag    varchar(200) not null, 
		collectpoint varchar(60),
        primary key (roomid,groupid,tag)
	);
	

	

/* vector_formula   vector是指TOTAL/PRODUCT/DEVICE/BUSINESS/OFFICE/LEASE, 本表定义如何用采集点数据计算出vector */
CREATE TABLE vector_formula
    (
        roomid  varchar(60) not null,
		vector varchar(60) not null,
		formula varchar(300),      
        primary key (roomid,vector)
	);
	

