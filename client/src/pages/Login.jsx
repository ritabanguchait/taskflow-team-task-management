import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogIn } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';

/**
 * Login Page (client/src/pages/Login.jsx)
 * 
 * Handles user authentication with email and password.
 * Includes demo auto-fill buttons for quick testing during interviews and evaluation.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper for one-click demo login
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo" style={{ margin: '0 auto', width: '48px', height: '48px' }}>
            <Sparkles size={28} />
          </div>
          <h2 className="auth-title">Welcome to TaskFlow</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Sign in to manage your team's tasks and projects
          </p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Demo Accounts Quick-Fill Helper for Freshers & Interviewers */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            Demo Accounts (One-Click Fill):
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoAccount('alex@example.com', 'password123')}
            >
              Alex (Admin)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoAccount('sarah@example.com', 'password123')}
            >
              Sarah (Member)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoAccount('rohan@example.com', 'password123')}
            >
              Rohan (Member)
            </Button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
