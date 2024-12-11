import { ReportType, ReportFilter } from '../../types/report';
import { api } from '../api';

export async function generateReport(type: ReportType, filters: ReportFilter[] = []) {
  try {
    const response = await api.reports.export(type, filters);
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${type}-${new Date().toISOString()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

export async function getReportData(type: ReportType, filters: ReportFilter[] = []) {
  try {
    return await api.reports.getData(type, filters);
  } catch (error) {
    console.error('Error fetching report data:', error);
    throw error;
  }
}

export async function getStatistics(filters: ReportFilter[] = []) {
  try {
    return await api.reports.getStatistics(filters);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

export async function getBudgetStatus(filters: ReportFilter[] = []) {
  try {
    return await api.reports.getBudgetStatus(filters);
  } catch (error) {
    console.error('Error fetching budget status:', error);
    throw error;
  }
}