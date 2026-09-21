import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';
import Button from './Button';

/**
 * ProjectCard Component (client/src/components/ProjectCard.jsx)
 * 
 * Displays project overview, member count, and a direct link to view project details.
 */
const ProjectCard = ({ project, onDelete, currentUserId }) => {
  const navigate = useNavigate();

  const isCreator = project.createdBy && (
    typeof project.createdBy === 'object'
      ? project.createdBy._id === currentUserId
      : project.createdBy === currentUserId
  );

  return (
    <div className="project-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 className="project-title">{project.name}</h3>
        {isCreator && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project._id);
            }}
            title="Delete Project"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <p className="project-desc">
        {project.description || 'No description provided for this project.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Users size={16} />
          <span>{project.members ? project.members.length : 0} team member(s)</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/projects/${project._id}`)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: 'auto' }}
      >
        <span>View Project & Tasks</span>
        <ArrowRight size={14} />
      </Button>
    </div>
  );
};

export default ProjectCard;
