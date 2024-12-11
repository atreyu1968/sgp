import express from 'express';
import { query, run } from '../database/connection.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await query(`
      SELECT p.*, 
             c.name as category_name,
             c.min_corrections,
             c.total_budget
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.status != 'draft' OR p.created_by = ?)
      ORDER BY p.updated_at DESC
    `, [req.user.id]);

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [project] = await query(`
      SELECT p.*, 
             c.name as category_name,
             c.min_corrections,
             c.total_budget
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access
    if (project.status === 'draft' && project.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Create project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category_id, center, department, status } = req.body;

    const result = await run(`
      INSERT INTO projects (
        title, description, category_id, center, department,
        status, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [title, description, category_id, center, department, status || 'draft', req.user.id]);

    res.status(201).json({ id: result.id });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const [project] = await query('SELECT * FROM projects WHERE id = ?', [req.params.id]);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    if (project.created_by !== req.user.id && !['admin', 'coordinator'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, category_id, center, department, status } = req.body;

    await run(`
      UPDATE projects 
      SET title = ?, description = ?, category_id = ?, 
          center = ?, department = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, category_id, center, department, status, req.params.id]);

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Delete project
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await run('DELETE FROM projects WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

// Assign reviewers
router.post('/:id/reviewers', authenticateToken, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { reviewers } = req.body;

    await run('DELETE FROM project_reviewers WHERE project_id = ?', [req.params.id]);

    for (const reviewerId of reviewers) {
      await run(
        'INSERT INTO project_reviewers (project_id, user_id) VALUES (?, ?)',
        [req.params.id, reviewerId]
      );
    }

    res.json({ message: 'Reviewers assigned successfully' });
  } catch (error) {
    console.error('Error assigning reviewers:', error);
    res.status(500).json({ message: 'Error assigning reviewers' });
  }
});

export default router;