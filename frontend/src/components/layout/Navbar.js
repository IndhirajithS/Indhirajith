import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const Navbar = ({ title = 'DraftDash Workspace' }) => {
  const { user, logout } = useAuth();

  const getRoleLabel = () => {
    if (!user) return 'Guest';
    if (user.role) return user.role;
    if (user.roles && user.roles.length > 0) return user.roles[0];
    return 'User';
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {title}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-blue)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                {(user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.username || 'Logged User'}
                </span>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                  {getRoleLabel()}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth/login" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
