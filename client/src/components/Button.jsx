import React from 'react';

/**
 * Reusable Button Component
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'outline' | 'danger'
 * - size: 'sm' | 'md'
 * - children: button content
 * - ...props: standard HTML button attributes (type, onClick, disabled, etc.)
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
