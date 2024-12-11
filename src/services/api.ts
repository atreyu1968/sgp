import { SERVER_CONFIG } from '../config';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
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

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    logout: () => 
      fetchApi('/auth/logout', { 
        method: 'POST' 
      }),

    me: () => 
      fetchApi('/auth/me'),
  },
};