import {Level2SiteAlarmData} from "../model/ApiData.ts";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {fetchData} from "../service/fetch.tsx";
import {Button} from 'antd'
import {exportSimpleExcel} from "../service/tools.tsx";
import {useState} from "react";

const columns: ProColumns<Level2SiteAlarmData>[] = [
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
        title: '一级类别',
        dataIndex: "category",
        ellipsis: true,
        search: false,
    },
    {
        title: '二级用电点',
        dataIndex: "l2Site",
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



export const Level2SiteAlarm = () => {
    const [data, setData] = useState<Level2SiteAlarmData[] | null>(null);

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
        await exportSimpleExcel<Level2SiteAlarmData>(cols, data as Level2SiteAlarmData[], `二级用电点预警表${dateStr}.xlsx`);
    }
    console.log("data", data)
    return (
        <ProTable<Level2SiteAlarmData>
            columns={columns}
            cardBordered
            //bordered
            //scroll={{x: 1300}}
            request={async (params, sort, filter) => {
                console.log(params, sort, filter);
                const {timestr} = params;
                const apiData = await fetchData<Level2SiteAlarmData[]>(`/api/datas/statistics/l2site-alarm/${timestr}`);
                //console.log(data[4])
                const tableData = apiData.filter(d => d.category !== "生产")
                tableData.forEach((item) => {
                    item.averageCurrent = Math.round(item.averageCurrent * 10) / 10;
                    item.maxCurrent = Math.round(item.maxCurrent * 10) / 10;
                    item.estimateConsumption = Math.round(item.estimateConsumption * 10) / 10;
                })
                //console.log(tableData)
                setData(tableData);
                //console.log(data[4])
                return {
                    data: tableData,
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

export default  Level2SiteAlarm