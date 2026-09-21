import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, User, Sparkles } from 'lucide-react';

/**
 * Sidebar Component (client/src/components/Sidebar.jsx)
 * 
 * Main vertical navigation for TaskFlow.
 */
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">
          <Sparkles size={22} />
        </div>
        <div>
          <span className="brand-name">TaskFlow</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            TEAM WORKSPACE
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <FolderKanban className="nav-icon" />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <CheckSquare className="nav-icon" />
          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <User className="nav-icon" />
          <span>My Profile</span>
        </NavLink>
      </nav>

      {/* Footer info box in sidebar */}
      <div style={{ padding: '1rem', margin: '0.75rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>TaskFlow v1.0</div>
        <div>MERN Stack Architecture</div>
      </div>
    </aside>
  );
};

export default Sidebar;
