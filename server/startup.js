import { mkdir, access, chmod } from 'fs/promises';
import { constants } from 'fs';
import { dirname } from 'path';
import { app } from './app.js';
import { initializeDatabase } from './database/init.js';
import { logger } from './utils/logger.js';
import { config } from './config.js';

export async function startup() {
  try {
    logger.info('Starting server initialization...');

    // Ensure data directories exist with correct permissions
    const dataDir = dirname(config.db.file);
    try {
      await access(dataDir, constants.R_OK | constants.W_OK);
    } catch (error) {
      logger.info('Creating data directories...');
      await mkdir(dataDir, { recursive: true });
      await chmod(dataDir, 0o777);
    }

    // Initialize database
    await initializeDatabase();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Starting graceful shutdown...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    logger.error('Server initialization failed:', error);
    throw error;
  }
}