import { MasterDataType } from '../../types/master';
import { api } from '../api';

export async function importData(type: MasterDataType, file: File) {
  try {
    return await api.masterData.import(type, file);
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}

export async function exportTemplate(type: MasterDataType) {
  try {
    const response = await api.masterData.export(type);
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-${type}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting template:', error);
    throw error;
  }
}

export async function getData(type: MasterDataType) {
  try {
    return await api.masterData.list(type);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function createEntity(type: MasterDataType, data: any) {
  try {
    return await api.masterData.create(type, data);
  } catch (error) {
    console.error('Error creating entity:', error);
    throw error;
  }
}

export async function updateEntity(type: MasterDataType, id: string, data: any) {
  try {
    return await api.masterData.update(type, id, data);
  } catch (error) {
    console.error('Error updating entity:', error);
    throw error;
  }
}

export async function deleteEntity(type: MasterDataType, id: string) {
  try {
    return await api.masterData.delete(type, id);
  } catch (error) {
    console.error('Error deleting entity:', error);
    throw error;
  }
}