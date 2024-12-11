import { existsSync, unlinkSync } from 'fs';
import { dirname } from 'path';
import { execSync } from 'child_process';
import { DB_PATH } from '../server/database/connection.js';

const dbDir = dirname(DB_PATH);

// Remove existing database if it exists
if (existsSync(DB_PATH)) {
  console.log('Removing existing database...');
  unlinkSync(DB_PATH);
}

console.log('Initializing database...');

// Run migrations and seed in sequence
try {
  console.log('Running migrations...');
  execSync('node server/database/migrate.js', { stdio: 'inherit' });

  console.log('Seeding database...');
  execSync('node server/database/seed.js', { stdio: 'inherit' });

  console.log('Database initialization completed successfully!');
} catch (error) {
  console.error('Error during database initialization:', error);
  process.exit(1);
}