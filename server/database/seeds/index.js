import { readdirSync } from 'fs';
import { join } from 'path';
import { query } from '../connection.js';

export async function runSeeds() {
  try {
    // Create seeds table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS seeds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all seed files
    const seedFiles = readdirSync(__dirname)
      .filter(f => f.endsWith('.js') && f !== 'index.js')
      .sort();

    // Get executed seeds
    const executedSeeds = await query('SELECT name FROM seeds');
    const executedNames = new Set(executedSeeds.map(s => s.name));

    // Run pending seeds
    for (const file of seedFiles) {
      if (!executedNames.has(file)) {
        console.log(`Running seed: ${file}`);
        const seed = await import(join(__dirname, file));
        
        await query('BEGIN TRANSACTION');
        try {
          await seed.seed();
          await query('INSERT INTO seeds (name) VALUES (?)', [file]);
          await query('COMMIT');
          console.log(`Seed ${file} completed successfully`);
        } catch (error) {
          await query('ROLLBACK');
          throw error;
        }
      }
    }

    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
    throw error;
  }
}