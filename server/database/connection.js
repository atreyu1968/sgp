import sqlite3 from 'sqlite3';
import { join } from 'path';
import { mkdirSync, chmodSync, existsSync } from 'fs';
import { logger } from '../utils/logger.js';

// Database configuration
const DB_DIR = join(process.cwd(), 'data');
const DB_FILE = join(DB_DIR, 'database.sqlite');

export const DB_PATH = DB_FILE;

// Ensure data directory exists with correct permissions
try {
  if (!existsSync(DB_DIR)) {
    logger.info('Creating database directory...');
    mkdirSync(DB_DIR, { recursive: true });
  }
  chmodSync(DB_DIR, 0o777);
  if (existsSync(DB_FILE)) {
    chmodSync(DB_FILE, 0o666);
  }
} catch (error) {
  logger.error('Failed to create database directory:', error);
  throw error;
}

// Create database connection
const db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    logger.error('Error connecting to database:', err);
    throw err;
  }
  logger.info('Connected to SQLite database');
});

// Configure database settings
db.serialize(() => {
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA foreign_keys = ON');
  db.run('PRAGMA busy_timeout = 5000');
  db.run('PRAGMA synchronous = NORMAL');
});

// Database query wrapper
export function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        logger.error('Query error:', { sql, params, error: err });
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

// Database run wrapper for modifications
export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        logger.error('Run error:', { sql, params, error: err });
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Clean up on exit
process.on('exit', () => {
  db.close();
});