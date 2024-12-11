import { SERVER_CONFIG } from '../../config';
import { serverConnection } from './serverConnection';

class Api {
  private static instance: Api;
  
  private constructor() {}

  static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  private async fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    // Wait for server connection before making request
    const isConnected = await serverConnection.waitForConnection(5000);
    if (!isConnected) {
      throw new Error('No se pudo establecer conexión con el servidor');
    }

    const response = await fetch(`${SERVER_CONFIG.BASE_URL}/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  async get(endpoint: string): Promise<any> {
    return this.fetch(endpoint);
  }

  async post(endpoint: string, data?: any): Promise<any> {
    return this.fetch(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any): Promise<any> {
    return this.fetch(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string): Promise<any> {
    return this.fetch(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = Api.getInstance();