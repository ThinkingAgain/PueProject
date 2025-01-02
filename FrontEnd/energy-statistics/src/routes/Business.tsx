import {BusinessData} from "../model/ApiData.ts";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {fetchData} from "../service/fetch.tsx";
import {Button} from 'antd'
import {exportSimpleExcel} from "../service/tools.tsx";
import {useState} from "react";

const columns: ProColumns<BusinessData>[] = [
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
        title: '时间',
        dataIndex: "timestr",
        //valueType: "dateTime",

    },
    {
        title: '电流值(A)',
        dataIndex: 'current',
        //valueType: 'money',
        search: false,
    },

]



export const Business = () => {
    const [data, setData] = useState<BusinessData[] | null>(null);

    const onExportExcel = async () => {
        const cols :ExcelHeader[] = columns.map((col) => {
            return {
                header: col.title as string || ' ',
                key: col.dataIndex as string,
                width: (col?.width || 90) as number / 5,//(col.width / 5) || 20,
            }
        })
        // 获取数据日期串
        //const dateStr = (data === null ? "" : data[0]?.timestr) ?? ""
        await exportSimpleExcel<BusinessData>(cols, data as BusinessData[], `营业用电全量数据.xlsx`);
    }
    console.log("data", data)
    return (
        <ProTable<BusinessData>
            columns={columns}
            cardBordered
            //bordered
            //scroll={{x: 1300}}
            request={async (params, sort, filter) => {
                console.log(params, sort, filter);
                //const {timestr} = params;
                const apiData = await fetchData<BusinessData[]>(`/api/datas/statistics/business-datas/all`);
                //console.log(data[4])
                apiData.forEach((item) => {
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

export default  Business