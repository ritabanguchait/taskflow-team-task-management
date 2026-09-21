/**
 * User Service (client/src/services/userService.js)
 * 
 * Interacts with backend `/api/users` endpoints.
 */

import api from './api';

export const userService = {
  // Get all registered users (for team member assignment)
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Update current user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }
};

export default userService;
