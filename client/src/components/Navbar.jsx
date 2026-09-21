import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from './Button';

/**
 * Navbar Component (client/src/components/Navbar.jsx)
 * 
 * Displays the top bar with the logged-in user profile, role, and logout action.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="navbar">
      <div>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Welcome back, <strong style={{ color: 'var(--text-main)' }}>{user?.name}</strong>!
        </span>
      </div>

      <div className="navbar-user">
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        >
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role || 'Member'}</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
