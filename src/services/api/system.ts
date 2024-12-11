import { api } from './index';
import { LogEntry } from '../../types/logger';

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LogOptions {
  level?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const systemApi = {
  getLogs: async (options: LogOptions = {}): Promise<LogsResponse> => {
    const params = new URLSearchParams();
    
    if (options.level) params.append('level', options.level);
    if (options.search) params.append('search', options.search);
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();
    const url = `/system/logs${queryString ? `?${queryString}` : ''}`;

    return api.get(url);
  },

  clearLogs: async (): Promise<void> => {
    return api.delete('/system/logs');
  },

  getHealth: async () => {
    return api.get('/system/health');
  }
};