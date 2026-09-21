import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import taskService from '../services/taskService';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/formatDate';

/**
 * Dashboard Page (client/src/pages/Dashboard.jsx)
 * 
 * Displays live aggregated statistics (Total Projects, Total Tasks, Pending, Completed)
 * and the 5 most recently created/updated tasks with quick status toggle.
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await taskService.getDashboardStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      // Refresh dashboard numbers & recent tasks
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching dashboard metrics..." />;
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  const completionRate =
    stats && stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div>
      {/* Header with Quick Actions */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Overview</h1>
          <p className="page-subtitle">Track your team's progress, ongoing projects, and task milestones.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" onClick={() => navigate('/projects')}>
            View Projects
          </Button>
          <Button variant="primary" onClick={() => navigate('/tasks')}>
            <Plus size={16} />
            <span>Manage Tasks</span>
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
            <FolderKanban size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalProjects ?? 0}</div>
            <div className="stat-label">Total Projects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
            <ListTodo size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalTasks ?? 0}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Clock size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.pendingTasks ?? 0}</div>
            <div className="stat-label">Pending / In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.completedTasks ?? 0}</div>
            <div className="stat-label">Completed Tasks</div>
          </div>
        </div>
      </div>

      {/* Completion Progress Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <TrendingUp size={18} color="var(--primary)" />
            <span>Overall Team Completion Rate</span>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
            {completionRate}%
          </span>
        </div>
        <div className="progress-bar-container" style={{ height: '8px' }}>
          <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>{stats?.completedTasks ?? 0} of {stats?.totalTasks ?? 0} tasks resolved</span>
          <span>{stats?.pendingTasks ?? 0} remaining</span>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Tasks</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
            <span>View All Tasks</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        {stats?.recentTasks && stats.recentTasks.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTasks.map((task) => (
                  <tr key={task._id}>
                    <td style={{ fontWeight: 600 }}>{task.title}</td>
                    <td>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {task.project ? task.project.name : '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td>
                      <StatusBadge status={task.status} />
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatDate(task.dueDate)}
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to see real-time updates and progress tracking."
            actionText="Go to Tasks"
            onAction={() => navigate('/tasks')}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
