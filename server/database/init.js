import { access, chmod } from 'fs/promises';
import { constants } from 'fs';
import { dirname } from 'path';
import { config } from '../config.js';
import { migrate } from './migrate.js';
import { seed } from './seed.js';
import { query } from './connection.js';
import { logger } from '../utils/logger.js';

export async function initializeDatabase() {
  try {
    logger.info('Starting database initialization...');

    // Ensure database directory exists with correct permissions
    const dbDir = dirname(config.db.file);
    try {
      await access(dbDir, constants.R_OK | constants.W_OK);
      logger.info('Database directory exists with correct permissions');
    } catch (error) {
      logger.warn('Setting database directory permissions...');
      await chmod(dbDir, 0o755);
    }

    // Run migrations
    logger.info('Running database migrations...');
    await migrate();

    // Check if database needs seeding
    const [seedStatus] = await query('SELECT value FROM settings WHERE key = ?', ['seeded']);
    if (!seedStatus) {
      logger.info('Seeding database...');
      await seed();
      await query('INSERT INTO settings (key, value) VALUES (?, ?)', ['seeded', 'true']);
    }

    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}