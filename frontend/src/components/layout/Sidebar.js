import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { hasRole } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">DD</div>
        <span>DraftDash</span>
      </div>

      <nav className="nav-group">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span>📊 Dashboard</span>
        </NavLink>

        <NavLink
          to="/documents"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span>📁 Documents</span>
        </NavLink>

        <NavLink
          to="/versions/draft"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span>✍️ Draft Editor</span>
        </NavLink>

        <NavLink
          to="/versions/compare/1/2"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span>🔍 Version Compare</span>
        </NavLink>

        {hasRole('PROJECT_DIRECTOR') && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', paddingLeft: '12px', textTransform: 'uppercase' }}>
              Management
            </span>
            <div style={{ marginTop: '8px' }}>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span>📜 Audit Logs</span>
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      <div style={{ marginTop: 'auto', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>DraftDash v1.0</p>
        <p>Document Versioning & Audit Loop</p>
      </div>
    </aside>
  );
};

export default Sidebar;
