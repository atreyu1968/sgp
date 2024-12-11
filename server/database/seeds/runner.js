import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../connection/sqlite.js';
import { dbConfig } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runSeeds() {
  try {
    // Create seeds table
    await db.run(`
      CREATE TABLE IF NOT EXISTS ${dbConfig.seeds.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get seed files
    const seedFiles = readdirSync(join(__dirname, dbConfig.seeds.directory))
      .filter(f => f.endsWith('.js') && f !== 'runner.js')
      .sort();

    // Get executed seeds
    const executedSeeds = await db.query(
      `SELECT name FROM ${dbConfig.seeds.tableName}`
    );
    const executedNames = new Set(executedSeeds.map(s => s.name));

    // Run pending seeds
    for (const file of seedFiles) {
      if (!executedNames.has(file)) {
        console.log(`Running seed: ${file}`);
        const seed = await import(join(__dirname, dbConfig.seeds.directory, file));
        
        await db.transaction(async () => {
          await seed.seed();
          await db.run(
            `INSERT INTO ${dbConfig.seeds.tableName} (name) VALUES (?)`,
            [file]
          );
        });

        console.log(`Seed ${file} completed successfully`);
      }
    }

    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
    throw error;
  }
}