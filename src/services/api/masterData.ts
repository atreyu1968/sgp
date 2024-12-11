import { fetchApi } from './fetchApi';
import { MasterDataType } from '../../types/master';

export const masterDataApi = {
  list: (type: MasterDataType) => 
    fetchApi(`/master-data/${type}`),

  get: (type: MasterDataType, id: string) => 
    fetchApi(`/master-data/${type}/${id}`),

  create: (type: MasterDataType, data: any) =>
    fetchApi(`/master-data/${type}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (type: MasterDataType, id: string, data: any) =>
    fetchApi(`/master-data/${type}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (type: MasterDataType, id: string) =>
    fetchApi(`/master-data/${type}/${id}`, {
      method: 'DELETE',
    }),

  import: (type: MasterDataType, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApi(`/master-data/${type}/import`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  },

  export: (type: MasterDataType) =>
    fetchApi(`/master-data/${type}/export`),
};