import React from 'react';

export const ErrorHandler = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="bg-rose-950/90 border border-rose-800 text-rose-200 p-4 rounded-xl shadow-lg flex items-center justify-between my-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <h4 className="text-xs uppercase font-mono font-bold text-rose-300">Application Error</h4>
          <p className="text-sm font-medium">{typeof error === 'string' ? error : error.message || 'An unexpected error occurred.'}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-100 p-1 text-sm font-bold transition"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorHandler;
