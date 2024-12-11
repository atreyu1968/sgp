import { SERVER_CONFIG } from '../../config';
import { serverConnection } from './serverConnection';

export async function fetchApi(endpoint: string, options: RequestInit = {}, retries = 2) {
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
    // If server error and retries left, wait and retry
    if (response.status >= 500 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchApi(endpoint, options, retries - 1);
    }

    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message);
  }

  return response.json();
}