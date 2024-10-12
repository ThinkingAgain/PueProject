import {Level2SiteRealTimeData} from "../model/ApiData.ts";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {fetchData} from "../service/fetch.tsx";
import {Button} from 'antd'
import {convertDateTimeToTimeStr, convertTimeStrToDateTime, exportSimpleExcel} from "../service/tools.tsx";
import {useState} from "react";

const columns: ProColumns<Level2SiteRealTimeData>[] = [
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
        title: '时间',
        dataIndex: "timeStr",
        valueType: "dateTime",
        width: 160,

    },
    {
        title: '电流信息(A)',
        dataIndex: "current",
        search: false,

    },

]



export const Level2SiteRealTime = () => {
    const [data, setData] = useState<Level2SiteRealTimeData[] | null>(null);

    const onExportExcel = async () => {
        const cols :ExcelHeader[] = columns.map((col) => {
            return {
                header: col.title as string || ' ',
                key: col.dataIndex as string,
                width: (col?.width || 90) as number / 5,//(col.width / 5) || 20,
            }
        })
        // 获取数据日期串
        const dateStr = (data === null ? "" : data[0]?.timeStr) ?? ""
        await exportSimpleExcel<Level2SiteRealTimeData>(cols, data as Level2SiteRealTimeData[], `二级用电点实时报表${dateStr}.xlsx`);
    }
    console.log("data", data)
    return (
        <ProTable<Level2SiteRealTimeData>
            columns={columns}
            cardBordered
            //bordered
            //scroll={{x: 1300}}
            request={async (params, sort, filter) => {
                console.log(params, sort, filter);
                const {timeStr} = params;
                const tailParam = timeStr ? `hour/${convertDateTimeToTimeStr(timeStr)}` : "";
                const apiData = await fetchData<Level2SiteRealTimeData[]>(
                    `/api/datas/statistics/l2site-sometime/${tailParam}`);
                //console.log(data[4])
                apiData.forEach((item) => {
                    item.timeStr = convertTimeStrToDateTime(item.timeStr);
                    item.current = Math.round(item.current * 10) / 10;
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

export default  Level2SiteRealTime