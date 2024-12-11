import { BaseModel } from './base.js';

class SettingModel extends BaseModel {
  constructor() {
    super('settings');
  }

  async get(key) {
    const [setting] = await this.db.query(
      'SELECT * FROM settings WHERE key = ?',
      [key]
    );
    return setting ? JSON.parse(setting.value) : null;
  }

  async set(key, value) {
    return this.db.run(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `, [key, JSON.stringify(value)]);
  }

  async getAll() {
    const settings = await this.db.query('SELECT * FROM settings');
    return settings.reduce((acc, setting) => ({
      ...acc,
      [setting.key]: JSON.parse(setting.value)
    }), {});
  }
}

export const Setting = new SettingModel();