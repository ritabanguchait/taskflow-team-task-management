import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Calendar, CheckSquare } from 'lucide-react';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import userService from '../services/userService';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  TASK_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS
} from '../utils/constants';

/**
 * Tasks Page (client/src/pages/Tasks.jsx)
 * 
 * Central hub for task management:
 * - Search by title
 * - Filter by status, priority, project, and assigned team member
 * - Create new tasks
 * - Edit existing tasks
 * - Delete tasks
 * - Quick status updates
 */
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');

  // Modal State (Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Task Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'Todo',
    dueDate: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load Projects and Users once on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [projRes, usersRes] = await Promise.all([
          projectService.getProjects(),
          userService.getUsers()
        ]);
        if (projRes.success) setProjects(projRes.projects);
        if (usersRes.success) setUsers(usersRes.users);
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    };
    loadMetadata();
  }, []);

  // Fetch Tasks whenever filters or search change
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (projectFilter) params.project = projectFilter;
      if (assignedFilter) params.assignedTo = assignedFilter;

      const data = await taskService.getTasks(params);
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search/filter fetch slightly
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter, projectFilter, assignedFilter]);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      project: projects.length > 0 ? projects[0]._id : '',
      assignedTo: '',
      priority: 'Medium',
      status: 'Todo',
      dueDate: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      project: task.project ? task.project._id : '',
      assignedTo: task.assignedTo ? task.assignedTo._id : '',
      priority: task.priority || 'Medium',
      status: task.status || 'Todo',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Task title is required.');
      return;
    }

    if (!formData.project) {
      setFormError('Please select a project for this task.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        project: formData.project,
        assignedTo: formData.assignedTo || null,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || null
      };

      if (editingTask) {
        await taskService.updateTask(editingTask._id, payload);
      } else {
        await taskService.createTask(payload);
      }

      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Status Update
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      console.error('Error changing task status:', err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter((t) => t._id !== taskId));
      } catch (err) {
        alert(err.response?.data?.message || 'Could not delete task');
      }
    }
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setProjectFilter('');
    setAssignedFilter('');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks Management</h1>
          <p className="page-subtitle">Track, filter, and organize team tasks in one unified view.</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreateModal}>
          <Plus size={16} />
          <span>New Task</span>
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {TASK_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {TASK_PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Project Filter */}
        <select
          className="filter-select"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Assignee Filter */}
        <select
          className="filter-select"
          value={assignedFilter}
          onChange={(e) => setAssignedFilter(e.target.value)}
        >
          <option value="">All Team Members</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        {(search || statusFilter || priorityFilter || projectFilter || assignedFilter) && (
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Reset
          </Button>
        )}
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <LoadingSpinner message="Filtering tasks..." />
      ) : tasks.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tasks match your criteria"
          description="Try clearing search filters or create a new task."
          actionText="Create Task"
          onAction={handleOpenCreateModal}
        />
      )}

      {/* Create / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        {formError && <div className="alert-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Implement payment webhook listener"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Task details and acceptance criteria..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project *</label>
            <select
              className="form-select"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              required
            >
              <option value="">Select a Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select
              className="form-select"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
