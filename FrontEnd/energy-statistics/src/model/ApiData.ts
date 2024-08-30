
// 定义<全市站点用电量>表格数据源结构
export type SiteStatementData = {
    timestr: string,
    county: string,
    consumption_check: number,
    payment_check: number,
    current_price: number,
    proportion_product: number,
    proportion_office: number,
    proportion_business: number,
    proportion_lease: number,
    pue: number,
    payment_product: number,
    payment_office: number,
    payment_business: number,
    payment_lease: number,
}

// 定义<办公营业用电预警日报>的数据结构
export type NonproductiveAlarmData = {
    County: string,
    site: string,
    timestr: string,
    costHours: string,
    averageCurrent: number,
    maxCurrent: number,
    estimateConsumption: number,    // 估算用电度数
}

// 定义<实时报表>的数据结构
export type CollectData = {
    siteID: string,
    county: string,
    roomID: string,
    timeStr: string,
    tagCurrents: {
        BUSINESS: number,
        DEVICE: number,
        LEASE: number,
        OFFICE: number,
        PRODUCT: number,
        PUE: number,
        TOTAL: number,
        [proName: string]: number,
    },
    proportions: {
        PRODUCT: number,
        OFFICE: number,
        BUSINESS: number,
        LEASE: number,
        [proName: string]: number,
    },
}