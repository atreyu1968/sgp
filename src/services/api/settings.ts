import { fetchApi } from './fetchApi';
import { Settings } from '../../types/settings';

export const settingsApi = {
  get: () => 
    fetchApi('/settings'),

  update: (data: Partial<Settings>) =>
    fetchApi('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  backup: () => 
    fetchApi('/settings/backup'),

  restore: (file: File) => {
    const formData = new FormData();
    formData.append('backup', file);
    return fetchApi('/settings/restore', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  },
};