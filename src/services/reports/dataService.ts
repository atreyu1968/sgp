import { ReportType, ReportFilter, ReportData } from '../../types/report';
import { api } from '../api';

export async function getReportData(type: ReportType, filters: ReportFilter[]): Promise<ReportData> {
  try {
    const response = await api.reports.getData(type, filters);
    return response;
  } catch (error) {
    console.error(`Error fetching ${type} report data:`, error);
    throw error;
  }
}

export async function getStatistics(filters: ReportFilter[]) {
  try {
    const response = await api.reports.getStatistics(filters);
    return response;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

export async function getBudgetStatus(filters: ReportFilter[]) {
  try {
    const response = await api.reports.getBudgetStatus(filters);
    return response;
  } catch (error) {
    console.error('Error fetching budget status:', error);
    throw error;
  }
}