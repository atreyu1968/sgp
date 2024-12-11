import { query } from './connection.js';
import { logger } from '../utils/logger.js';

async function migrate() {
  try {
    logger.info('Starting database migrations...');

    // Enable foreign keys and WAL mode
    await query('PRAGMA foreign_keys = ON');
    await query('PRAGMA journal_mode = WAL');

    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'coordinator', 'presenter', 'reviewer', 'guest')) NOT NULL,
        center TEXT,
        department TEXT,
        avatar TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    // Settings table
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info('Database migrations completed successfully');
  } catch (error) {
    logger.error('Error during migrations:', error);
    throw error;
  }
}

export { migrate };

// Run migrations if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().catch(error => {
    logger.error('Migration failed:', error);
    process.exit(1);
  });
}