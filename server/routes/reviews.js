import express from 'express';
import { query, run, transaction } from '../database/connection.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all reviews for a project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const reviews = await query(`
      SELECT r.*, u.name as reviewer_name
      FROM project_reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.project_id = ?
      ORDER BY r.updated_at DESC
    `, [req.params.projectId]);

    // Get scores and comments for each review
    for (const review of reviews) {
      review.scores = await query(`
        SELECT criterion_id, score, comment
        FROM review_scores
        WHERE review_id = ?
      `, [review.id]);
    }

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get a specific review
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [review] = await query(`
      SELECT r.*, u.name as reviewer_name
      FROM project_reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.id = ?
    `, [req.params.id]);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Get scores and comments
    review.scores = await query(`
      SELECT criterion_id, score, comment
      FROM review_scores
      WHERE review_id = ?
    `, [review.id]);

    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Error fetching review' });
  }
});

// Create or update review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { projectId, scores, comments, generalObservations, isDraft } = req.body;

    // Check if user is assigned as reviewer
    const [assignment] = await query(`
      SELECT 1 FROM project_reviewers 
      WHERE project_id = ? AND user_id = ?
    `, [projectId, req.user.id]);

    if (!assignment && !['admin', 'coordinator'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not assigned as reviewer' });
    }

    await transaction(async () => {
      // Create or update review
      const [existingReview] = await query(`
        SELECT id FROM project_reviews
        WHERE project_id = ? AND reviewer_id = ?
      `, [projectId, req.user.id]);

      let reviewId;
      if (existingReview) {
        await run(`
          UPDATE project_reviews
          SET general_observations = ?, is_draft = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [generalObservations, isDraft ? 1 : 0, existingReview.id]);
        reviewId = existingReview.id;
      } else {
        const result = await run(`
          INSERT INTO project_reviews (
            project_id, reviewer_id, general_observations, is_draft,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [projectId, req.user.id, generalObservations, isDraft ? 1 : 0]);
        reviewId = result.id;
      }

      // Delete existing scores
      await run('DELETE FROM review_scores WHERE review_id = ?', [reviewId]);

      // Insert new scores
      for (const [criterionId, score] of Object.entries(scores)) {
        await run(`
          INSERT INTO review_scores (review_id, criterion_id, score, comment)
          VALUES (?, ?, ?, ?)
        `, [reviewId, criterionId, score, comments[criterionId] || null]);
      }

      // Update project status if all reviews are complete
      if (!isDraft) {
        const [{ total, completed }] = await query(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN is_draft = 0 THEN 1 ELSE 0 END) as completed
          FROM project_reviews
          WHERE project_id = ?
        `, [projectId]);

        if (completed === total) {
          await run(`
            UPDATE projects
            SET status = 'reviewed', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [projectId]);
        }
      }
    });

    res.json({ message: 'Review saved successfully' });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ message: 'Error saving review' });
  }
});

// Delete review
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const result = await run('DELETE FROM project_reviews WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

export default router;