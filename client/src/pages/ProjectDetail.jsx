import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, CheckCircle2, Clock, ListTodo, Calendar } from 'lucide-react';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import userService from '../services/userService';
import Button from '../components/Button';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

/**
 * ProjectDetail Page (client/src/pages/ProjectDetail.jsx)
 * 
 * Displays project breakdown:
 * - Project title & description
 * - Team members list
 * - Aggregated task stats (Total, Todo, In Progress, Completed)
 * - All tasks belonging to this project
 * - Ability to quickly add tasks directly inside this project
 */
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [taskError, setTaskError] = useState('');
  const [submittingTask, setSubmittingTask] = useState(false);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projRes, tasksRes, usersRes] = await Promise.all([
        projectService.getProjectById(id),
        taskService.getTasks({ project: id }),
        userService.getUsers()
      ]);

      if (projRes.success) setProject(projRes.project);
      if (tasksRes.success) setTasks(tasksRes.tasks);
      if (usersRes.success) setTeamUsers(usersRes.users);
    } catch (err) {
      console.error('Error fetching project detail:', err);
      setError('Project not found or you do not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchProjectData();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter((t) => t._id !== taskId));
        fetchProjectData();
      } catch (err) {
        alert(err.response?.data?.message || 'Could not delete task');
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError('');

    if (!taskTitle.trim()) {
      setTaskError('Task title is required.');
      return;
    }

    try {
      setSubmittingTask(true);
      const res = await taskService.createTask({
        title: taskTitle,
        description: taskDesc,
        project: id,
        assignedTo: assignedTo || null,
        priority,
        dueDate: dueDate || null
      });

      if (res.success) {
        setIsTaskModalOpen(false);
        setTaskTitle('');
        setTaskDesc('');
        setAssignedTo('');
        setPriority('Medium');
        setDueDate('');
        fetchProjectData();
      }
    } catch (err) {
      setTaskError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setSubmittingTask(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading project details..." />;
  }

  if (error || !project) {
    return (
      <div>
        <div className="alert-error">{error || 'Project not found.'}</div>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const { stats } = project;

  return (
    <div>
      {/* Back button & Page title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/projects')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '0.75rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </button>

        <div className="page-header" style={{ marginBottom: '0.5rem' }}>
          <div>
            <h1 className="page-title">{project.name}</h1>
            <p className="page-subtitle">
              {project.description || 'No description provided.'}
            </p>
          </div>
          <Button variant="primary" onClick={() => setIsTaskModalOpen(true)}>
            <Plus size={16} />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Team Members Chips */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          <Users size={16} />
          <span>PROJECT COLLABORATORS ({project.members?.length || 0})</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {project.members && project.members.map((member) => (
            <div
              key={member._id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--bg-muted)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem'
                }}
              >
                {member.name[0]}
              </div>
              <span>{member.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task Statistics Breakdown Cards */}
      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
            <ListTodo size={24} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalTasks ?? 0}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{stats?.todoTasks ?? 0}</div>
            <div className="stat-label">Todo</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{stats?.inProgressTasks ?? 0}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-value">{stats?.completedTasks ?? 0}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Project Tasks ({tasks.length})</h2>
        </div>

        {tasks.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tasks in this project yet"
            description="Create the first task for this project to start tracking work."
            actionText="Add Task"
            onAction={() => setIsTaskModalOpen(true)}
          />
        )}
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={`Add Task to "${project.name}"`}
      >
        {taskError && <div className="alert-error">{taskError}</div>}

        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Set up authentication endpoints"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="What needs to be accomplished?"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select
              className="form-select"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Unassigned</option>
              {project.members && project.members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTaskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingTask}>
              {submittingTask ? 'Adding...' : 'Add Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
