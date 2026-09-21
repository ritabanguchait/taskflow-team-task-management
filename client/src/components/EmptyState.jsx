import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

/**
 * EmptyState Component
 * Displays a friendly illustration when a list or query returns 0 results.
 */
const EmptyState = ({
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionText,
  onAction
}) => {
  return (
    <div className="empty-state">
      <FolderOpen className="empty-icon" />
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', marginBottom: actionText ? '1.25rem' : '0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
