import { startup } from './startup.js';
import { logger } from './utils/logger.js';

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
startup().catch(error => {
  logger.error('Server startup failed:', error);
  process.exit(1);
});