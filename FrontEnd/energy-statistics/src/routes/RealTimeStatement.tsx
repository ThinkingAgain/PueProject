import {CollectData} from "../model/ApiData.ts";
import type {ProColumns} from "@ant-design/pro-components";
import {ProTable} from "@ant-design/pro-components";
import {fetchData} from "../service/fetch.tsx";
import {Button} from 'antd'
import {convertDateTimeToTimeStr, convertTimeStrToDateTime, exportTwoLevelHeaderExcel} from "../service/tools.tsx";
import {useState} from "react";

const columns: ProColumns<CollectData>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
        fixed: "left",
    },
    {
        title: '区县',
        dataIndex: "county",
        ellipsis: true,
        search: false,
    },
    {
        title: '站点',
        dataIndex: "site",
        //fixed: "left",
        //width: 150,
        ellipsis: true,
        search: false,
    },
    {
        title: '时间',
        dataIndex: "timeStr",
        valueType: "dateTime",
        width: 160,

    },
    {
        title: '电流信息(A)',
        search: false,
        children: [
            {
                title: '生产电流',
                dataIndex: ["tagCurrents", "PRODUCT"],
                search: false,
            },
            {
                title: '办公电流',
                dataIndex: ["tagCurrents", "OFFICE"],
                search: false,
                //width: 100,
            },
            {
                title: '营业电流',
                dataIndex: ["tagCurrents", "BUSINESS"],
                search: false,
            },
            {
                title: '外租电流',
                dataIndex: ["tagCurrents", "LEASE"],
                search: false,
            },
        ]
    },
    {
        title: '用电比例信息',
        search: false,
        children: [
            {
                title: '生产占比',
                dataIndex: ["proportions", "PRODUCT"],
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                valueType: (_) => ({type: "percent", precision: 1}),
                search: false,
            },
            {
                title: '办公占比',
                dataIndex: ["proportions", "OFFICE"],
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                valueType: (_) => ({type: "percent", precision: 1}),
                search: false,
                //width: 100,
            },
            {
                title: '营业占比',
                dataIndex: ["proportions", "BUSINESS"],
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                valueType: (_) => ({type: "percent", precision: 1}),
                search: false,
            },
            {
                title: '外租占比',
                dataIndex: ["proportions", "LEASE"],
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                valueType: (_) => ({type: "percent", precision: 1}),
                search: false,
            },
        ]
    },
]



export const RealTimeStatement = () => {
    const [data, setData] = useState<CollectData[]>([]);

   /* const onExportExcel = async () => {
        const cols :ExcelHeader[] = columns.map((col) => {
            return {
                header: col.title as string || ' ',
                key: col.dataIndex as string,
                width: (col?.width || 90) as number / 5,//(col.width / 5) || 20,
            }
        })
        // 获取数据日期串
        const dateStr = (data === null ? "" : data[0]?.timestr) ?? ""
        await exportSimpleExcel<NonproductiveAlarmData>(cols, data as NonproductiveAlarmData[], `办公营业夜间用电预警表${dateStr}.xlsx`);
    }*/
    //console.log("data", data)
    return (
        <ProTable<CollectData>
            columns={columns}
            cardBordered
            bordered
            //scroll={{x: 1300}}
            request={async (params, sort, filter) => {
                console.log(params, sort, filter);
                const {timeStr} = params;
                const tailParam = timeStr ? `hour/${convertDateTimeToTimeStr(timeStr)}` : "";
                const apiData = await fetchData<CollectData[]>(
                    `/api/datas/statistics/sometime/${tailParam}`);
                //console.log(data[4])
                apiData.forEach((item) => {
                    item.timeStr = convertTimeStrToDateTime(item.timeStr);
                    item.tagCurrents.BUSINESS = Math.round(item.tagCurrents.BUSINESS * 10) / 10;
                    item.tagCurrents.DEVICE = Math.round(item.tagCurrents.DEVICE * 10) / 10;
                    item.tagCurrents.LEASE = Math.round(item.tagCurrents.LEASE * 10) / 10;
                    item.tagCurrents.OFFICE = Math.round(item.tagCurrents.OFFICE * 10) / 10;
                    item.tagCurrents.PRODUCT = Math.round(item.tagCurrents.PRODUCT * 10) / 10;
                    item.tagCurrents.PUE = Math.round(item.tagCurrents.PUE * 100) / 100;
                    item.tagCurrents.TOTAL = Math.round(item.tagCurrents.TOTAL * 10) / 10;
                    item.proportions.PRODUCT *= 100;
                    item.proportions.OFFICE *= 100;
                    item.proportions.BUSINESS *= 100;
                    item.proportions.LEASE *= 100;
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
                        onClick={() => exportTwoLevelHeaderExcel<CollectData>(columns, data, "站点实时用电量.xlsx")}>
                    导出数据
                </Button>
            ]}
        />
    )
}

export default  RealTimeStatement