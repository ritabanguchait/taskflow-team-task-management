import React from 'react';

/**
 * StatusBadge Component
 * Displays a colorful pill badge corresponding to task status.
 */
const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-todo';

  if (status === 'In Progress') {
    badgeClass = 'badge-in-progress';
  } else if (status === 'Completed') {
    badgeClass = 'badge-completed';
  }

  return <span className={`badge ${badgeClass}`}>{status || 'Todo'}</span>;
};

export default StatusBadge;
