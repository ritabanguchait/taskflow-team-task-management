/**
 * Authentication Service (client/src/services/authService.js)
 * 
 * Interacts with backend `/api/auth` endpoints.
 */

import api from './api';

export const authService = {
  // Register new account
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login existing account
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Fetch current user details
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default authService;
