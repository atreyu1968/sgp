import { db } from '../connection/sqlite.js';

export class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  async findAll(conditions = {}) {
    const where = Object.keys(conditions).length 
      ? `WHERE ${Object.keys(conditions).map(k => `${k} = ?`).join(' AND ')}`
      : '';
    
    return this.db.query(
      `SELECT * FROM ${this.tableName} ${where}`,
      Object.values(conditions)
    );
  }

  async findById(id) {
    const [row] = await this.db.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return row;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = Array(keys.length).fill('?').join(',');

    const result = await this.db.run(
      `INSERT INTO ${this.tableName} (${keys.join(',')}) VALUES (${placeholders})`,
      values
    );

    return result;
  }

  async update(id, data) {
    const sets = Object.keys(data).map(k => `${k} = ?`).join(',');
    const values = [...Object.values(data), id];

    const result = await this.db.run(
      `UPDATE ${this.tableName} SET ${sets} WHERE id = ?`,
      values
    );

    return result;
  }

  async delete(id) {
    const result = await this.db.run(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result;
  }
}