/**
 * Application Constants (client/src/utils/constants.js)
 * 
 * Centralized lists of options for dropdowns and filter selectors.
 */

export const TASK_STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

export const TASK_STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Todo', value: 'Todo' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' }
];

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

export const TASK_PRIORITY_OPTIONS = [
  { label: 'All Priorities', value: '' },
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' }
];
