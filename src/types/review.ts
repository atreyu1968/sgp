export interface Review {
  id: string;
  projectId: string;
  reviewerId: string;
  reviewerName: string;
  score: number;
  scores: Record<string, number>;
  comments: Record<string, string>;
  generalObservations?: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewData {
  id?: string;
  projectId: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  generalObservations: string;
  isDraft: boolean;
}

export interface ReviewScore {
  id: string;
  reviewId: string;
  criterionId: string;
  score: number;
  comment?: string;
}