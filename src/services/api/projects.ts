import { fetchApi } from './fetchApi';
import { Project } from '../../types/project';

export const projectsApi = {
  list: () => 
    fetchApi('/projects'),

  get: (id: string) => 
    fetchApi(`/projects/${id}`),

  create: (data: Partial<Project>) =>
    fetchApi('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Project>) =>
    fetchApi(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi(`/projects/${id}`, {
      method: 'DELETE',
    }),

  assignReviewers: (projectId: string, reviewerIds: string[]) =>
    fetchApi(`/projects/${projectId}/reviewers`, {
      method: 'POST',
      body: JSON.stringify({ reviewers: reviewerIds }),
    }),
};