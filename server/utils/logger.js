// Maximum number of logs to keep in memory
const MAX_LOGS = 1000;

class Logger {
  constructor() {
    this.logs = [];
  }

  addLog(level, message, details) {
    const entry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      details: details || null
    };

    // Add to beginning for most recent first
    this.logs.unshift(entry);

    // Trim logs if they exceed max size
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      const consoleMethod = level === 'error' ? 'error' : 
                          level === 'warn' ? 'warn' : 
                          level === 'debug' ? 'debug' : 'log';
      
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, details || '');
    }
  }

  debug(message, details) {
    this.addLog('debug', message, details);
  }

  info(message, details) {
    this.addLog('info', message, details);
  }

  warn(message, details) {
    this.addLog('warn', message, details);
  }

  error(message, details) {
    this.addLog('error', message, details);
  }

  getLogs(options = {}) {
    let filteredLogs = [...this.logs];

    // Apply filters
    if (options.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(searchLower) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower))
      );
    }

    if (options.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(options.startDate)
      );
    }

    if (options.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(options.endDate)
      );
    }

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 50;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      logs: filteredLogs.slice(start, end),
      total: filteredLogs.length,
      page,
      limit,
      totalPages: Math.ceil(filteredLogs.length / limit)
    };
  }

  clearLogs() {
    this.logs = [];
  }
}

// Create singleton instance
const logger = new Logger();

export { logger };