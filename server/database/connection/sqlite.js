import sqlite3 from 'sqlite3';
import { dbConfig } from '../config.js';
import { logger } from '../../utils/logger.js';
import { access, constants, chmod } from 'fs/promises';
import { dirname } from 'path';

async function ensureDirectoryPermissions(path) {
  try {
    const dir = dirname(path);
    await access(dir, constants.W_OK);
  } catch (error) {
    logger.warn(`Directory permissions issue: ${error.message}`);
    await chmod(dirname(path), 0o755);
  }
}

async function ensureFilePermissions(path) {
  try {
    await access(path, constants.R_OK | constants.W_OK);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      logger.warn(`File permissions issue: ${error.message}`);
      await chmod(path, 0o644);
    }
  }
}

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    // Ensure proper permissions before connecting
    await ensureDirectoryPermissions(dbConfig.file);
    await ensureFilePermissions(dbConfig.file);
    
    this.db = new sqlite3.Database(dbConfig.file, (err) => {
      if (err) {
        logger.error('Error connecting to database:', err);
        throw err;
      } else {
        logger.info('Connected to SQLite database');
        // Enable WAL mode for better concurrency and corruption prevention
        this.run('PRAGMA journal_mode = WAL');
        this.run('PRAGMA synchronous = NORMAL');
        this.run('PRAGMA foreign_keys = ON');
        this.run('PRAGMA busy_timeout = 5000');
      }
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error('Error executing query:', { sql, params, error: err.message });
          reject(err);
        } else {
          logger.debug('Query executed:', { sql, params });
          resolve(rows);
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          logger.error('Error executing query:', { sql, params, error: err.message });
          reject(err);
        } else {
          logger.debug('Run executed:', { sql, params, changes: this.changes });
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async transaction(callback) {
    try {
      await this.run('BEGIN TRANSACTION');
      // Set busy timeout to handle concurrent access
      await this.run('PRAGMA busy_timeout = 5000');
      const result = await callback(this);
      await this.run('COMMIT');
      return result;
    } catch (err) {
      await this.run('ROLLBACK');
      throw err;
    }
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          logger.error('Error closing database:', err);
          reject(err);
        } else {
          logger.info('Database connection closed');
          resolve();
        }
      });
    });
  }
}

const database = new Database();
await database.init();
export const db = database;