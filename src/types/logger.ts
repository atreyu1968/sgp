export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  details?: any;
}

export interface LoggerOptions {
  level?: LogEntry['level'];
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}