import React, { useState, useEffect } from 'react';
import { User, Shield, Mail, Calendar, CheckSquare, Save } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';
import taskService from '../services/taskService';
import Button from '../components/Button';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatDate';

/**
 * Profile Page (client/src/pages/Profile.jsx)
 * 
 * Manages user profile information and lists tasks specifically assigned to the user.
 */
const Profile = () => {
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [myTasks, setMyTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch tasks assigned to the current user
  useEffect(() => {
    const fetchMyTasks = async () => {
      if (!user?._id) return;
      try {
        setLoadingTasks(true);
        const data = await taskService.getTasks({ assignedTo: user._id });
        if (data.success) {
          setMyTasks(data.tasks);
        }
      } catch (err) {
        console.error('Error fetching assigned tasks:', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchMyTasks();
  }, [user?._id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { name };
      if (password) payload.password = password;

      const res = await userService.updateProfile(payload);
      if (res.success) {
        setMessage('Profile updated successfully!');
        updateUserData(res.user);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      // Update local state
      setMyTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Manage your account credentials and view your assigned deliverables.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* User Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>Account Details</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user?.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Mail size={14} />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Role</span>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{user?.role || 'Member'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Member Since</span>
              <span style={{ fontWeight: 500 }}>{formatDate(user?.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Tasks</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{myTasks.length}</span>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>Edit Credentials</h3>

          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Change Password (leave blank to keep current)</label>
              <input
                type="password"
                className="form-input"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {password && (
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!!password}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
            >
              <Save size={16} />
              <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Tasks Assigned To Me */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Tasks Assigned to Me ({myTasks.length})</h2>
        </div>

        {loadingTasks ? (
          <LoadingSpinner message="Loading your tasks..." />
        ) : myTasks.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {myTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            You currently have no tasks assigned to you.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
