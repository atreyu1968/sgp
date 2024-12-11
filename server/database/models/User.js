import { BaseModel } from './base.js';
import { hashPassword } from '../../utils/auth.js';

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const [user] = await this.db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return user;
  }

  async create(userData) {
    const { password, ...rest } = userData;
    return super.create({
      ...rest,
      password_hash: hashPassword(password),
      created_at: new Date().toISOString()
    });
  }

  async updateLastLogin(id) {
    return this.update(id, {
      last_login: new Date().toISOString()
    });
  }
}

export const User = new UserModel();