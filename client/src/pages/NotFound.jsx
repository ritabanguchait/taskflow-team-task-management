import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Button from '../components/Button';

/**
 * NotFound Page (client/src/pages/NotFound.jsx)
 * 
 * Catch-all 404 route for invalid client URLs.
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <AlertCircle size={56} color="var(--primary)" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Return to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
