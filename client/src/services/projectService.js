/**
 * Project Service (client/src/services/projectService.js)
 * 
 * Interacts with backend `/api/projects` endpoints.
 */

import api from './api';

export const projectService = {
  // Get all projects user is part of
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Get single project details with task stats
  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update existing project
  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};

export default projectService;
