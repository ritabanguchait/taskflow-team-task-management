/**
 * Axios HTTP Client Instance (client/src/services/api.js)
 * 
 * WHY THIS FILE EXISTS:
 * Centralizes Axios configuration, base URL, and interceptors.
 * 
 * HOW IT WORKS (Interview Explanation):
 * 1. Creates an Axios instance with base URL `/api`.
 * 2. Request Interceptor: Automatically inspects `localStorage` for a stored JWT token.
 *    If found, it adds the `Authorization: Bearer <token>` header to EVERY outgoing HTTP request.
 * 3. Response Interceptor: Catches errors globally. If the server returns a 401 Unauthorized,
 *    it can automatically clear expired credentials and redirect to login.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error interception
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid/expired and not already on auth page, clean up
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
