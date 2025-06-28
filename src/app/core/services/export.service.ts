import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class ExportService {
  /** Export array of objects as CSV */
  exportToCSV(filename: string, data: any[]): void {
    if (!data.length) {
      console.warn('No data to export');
      return;
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  /** Export array of objects as PDF table */
  exportToPDF(filename: string, data: any[]): void {
    if (!data.length) {
      console.warn('No data to export');
      return;
    }
    const doc = new jsPDF();
    const columns = Object.keys(data[0]).map(key => ({ header: key, dataKey: key }));
    autoTable(doc, { columns, body: data });
    doc.save(`${filename}.pdf`);
  }
}
