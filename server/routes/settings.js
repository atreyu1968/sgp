import express from 'express';
import { query, run } from '../database/connection.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const settings = await query('SELECT * FROM settings');
    
    // Convert array of settings to object
    const settingsObject = settings.reduce((acc, { key, value }) => {
      acc[key] = JSON.parse(value);
      return acc;
    }, {});

    res.json(settingsObject);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update settings
router.put('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const settings = req.body;

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      await run(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = CURRENT_TIMESTAMP
      `, [key, JSON.stringify(value)]);
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// Create backup
router.get('/backup', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const backup = {
      settings: await query('SELECT * FROM settings'),
      users: await query('SELECT * FROM users'),
      projects: await query('SELECT * FROM projects'),
      reviews: await query('SELECT * FROM project_reviews'),
      scores: await query('SELECT * FROM review_scores'),
      timestamp: new Date().toISOString()
    };

    res.json(backup);
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ message: 'Error creating backup' });
  }
});

// Restore from backup
router.post('/restore', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const backup = req.body;

    await run('BEGIN TRANSACTION');

    try {
      // Clear existing data
      await run('DELETE FROM review_scores');
      await run('DELETE FROM project_reviews');
      await run('DELETE FROM projects');
      await run('DELETE FROM users');
      await run('DELETE FROM settings');

      // Restore data
      for (const setting of backup.settings) {
        await run(
          'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)',
          [setting.key, setting.value, setting.updated_at]
        );
      }

      for (const user of backup.users) {
        await run(`
          INSERT INTO users (
            id, name, email, password_hash, role, center,
            department, active, created_at, last_login
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          user.id, user.name, user.email, user.password_hash,
          user.role, user.center, user.department, user.active,
          user.created_at, user.last_login
        ]);
      }

      for (const project of backup.projects) {
        await run(`
          INSERT INTO projects (
            id, title, description, category_id, center,
            department, status, created_by, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          project.id, project.title, project.description,
          project.category_id, project.center, project.department,
          project.status, project.created_by, project.created_at,
          project.updated_at
        ]);
      }

      for (const review of backup.reviews) {
        await run(`
          INSERT INTO project_reviews (
            id, project_id, reviewer_id, general_observations,
            is_draft, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          review.id, review.project_id, review.reviewer_id,
          review.general_observations, review.is_draft,
          review.created_at, review.updated_at
        ]);
      }

      for (const score of backup.scores) {
        await run(`
          INSERT INTO review_scores (
            id, review_id, criterion_id, score, comment
          ) VALUES (?, ?, ?, ?, ?)
        `, [
          score.id, score.review_id, score.criterion_id,
          score.score, score.comment
        ]);
      }

      await run('COMMIT');
      res.json({ message: 'Backup restored successfully' });
    } catch (error) {
      await run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({ message: 'Error restoring backup' });
  }
});

export default router;