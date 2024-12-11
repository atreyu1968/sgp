import express from 'express';
import { query, run } from '../database/connection.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { hashPassword } from '../utils/auth.js';

const router = express.Router();

// Get all users
router.get('/', authenticateToken, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const users = await query(`
      SELECT id, name, email, role, center, department, 
             active, created_at, last_login
      FROM users
      ORDER BY name
    `);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [user] = await query(`
      SELECT id, name, email, role, center, department, 
             active, created_at, last_login
      FROM users
      WHERE id = ?
    `, [req.params.id]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Users can only view their own profile unless they're admin/coordinator
    if (user.id !== req.user.id && !['admin', 'coordinator'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create user
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, password, role, center, department } = req.body;

    // Check if email already exists
    const [existingUser] = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = hashPassword(password);

    const result = await run(`
      INSERT INTO users (
        name, email, password_hash, role, center, department,
        active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
    `, [name, email, passwordHash, role, center, department]);

    res.status(201).json({ id: result.id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const [user] = await query('SELECT * FROM users WHERE id = ?', [req.params.id]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Users can only update their own profile unless they're admin
    if (user.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, email, password, role, center, department, active } = req.body;

    // Only admins can change roles and active status
    if ((role !== user.role || active !== user.active) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to change role or status' });
    }

    let sql = `
      UPDATE users 
      SET name = ?, email = ?, role = ?, center = ?, 
          department = ?, active = ?, updated_at = CURRENT_TIMESTAMP
    `;
    let params = [name, email, role, center, department, active];

    if (password) {
      sql += ', password_hash = ?';
      params.push(hashPassword(password));
    }

    sql += ' WHERE id = ?';
    params.push(req.params.id);

    await run(sql, params);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await run('DELETE FROM users WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;