import dotenv from 'dotenv';

dotenv.config();

export const config = {
  db: {
    url: process.env.DB_URL || 'file:local.db',
    authToken: process.env.DB_AUTH_TOKEN,
  },
  server: {
    port: Number(process.env.PORT) || 3010,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
  }
};