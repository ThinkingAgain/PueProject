import {NonproductiveAlarmData} from "../model/ApiData.ts";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {fetchData} from "../service/fetch.tsx";
import {Button} from 'antd'
import {exportSimpleExcel} from "../service/tools.tsx";
import {useState} from "react";

const columns: ProColumns<NonproductiveAlarmData>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
        fixed: "left",
    },
    {
        title: '区县',
        dataIndex: "County",
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
        title: '日期',
        dataIndex: "timestr",
        valueType: "date",

    },
    {
        title: '夜间用电时段(电流>1A)',
        dataIndex: "costHours",
        search: false,
        width: 200,

    },
    {
        title: '夜间平均电流(A)',
        dataIndex: 'averageCurrent',
        //valueType: 'money',
        search: false,
    },
    {
        title: '夜间最大电流(A)',
        dataIndex: "maxCurrent",
        //valueType: 'money',
        search: false,
    },
    {
        title: '理论用电量(度)',
        dataIndex: "estimateConsumption",
        //valueType: (_) => ({type: "percent", precision: 0}),
        search: false,
    },
]



export const NonproductiveAlarm = () => {
    const [data, setData] = useState<NonproductiveAlarmData[] | null>(null);

    const onExportExcel = async () => {
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
    }
    console.log("data", data)
    return (
        <ProTable<NonproductiveAlarmData>
            columns={columns}
            cardBordered
            //bordered
            //scroll={{x: 1300}}
            request={async (params, sort, filter) => {
                console.log(params, sort, filter);
                const {timestr} = params;
                const apiData = await fetchData<NonproductiveAlarmData[]>(`/api/datas/statistics/nonproductive-alarm/${timestr}`);
                //console.log(data[4])
                apiData.forEach((item) => {
                    item.averageCurrent = Math.round(item.averageCurrent * 10) / 10;
                    item.maxCurrent = Math.round(item.maxCurrent * 10) / 10;
                    item.estimateConsumption = Math.round(item.estimateConsumption * 10) / 10;
                })
                setData(apiData);
                //console.log(data[4])
                return {
                    data: apiData,
                    success: true
                }
            }}
            toolBarRender={() => [
                <Button type="primary" disabled={!data|| data.length === 0}
                        key="out" onClick={onExportExcel}>导出数据</Button>
            ]}
        />
    )
}

export default  NonproductiveAlarm