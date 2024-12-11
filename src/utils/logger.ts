// Simple console wrapper for logging
const logger = {
  debug: (message: string, details?: any) => {
    console.debug(`[DEBUG] ${message}`, details || '');
  },
  
  info: (message: string, details?: any) => {
    console.info(`[INFO] ${message}`, details || '');
  },
  
  warn: (message: string, details?: any) => {
    console.warn(`[WARN] ${message}`, details || '');
  },
  
  error: (message: string, details?: any) => {
    console.error(`[ERROR] ${message}`, details || '');
  }
};

export { logger };