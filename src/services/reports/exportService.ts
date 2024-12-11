import { utils, writeFile } from 'xlsx';
import { ReportConfig } from './reportConfig';
import { ReportType, ReportFilter } from '../../types/report';

export async function generateExcelReport(type: ReportType, filters: ReportFilter[]): Promise<void> {
  try {
    const config = ReportConfig[type];
    const data = await getReportData(type, filters);

    // Create workbook
    const wb = utils.book_new();
    
    // Create worksheet
    const ws = utils.json_to_sheet(data.rows, {
      header: config.columns.map(col => col.field)
    });

    // Set column widths
    ws['!cols'] = config.columns.map(col => ({ wch: col.width || 15 }));

    // Add custom headers
    utils.sheet_add_aoa(ws, [config.columns.map(col => col.header)], { origin: 'A1' });

    // Add sheet to workbook
    utils.book_append_sheet(wb, ws, config.sheetName);

    // Generate file
    writeFile(wb, `${config.title}_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel report:', error);
    throw error;
  }
}