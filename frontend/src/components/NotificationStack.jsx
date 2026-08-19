import React from 'react';

export const NotificationStack = ({ notifications = [], onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md transition flex items-center justify-between gap-3 ${
            notif.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
              : notif.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-800'
              : 'bg-indigo-950/90 text-indigo-200 border-indigo-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">
              {notif.type === 'success' ? '✅' : notif.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <p className="text-xs font-medium">{notif.message}</p>
          </div>
          {onDismiss && (
            <button
              onClick={() => onDismiss(notif.id)}
              className="text-xs text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationStack;
