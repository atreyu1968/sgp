import { Logger, LogEntry, LoggerOptions } from './types';

class LoggerImpl implements Logger {
  private static instance: LoggerImpl;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private logToConsole: boolean = process.env.NODE_ENV !== 'production';

  private constructor() {}

  static getInstance(): Logger {
    if (!LoggerImpl.instance) {
      LoggerImpl.instance = new LoggerImpl();
    }
    return LoggerImpl.instance;
  }

  private log(level: LogEntry['level'], message: string, details?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      details
    };

    this.logs.unshift(entry);

    // Trim logs if they exceed maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log to console in development
    if (this.logToConsole) {
      const consoleMethod = level === 'error' ? 'error' : 
                          level === 'warn' ? 'warn' : 
                          level === 'debug' ? 'debug' : 'log';
      
      console[consoleMethod](`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, details || '');
    }
  }

  setLogToConsole(enabled: boolean) {
    this.logToConsole = enabled;
  }

  setMaxLogs(max: number) {
    this.maxLogs = max;
    if (this.logs.length > max) {
      this.logs = this.logs.slice(0, max);
    }
  }

  debug(message: string, details?: any) {
    this.log('debug', message, details);
  }

  info(message: string, details?: any) {
    this.log('info', message, details);
  }

  warn(message: string, details?: any) {
    this.log('warn', message, details);
  }

  error(message: string, details?: any) {
    this.log('error', message, details);
  }

  getLogs(options: LoggerOptions = {}): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (options.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }

    if (options.startDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) >= options.startDate!
      );
    }

    if (options.endDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) <= options.endDate!
      );
    }

    if (options.limit) {
      filteredLogs = filteredLogs.slice(0, options.limit);
    }

    return filteredLogs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = LoggerImpl.getInstance();