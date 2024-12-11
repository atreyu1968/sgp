import { v4 as uuidv4 } from 'uuid';
import { ReviewData, Review } from '../types/review';

const REVIEWS_STORAGE_KEY = 'project_reviews';
const REVIEWERS_STORAGE_KEY = 'project_reviewers';

function getStoredData(key: string) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

function saveStoredData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

function updateProjectScore(projectId: string) {
  try {
    const reviews = getStoredData(REVIEWS_STORAGE_KEY);
    const projectsData = localStorage.getItem('projects');
    const projects = projectsData ? JSON.parse(projectsData) : [];
    
    const project = projects.find((p: any) => p.id === projectId);
    
    if (project) {
      // Get all completed reviews for this project
      const projectReviews = Object.values(reviews).filter((r: any) => 
        r.projectId === projectId && !r.isDraft
      );

      if (projectReviews.length > 0) {
        // Calculate average score from all completed reviews
        const totalScore = projectReviews.reduce((sum: number, r: any) => sum + r.score, 0);
        const averageScore = totalScore / projectReviews.length;

        // Update project score and status
        project.score = Number(averageScore.toFixed(2));
        
        // Update status if minimum corrections reached
        if (projectReviews.length >= (project.category?.minCorrections || 2)) {
          project.status = 'reviewed';
        }

        // Update project in array
        const updatedProjects = projects.map((p: any) => 
          p.id === projectId ? project : p
        );

        // Save back to localStorage
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
      }
    }
  } catch (error) {
    console.error('Error updating project score:', error);
  }
}

export async function saveReview(
  reviewData: ReviewData, 
  reviewerId: string, 
  userRole: string, 
  projectId: string,
  reviewerName: string
): Promise<{ reviewId: string }> {
  try {
    const reviews = getStoredData(REVIEWS_STORAGE_KEY);
    const reviewId = reviewData.id || uuidv4();

    // Calculate review score based on criteria scores
    const scores = Object.values(reviewData.scores);
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const normalizedScore = Number((totalScore / scores.length).toFixed(2));

    // Create or update review
    const review: Review = {
      id: reviewId,
      projectId,
      reviewerId,
      reviewerName,
      scores: reviewData.scores,
      comments: reviewData.comments,
      generalObservations: reviewData.generalObservations,
      isDraft: reviewData.isDraft,
      score: normalizedScore,
      createdAt: reviews[reviewId]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reviews[reviewId] = review;
    saveStoredData(REVIEWS_STORAGE_KEY, reviews);

    // Auto-assign reviewer if admin or coordinator
    if ((userRole === 'admin' || userRole === 'coordinator') && !reviewData.isDraft) {
      const reviewers = getStoredData(REVIEWERS_STORAGE_KEY);
      if (!reviewers[projectId]) {
        reviewers[projectId] = [];
      }
      if (!reviewers[projectId].some((r: any) => r.id === reviewerId)) {
        reviewers[projectId].push({
          id: reviewerId,
          name: reviewerName,
          role: userRole,
          hasReviewed: true,
          score: normalizedScore
        });
        saveStoredData(REVIEWERS_STORAGE_KEY, reviewers);
      } else {
        // Update existing reviewer's status and score
        reviewers[projectId] = reviewers[projectId].map((r: any) => 
          r.id === reviewerId ? { ...r, hasReviewed: true, score: normalizedScore } : r
        );
        saveStoredData(REVIEWERS_STORAGE_KEY, reviewers);
      }
    }

    // Update project score and status
    updateProjectScore(projectId);

    return { reviewId };
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
}

export async function getReview(projectId: string, reviewerId: string): Promise<Review | null> {
  const reviews = getStoredData(REVIEWS_STORAGE_KEY);
  return Object.values(reviews).find((r: Review) => 
    r.projectId === projectId && r.reviewerId === reviewerId
  ) || null;
}

export async function listProjectReviews(projectId: string): Promise<Review[]> {
  const reviews = getStoredData(REVIEWS_STORAGE_KEY);
  return Object.values(reviews).filter((r: Review) => r.projectId === projectId);
}

export async function deleteReview(reviewId: string): Promise<void> {
  const reviews = getStoredData(REVIEWS_STORAGE_KEY);
  const review = reviews[reviewId];
  
  if (review) {
    delete reviews[reviewId];
    saveStoredData(REVIEWS_STORAGE_KEY, reviews);
    updateProjectScore(review.projectId);
  }
}