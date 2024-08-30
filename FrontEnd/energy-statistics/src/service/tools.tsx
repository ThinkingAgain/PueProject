import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import type {ProColumns} from "@ant-design/pro-components";
import type {MergeRegion} from "../model";

const DEFAULT_ROW_HEIGHT = 25;


export async function exportSimpleExcel<T>(columns: ExcelHeader[],
                                           datas: T[], filename: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('demo');
    worksheet.properties.defaultRowHeight = 25;
    worksheet.columns = columns;
    //console.log(datas)
    //console.log(columns)
    worksheet.addRows(datas);
    workbook.xlsx.writeBuffer().then(data => {
        const blob = new Blob([data], {type: ''});
        saveAs(blob, filename)
    });
}

export function exportTwoLevelHeaderExcel<T>(columns: ProColumns<T>[],
                            datas: T[], fn: string = "demo.xlsx"){
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('sheet1');
    worksheet.properties.defaultRowHeight = DEFAULT_ROW_HEIGHT;
    // 1. columns -> 2行表头数据及合并区域
    const mergeData : MergeRegion[] = [];
    const header1: string[] = []
    const header2: string[] = []
    const dataIndexOrder: (keyof T)[][] = [] // 表头的 datIndex顺序
    columns.forEach(col => {
        if (col.children && col.children.length > 0) {
            col.children.forEach(child => {
                dataIndexOrder.push(child.dataIndex instanceof Array ?
                    child.dataIndex as (keyof T)[]
                    : [child.dataIndex as keyof T]);
                header1.push(col.title as string);
                header2.push(child.title as string);
                // 设置样式
                worksheet.getColumn(header1.length).width = (child?.width || 90) as number / 5; //child.width / 5 || 20;
                worksheet.getColumn(header1.length).alignment = {vertical: 'middle', horizontal: 'center'};
            })
            // 计算列合并的数据
            mergeData.push([1, (header1.length - col.children.length + 1), 1, header2.length]); // 只合并第 1行
        } else {
            dataIndexOrder.push(col.dataIndex instanceof Array ?
                col.dataIndex as (keyof T)[]
                : [col.dataIndex as keyof T]);
            header1.push( col.title as string);
            header2.push(col.title as string);
            // 设置 Style
            worksheet.getColumn(header1.length).width =  (col?.width || 90) as number / 5; //col.width / 5 || 20;
            worksheet.getColumn(header1.length).alignment = {vertical: 'middle', horizontal: 'center'};
            // 计算行合并的数据
            mergeData.push([1, header1.length, 2, header2.length]);
        }
    })
    //console.log(datas, dataIndexOrder)

    // 2. 添加 datas
    const rowDatas =
        datas.map(d => dataIndexOrder.map(i => i.reduce((v, x) => v[x] as T, d))) as string[][];
    //console.log("rowDatas", rowDatas);
    worksheet.addRows([header1, header2, ...rowDatas]);
    // 3. 合并
    mergeData.forEach((mr) => worksheet.mergeCells(...mr));
    // 4. 保存
    workbook.xlsx.writeBuffer().then(data => {
        const blob = new Blob([data], {type: ''});
        saveAs(blob, fn)
    });
}

// 将形如2024-08-26-13的timestr字串转化为 2024-08-24 13:00:00的 DateTime字串
export const convertTimeStrToDateTime = (timeStr: string) => {
    const ar = timeStr.split("-");
    const hour : string | undefined = ar.pop();
    return `${ar.join("-")} ${hour}:00:00`
}

// 将形如 2024-08-26 14:00:00 的 DateTime字串转化为 2024-08-26-14 的 timestr字串
export const convertDateTimeToTimeStr = (dateTimeStr: string) => {
    if(!dateTimeStr) return "";     // undefined => ""
    const [dateStr, hourStr] = dateTimeStr.split(" ");
    return `${dateStr}-${hourStr.split(':')[0]}`
}