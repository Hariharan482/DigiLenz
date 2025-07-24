import * as XLSX from 'xlsx';
export default function downloadExcel(data) {
    const fileName = "asset_report.xlsx";
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, fileName + ".xlsx");
}