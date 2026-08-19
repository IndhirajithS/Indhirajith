import React from 'react';

export const Loader = ({ label = 'Loading...', fullScreen = false }) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '3px solid rgba(88, 166, 255, 0.2)',
          borderTopColor: 'var(--accent-blue)',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        {content}
      </div>
    );
  }

  return <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>{content}</div>;
};

export default Loader;
