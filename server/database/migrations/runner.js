import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../connection/sqlite.js';
import { dbConfig } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  try {
    // Create migrations table
    await db.run(`
      CREATE TABLE IF NOT EXISTS ${dbConfig.migrations.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get migration files
    const migrationFiles = readdirSync(join(__dirname, dbConfig.migrations.directory))
      .filter(f => f.match(/^\d{3}_.*\.js$/))
      .sort();

    // Get executed migrations
    const executedMigrations = await db.query(
      `SELECT name FROM ${dbConfig.migrations.tableName}`
    );
    const executedNames = new Set(executedMigrations.map(m => m.name));

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!executedNames.has(file)) {
        console.log(`Running migration: ${file}`);
        const migration = await import(join(__dirname, dbConfig.migrations.directory, file));
        
        await db.transaction(async () => {
          await migration.up();
          await db.run(
            `INSERT INTO ${dbConfig.migrations.tableName} (name) VALUES (?)`,
            [file]
          );
        });

        console.log(`Migration ${file} completed successfully`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}