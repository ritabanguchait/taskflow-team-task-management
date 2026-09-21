import React, { useState, useEffect } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import projectService from '../services/projectService';
import userService from '../services/userService';
import useAuth from '../hooks/useAuth';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

/**
 * Projects Page (client/src/pages/Projects.jsx)
 * 
 * Displays all projects the user is involved in, with ability to create new projects
 * and manage team member participation.
 */
const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch Projects & Team Members
  const loadData = async () => {
    try {
      setLoading(true);
      const [projRes, usersRes] = await Promise.all([
        projectService.getProjects(),
        userService.getUsers()
      ]);

      if (projRes.success) setProjects(projRes.projects);
      if (usersRes.success) setTeamUsers(usersRes.users);
    } catch (err) {
      console.error('Error loading projects data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMemberToggle = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter a project name.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await projectService.createProject({
        name,
        description,
        members: selectedMembers
      });

      if (res.success) {
        setIsModalOpen(false);
        setName('');
        setDescription('');
        setSelectedMembers([]);
        // Refresh project list
        loadData();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project and all its associated tasks?')) {
      try {
        await projectService.deleteProject(projectId);
        setProjects(projects.filter((p) => p._id !== projectId));
      } catch (err) {
        alert(err.response?.data?.message || 'Could not delete project');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Projects</h1>
          <p className="page-subtitle">Organize and manage projects across your organization.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>New Project</span>
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading team projects..." />
      ) : projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDeleteProject}
              currentUserId={user?._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="Create your first project to start organizing team tasks."
          actionText="Create Project"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        {formError && <div className="alert-error">{formError}</div>}

        <form onSubmit={handleCreateProject}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Mobile App Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Outline project objectives and team milestones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Add Team Members</label>
            <div
              style={{
                maxHeight: '160px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.75rem'
              }}
            >
              {teamUsers.map((member) => (
                <label
                  key={member._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.35rem 0',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member._id) || member._id === user?._id}
                    disabled={member._id === user?._id} // Creator is always included
                    onChange={() => handleMemberToggle(member._id)}
                  />
                  <span>
                    {member.name} {member._id === user?._id ? '(You - Creator)' : `(${member.email})`}
                  </span>
                </label>
              ))}
            </div>
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
              {submitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
