import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';

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