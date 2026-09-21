import React from 'react';

/**
 * PriorityBadge Component
 * Displays a colorful pill badge corresponding to task priority.
 */
const PriorityBadge = ({ priority }) => {
  let badgeClass = 'badge-medium';

  if (priority === 'Low') {
    badgeClass = 'badge-low';
  } else if (priority === 'High') {
    badgeClass = 'badge-high';
  }

  return <span className={`badge ${badgeClass}`}>{priority || 'Medium'}</span>;
};

export default PriorityBadge;
