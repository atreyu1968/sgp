import { MasterDataType } from '../../types/master';
import { api } from '../api';

export async function createEntity(
  type: MasterDataType,
  data: any,
  userId: string,
  userName: string
): Promise<void> {
  try {
    await api.masterData.create(type, {
      ...data,
      createdBy: userId,
      createdByName: userName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    throw error;
  }
}

export async function updateEntity(
  type: MasterDataType,
  id: string,
  data: any,
  userId: string,
  userName: string
): Promise<void> {
  try {
    await api.masterData.update(type, id, {
      ...data,
      updatedBy: userId,
      updatedByName: userName,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    throw error;
  }
}

export async function deleteEntity(
  type: MasterDataType,
  id: string
): Promise<void> {
  try {
    await api.masterData.delete(type, id);
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    throw error;
  }
}