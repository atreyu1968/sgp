import { fetchApi } from './fetchApi';
import { User } from '../../types/auth';

export const authApi = {
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

  register: (userData: Partial<User>) =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  verifyCode: (code: string) =>
    fetchApi('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
};