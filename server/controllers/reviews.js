import { findByProject, create } from '../database/models/Review.js';

export async function getProjectReviews(req, res) {
  const reviews = await findByProject(req.params.projectId);
  res.json(reviews);
}

export async function createReview(req, res) {
  const review = await create({
    ...req.body,
    reviewerId: req.user.id
  });
  res.status(201).json(review);
}