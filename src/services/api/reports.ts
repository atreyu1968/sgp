import { fetchApi } from './fetchApi';
import { ReportType, ReportFilter } from '../../types/report';

export const reportsApi = {
  getData: (type: ReportType, filters: ReportFilter[]) =>
    fetchApi('/reports/data', {
      method: 'POST',
      body: JSON.stringify({ type, filters }),
    }),

  getStatistics: (filters: ReportFilter[]) =>
    fetchApi('/reports/statistics', {
      method: 'POST',
      body: JSON.stringify({ filters }),
    }),

  getBudgetStatus: (filters: ReportFilter[]) =>
    fetchApi('/reports/budget-status', {
      method: 'POST',
      body: JSON.stringify({ filters }),
    }),

  export: (type: ReportType, filters: ReportFilter[]) =>
    fetchApi('/reports/export', {
      method: 'POST',
      body: JSON.stringify({ type, filters }),
    }),
};