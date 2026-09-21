/**
 * Date Formatting Utility (client/src/utils/formatDate.js)
 * 
 * Formats ISO date strings into clean, human-readable dates (e.g. "Sep 25, 2025").
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const getDaysRemaining = (dueDate) => {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
