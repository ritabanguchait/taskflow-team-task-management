/**
 * Task Service (client/src/services/taskService.js)
 * 
 * Interacts with backend `/api/tasks` endpoints.
 */

import api from './api';

export const taskService = {
  // Get all tasks with optional filters (status, priority, project, assignedTo, search)
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get single task details
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update full task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Quick update task status ('Todo', 'In Progress', 'Completed')
  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get aggregated dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/tasks/dashboard/stats');
    return response.data;
  }
};

export default taskService;
