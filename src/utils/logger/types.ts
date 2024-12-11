export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  details?: any;
}

export interface LoggerOptions {
  level?: LogEntry['level'];
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface Logger {
  debug(message: string, details?: any): void;
  info(message: string, details?: any): void;
  warn(message: string, details?: any): void;
  error(message: string, details?: any): void;
  getLogs(options?: LoggerOptions): LogEntry[];
  clearLogs(): void;
}