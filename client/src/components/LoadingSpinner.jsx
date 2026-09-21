import React from 'react';

/**
 * LoadingSpinner Component
 * Displays a lightweight animated CSS spinner.
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="center-spinner">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div className="spinner"></div>
        {message && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
