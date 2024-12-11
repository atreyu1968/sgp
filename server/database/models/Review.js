import { query } from '../connection.js';

export async function findByProjectAndReviewer(projectId, reviewerId) {
  const [review] = await query(`
    SELECT r.*, u.name as reviewer_name
    FROM project_reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.project_id = ? AND r.reviewer_id = ?
  `, [projectId, reviewerId]);
  return review;
}

export async function findByProject(projectId) {
  const reviews = await query(`
    SELECT r.*, u.name as reviewer_name
    FROM project_reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.project_id = ?
    ORDER BY r.updated_at DESC
  `, [projectId]);
  return reviews;
}

export async function create(reviewData) {
  const result = await query(`
    INSERT INTO project_reviews (
      id, project_id, reviewer_id, score, general_observations,
      is_draft, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `, [
    reviewData.id,
    reviewData.projectId,
    reviewData.reviewerId,
    reviewData.score,
    reviewData.generalObservations,
    reviewData.isDraft ? 1 : 0
  ]);
  
  return result;
}