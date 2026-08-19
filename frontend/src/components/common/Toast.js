import React, { useEffect } from 'react';

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { bg: 'rgba(46, 160, 67, 0.95)', border: '1px solid #3fb950', text: '#ffffff' };
      case 'error':
        return { bg: 'rgba(248, 81, 73, 0.95)', border: '1px solid #f85149', text: '#ffffff' };
      case 'warning':
        return { bg: 'rgba(210, 153, 34, 0.95)', border: '1px solid #d29922', text: '#ffffff' };
      case 'info':
      default:
        return { bg: 'rgba(56, 139, 253, 0.95)', border: '1px solid #58a6ff', text: '#ffffff' };
    }
  };

  const style = getTypeStyles();

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: style.bg,
        border: style.border,
        color: style.text,
        padding: '12px 18px',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 2000,
        fontSize: '0.875rem',
        fontWeight: 500
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '1.1rem',
          cursor: 'pointer',
          padding: 0
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
