import React, { createContext, useContext, useState, useEffect } from 'react';
import { Review } from '../types/review';
import { v4 as uuidv4 } from 'uuid';

interface ReviewsContextType {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  getProjectReviews: (projectId: string) => Review[];
  getReviewerReviews: (reviewerId: string) => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

// Initial mock data with rubric scores
const initialReviews: Review[] = [
  {
    id: '1',
    projectId: '1',
    reviewerId: '3',
    reviewerName: 'Ana Martínez',
    score: 8.5,
    scores: {
      'c1': 8,
      'c2': 9,
      'c3': 8.5
    },
    comments: {
      'c1': 'Excelente implementación técnica',
      'c2': 'Documentación muy completa y clara',
      'c3': 'Buena presentación del proyecto'
    },
    generalObservations: 'Proyecto muy bien estructurado y documentado. Demuestra un alto nivel de innovación.',
    isDraft: false,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    projectId: '1',
    reviewerId: '4',
    reviewerName: 'Carlos López',
    score: 9.0,
    scores: {
      'c1': 9,
      'c2': 9,
      'c3': 9
    },
    comments: {
      'c1': 'Solución muy innovadora',
      'c2': 'Excelente nivel técnico',
      'c3': 'Impacto significativo en el sector'
    },
    generalObservations: 'Proyecto sobresaliente con gran potencial de aplicación práctica.',
    isDraft: false,
    createdAt: '2024-03-14T15:30:00Z',
    updatedAt: '2024-03-14T15:30:00Z'
  }
];

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(initialReviews);
      localStorage.setItem('reviews', JSON.stringify(initialReviews));
    }
  }, []);

  const addReview = (review: Review) => {
    const newReview = { ...review, id: uuidv4() };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const updateReview = (id: string, reviewUpdate: Partial<Review>) => {
    const updatedReviews = reviews.map(review =>
      review.id === id ? { ...review, ...reviewUpdate, updatedAt: new Date().toISOString() } : review
    );
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const deleteReview = (id: string) => {
    const updatedReviews = reviews.filter(review => review.id !== id);
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const getProjectReviews = (projectId: string) => {
    return reviews.filter(review => review.projectId === projectId);
  };

  const getReviewerReviews = (reviewerId: string) => {
    return reviews.filter(review => review.reviewerId === reviewerId);
  };

  return (
    <ReviewsContext.Provider value={{
      reviews,
      setReviews,
      addReview,
      updateReview,
      deleteReview,
      getProjectReviews,
      getReviewerReviews
    }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};