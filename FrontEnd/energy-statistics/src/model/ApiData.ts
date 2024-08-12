
// 定义<全市站点用电量>表格数据源结构
export type SiteStatementData = {
    timestr: string;
    county: string;
    consumption_check: number;
    payment_check: number;
    current_price: number;
    proportion_product: number;
    proportion_office: number;
    proportion_business: number;
    proportion_lease: number;
    pue: number;
    payment_product: number;
    payment_office: number;
    payment_business: number;
    payment_lease: number;
}