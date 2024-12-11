import { query, run } from './database/connection.js';
import { migrate } from './database/migrate.js';
import { seed } from './database/seed.js';

async function init() {
  try {
    console.log('Starting database initialization...');
    
    // Run migrations
    console.log('Running migrations...');
    await migrate();
    console.log('Migrations completed successfully');

    // Check if database needs seeding
    const [adminUser] = await query('SELECT * FROM users WHERE email = ?', ['admin@fpinnova.es']);
    
    if (!adminUser) {
      console.log('Seeding database...');
      await seed();
      console.log('Database seeded successfully');
    } else {
      console.log('Database already seeded');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}

init().catch(console.error);