import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../../utils/auth.js';
import { create as createUser } from '../models/User.js';
import { set as setSetting } from '../models/Setting.js';

export async function seed() {
  try {
    // Create admin user
    await createUser({
      id: uuidv4(),
      name: 'Administrador',
      email: 'admin@fpinnova.es',
      password: 'admin123',
      role: 'admin',
      center: 'IES Tecnológico',
      department: 'Informática',
      active: true
    });

    // Initialize default settings
    const defaultSettings = {
      appearance: {
        branding: {
          appName: 'FP Innova',
          logo: 'https://example.com/logo.png'
        },
        colors: {
          primary: '#2563eb',
          secondary: '#1e40af'
        }
      }
    };

    await setSetting('appearance', defaultSettings.appearance);
    await setSetting('initialized', true);

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seed:', error);
    throw error;
  }
}