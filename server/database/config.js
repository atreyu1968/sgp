import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const dbConfig = {
  file: process.env.DB_FILE || join(__dirname, '../../database.sqlite'),
  migrations: {
    directory: './migrations',
    tableName: 'migrations'
  },
  seeds: {
    directory: './seeds',
    tableName: 'seeds'
  }
};