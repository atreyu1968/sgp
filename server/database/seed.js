import { query } from './connection.js';
import { hashPassword } from '../utils/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

export async function seed() {
  try {
    logger.info('Starting database seed...');

    // Create admin user if it doesn't exist
    const [adminUser] = await query('SELECT * FROM users WHERE email = ?', ['admin@fpinnova.es']);
    
    if (!adminUser) {
      await query(`
        INSERT INTO users (
          id, name, email, password_hash, role, center, department, active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        'Administrador',
        'admin@fpinnova.es',
        hashPassword('admin123'),
        'admin',
        'IES Tecnológico',
        'Informática',
        1
      ]);
      logger.info('Admin user created successfully');
    }

    // Initialize settings if needed
    const [settings] = await query('SELECT * FROM settings WHERE key = ?', ['initialized']);
    
    if (!settings) {
      const defaultSettings = {
        appearance: {
          branding: {
            appName: 'Proyectos de Innovación de FP',
            logo: 'https://example.com/logo.png'
          },
          colors: {
            primary: '#2563eb',
            secondary: '#1e40af'
          }
        }
      };

      await query(`
        INSERT INTO settings (key, value) VALUES (?, ?)
      `, ['appearance', JSON.stringify(defaultSettings.appearance)]);

      await query(`
        INSERT INTO settings (key, value) VALUES (?, ?)
      `, ['initialized', 'true']);

      logger.info('Default settings initialized');
    }

    logger.info('Database seed completed successfully');
  } catch (error) {
    logger.error('Error during seed:', error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch(error => {
    logger.error('Seed failed:', error);
    process.exit(1);
  });
}