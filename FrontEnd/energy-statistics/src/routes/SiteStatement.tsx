import {ProColumns, ProTable} from "@ant-design/pro-components";
import {SiteStatementData} from "../model/ApiData.ts";
import {Button} from "antd";
import {exportTwoLevelHeaderExcel} from "../service/tools.tsx";
import {useState} from "react";

 async function  fetchSiteStatement(url: string): Promise<SiteStatementData[]> {
    let data: SiteStatementData[];
    //console.log(url)
    await fetch(url)
        .then((res) => res.json())
        .then((d) => {
            data = d
        })
        .catch(err => {
            alert("获取后台数据错误!")
            console.log(err)
            return data
        })
    return data!;
}

const columns: ProColumns<SiteStatementData>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
        fixed: "left",
    },
    {
        title: '区县',
        dataIndex: 'county',
        fixed: "left",
        width: 90,
        ellipsis: true,
        search: false,

    },
    {
        title: '站点',
        dataIndex: "site",
        fixed: "left",
        width: 150,
        ellipsis: true,
        search: false,
    },
    {
        title: '报账月',
        dataIndex: "timestr",
        valueType: "dateMonth",

    },
    {
        title: '能源系统信息',
        search: false,
        children: [
            {
                title: '电量(度)',
                dataIndex: "consumption_check",
                search: false,
            },
            {
                title: '电费',
                dataIndex: 'payment_check',
                valueType: 'money',
                search: false,
                width: 100,
            },
            {
                title: '电价',
                dataIndex: "current_price",
                valueType: 'money',
                search: false,
            },
        ]
    },
    {
        title: '企业综合能耗系统电流分摊比例',
        search: false,
        children: [
            {
                title: '生产用电',
                dataIndex: "proportion_product",
                valueType: () => ({type: "percent", precision: 0}),
                search: false,
            },
            {
                title: '办公用电',
                dataIndex: "proportion_office",
                valueType: () => ({type: "percent", precision: 0}),
                search: false,
            },
            {
                title: '营业用电',
                dataIndex: "proportion_business",
                valueType: () => ({type: "percent", precision: 0}),
                search: false,
            },
            {
                title: '外租用电',
                dataIndex: "proportion_lease",
                valueType: () => ({type: "percent", precision: 0}),
                search: false,
            },
        ]
    },
    {
        title: "电费分摊",
        search: false,
        children: [
            {
                title: '生产电费',
                dataIndex: "payment_product",
                valueType: 'money',
                search: false,
                width: 100,
            },
            {
                title: '办公电费',
                dataIndex: "payment_office",
                valueType: 'money',
                search: false,
            },
            {
                title: '营业电费',
                dataIndex: "payment_business",
                valueType: 'money',
                search: false,
            },
            {
                title: '外租电费',
                dataIndex: "payment_lease",
                valueType: 'money',
                search: false,
            },
        ]
    },



    {
        title: 'PUE',
        dataIndex: "pue",
        fixed: "right",
        width: 60,
        search:false,
    },

]




export const SiteStatement = () => {
    const [data, setData] = useState<SiteStatementData[]>([]);
     return (
        <ProTable<SiteStatementData>
            columns={columns}
            cardBordered
            bordered
            scroll={{x: 1300}}
            pagination={{ pageSize: 10}}
            request={async (params, sort, filter) => {
                console.log(params, sort, filter);
                const {timestr} = params;
                const apiData = await fetchSiteStatement(`/api/datas/statistics/sitestatement/${timestr}`);
                //console.log(data[4])
                apiData.forEach((item) => {
                    item['consumption_check'] = Math.round(item['consumption_check']);
                    item['proportion_product'] *= 100;
                    item['proportion_office'] *= 100;
                    item['proportion_business'] *= 100;
                    item['proportion_lease'] *= 100;
                    item['pue'] = Math.round(item['pue'] * 100) / 100
                })
                setData(apiData);
                //console.log(data[4])
                return {
                    data: apiData,
                    success: true
                }
            }}
            toolBarRender={() => [
                <Button type="primary" disabled={!data || data.length === 0}
                        key="out"
                        onClick={() => exportTwoLevelHeaderExcel<SiteStatementData>(columns, data, "全市站点用电量.xlsx")}>
                    导出数据
                </Button>
            ]}

        />
    )
}

export default  SiteStatement