/**
 * Authentication Context (client/src/context/AuthContext.jsx)
 * 
 * WHY THIS FILE EXISTS:
 * Provides global state for user authentication across the React component tree.
 * Prevents "prop drilling" so any component can access the current user,
 * login function, logout function, or auth loading state.
 */

import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  // Check on initial render if user is already logged in
  useEffect(() => {
    const verifyStoredAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          if (data.success) {
            setUser(data.user);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('[AuthContext] Verification failed, clearing session:', error.message);
          handleLogout();
        }
      }
      setLoading(false);
    };

    verifyStoredAuth();
  }, []);

  // Handle Login
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.success) {
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    }
  };

  // Handle Register
  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.success) {
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  };

  // Handle Profile State Update
  const updateUserData = (newUserData) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
    localStorage.setItem('taskflow_user', JSON.stringify({ ...user, ...newUserData }));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout: handleLogout,
    updateUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
