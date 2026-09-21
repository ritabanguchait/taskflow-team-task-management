import React from 'react';
import { Calendar, User, Edit2, Trash2, Folder } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate } from '../utils/formatDate';

/**
 * TaskCard Component (client/src/components/TaskCard.jsx)
 * 
 * Displays a clean card for a single task with status, priority, due date,
 * assigned member, quick status changer, edit, and delete triggers.
 */
const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.3 }}>
          {task.title}
        </h4>
        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              title="Delete Task"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {task.description}
        </p>
      )}

      {/* Metadata tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {task.project && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-muted)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <Folder size={12} />
            {task.project.name || 'Project'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <User size={14} />
          <span>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={14} />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>

      {/* Quick Status Select */}
      {onStatusChange && (
        <div style={{ marginTop: '0.25rem' }}>
          <select
            className="form-select"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
          >
            <option value="Todo">Move to Todo</option>
            <option value="In Progress">Move to In Progress</option>
            <option value="Completed">Move to Completed</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
