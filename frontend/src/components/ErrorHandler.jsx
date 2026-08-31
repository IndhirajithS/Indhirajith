import React from 'react';

export const ErrorHandler = ({ error, message, children, onDismiss, onClose }) => {
  const displayMsg =
    message ||
    (typeof error === 'string'
      ? error
      : error?.message || (error ? JSON.stringify(error) : null)) ||
    children;

  if (!displayMsg && !error) {
    return <div data-testid="error-handler-empty" />;
  }

  const handleDismiss = onDismiss || onClose;

  return (
    <div
      className="bg-rose-950/90 border border-rose-800 text-rose-200 p-4 rounded-xl shadow-lg flex items-center justify-between my-4 backdrop-blur-md"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <h4 className="text-xs uppercase font-mono font-bold text-rose-300">Application Error</h4>
          <p className="text-sm font-medium">{displayMsg || 'An unexpected error occurred.'}</p>
        </div>
      </div>
      {handleDismiss && (
        <button
          onClick={handleDismiss}
          className="text-rose-400 hover:text-rose-100 p-1 text-sm font-bold transition"
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export const ErrorBoundary = ErrorHandler;
export default ErrorHandler;
