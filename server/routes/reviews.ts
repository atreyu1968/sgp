import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, transaction } from '../database/connection';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all reviews for a project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const [reviews] = await query(`
      SELECT r.*, 
             rs.criterion_id, rs.score, rs.comment,
             u.name as reviewer_name
      FROM project_reviews r
      LEFT JOIN review_scores rs ON rs.review_id = r.id
      LEFT JOIN users u ON u.id = r.reviewer_id
      WHERE r.project_id = ?
    `, [req.params.projectId]);

    // Group scores and comments by review
    const groupedReviews = reviews.reduce((acc: any, row: any) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          projectId: row.project_id,
          reviewerId: row.reviewer_id,
          reviewerName: row.reviewer_name,
          generalObservations: row.general_observations,
          isDraft: row.is_draft,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          scores: {},
          comments: {},
        };
      }
      if (row.criterion_id) {
        acc[row.id].scores[row.criterion_id] = row.score;
        if (row.comment) acc[row.id].comments[row.criterion_id] = row.comment;
      }
      return acc;
    }, {});

    res.json(Object.values(groupedReviews));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get a specific review
router.get('/:projectId', authenticateToken, async (req, res) => {
  try {
    const [reviews] = await query(`
      SELECT r.*, 
             rs.criterion_id, rs.score, rs.comment
      FROM project_reviews r
      LEFT JOIN review_scores rs ON rs.review_id = r.id
      WHERE r.project_id = ? AND r.reviewer_id = ?
    `, [req.params.projectId, req.user.id]);

    if (!reviews.length) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const review = reviews[0];
    const scores: Record<string, number> = {};
    const comments: Record<string, string> = {};

    reviews.forEach((row: any) => {
      if (row.criterion_id) {
        scores[row.criterion_id] = row.score;
        if (row.comment) comments[row.criterion_id] = row.comment;
      }
    });

    res.json({
      id: review.id,
      projectId: review.project_id,
      reviewerId: review.reviewer_id,
      scores,
      comments,
      generalObservations: review.general_observations,
      isDraft: review.is_draft,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Error fetching review' });
  }
});

// Save or update a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const result = await transaction(async (conn) => {
      const reviewId = uuidv4();
      const { projectId, scores, comments, generalObservations, isDraft } = req.body;

      // Insert or update review
      await conn.query(`
        INSERT INTO project_reviews (id, project_id, reviewer_id, general_observations, is_draft)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          general_observations = VALUES(general_observations),
          is_draft = VALUES(is_draft),
          updated_at = CURRENT_TIMESTAMP
      `, [reviewId, projectId, req.user.id, generalObservations, isDraft]);

      // Insert or update scores
      for (const [criterionId, score] of Object.entries(scores)) {
        const scoreId = uuidv4();
        const comment = comments[criterionId];

        await conn.query(`
          INSERT INTO review_scores (id, review_id, criterion_id, score, comment)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            score = VALUES(score),
            comment = VALUES(comment)
        `, [scoreId, reviewId, criterionId, score, comment]);
      }

      // If not a draft, calculate and update project score
      if (!isDraft) {
        const [reviews] = await conn.query(`
          SELECT AVG(score) as avg_score
          FROM project_reviews
          WHERE project_id = ? AND NOT is_draft
        `, [projectId]);

        if (reviews[0].avg_score) {
          await conn.query(`
            UPDATE projects
            SET score = ?
            WHERE id = ?
          `, [reviews[0].avg_score, projectId]);
        }
      }

      return { reviewId };
    });

    res.json(result);
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ message: 'Error saving review' });
  }
});

export { router };