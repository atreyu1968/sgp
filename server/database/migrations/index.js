import { readdirSync } from 'fs';
import { join } from 'path';
import { query } from '../connection.js';

export async function migrate() {
  try {
    // Create migrations table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all migration files
    const migrationFiles = readdirSync(__dirname)
      .filter(f => f.match(/^\d{3}_.*\.js$/))
      .sort();

    // Get executed migrations
    const executedMigrations = await query('SELECT name FROM migrations');
    const executedNames = new Set(executedMigrations.map(m => m.name));

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!executedNames.has(file)) {
        console.log(`Running migration: ${file}`);
        const migration = await import(join(__dirname, file));
        
        await query('BEGIN TRANSACTION');
        try {
          await migration.up();
          await query('INSERT INTO migrations (name) VALUES (?)', [file]);
          await query('COMMIT');
          console.log(`Migration ${file} completed successfully`);
        } catch (error) {
          await query('ROLLBACK');
          throw error;
        }
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}