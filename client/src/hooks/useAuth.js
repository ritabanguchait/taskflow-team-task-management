/**
 * useAuth Custom Hook (client/src/hooks/useAuth.js)
 * 
 * WHY THIS FILE EXISTS:
 * Provides a clean, shorthand syntax for consuming the AuthContext.
 * Instead of writing `useContext(AuthContext)` in every component,
 * we simply call `useAuth()`.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
