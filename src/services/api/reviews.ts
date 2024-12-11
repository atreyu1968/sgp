import { fetchApi } from './fetchApi';
import { Review } from '../../types/review';

export const reviewsApi = {
  list: (projectId: string) => 
    fetchApi(`/reviews/project/${projectId}`),

  get: (id: string) => 
    fetchApi(`/reviews/${id}`),

  create: (data: Partial<Review>) =>
    fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Review>) =>
    fetchApi(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi(`/reviews/${id}`, {
      method: 'DELETE',
    }),
};