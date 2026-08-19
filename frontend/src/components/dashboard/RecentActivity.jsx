import React from 'react';

export const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg">
      <h3 className="text-base font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <span>⚡</span> Recent Activity Stream
      </h3>
      {activities.length === 0 ? (
        <p className="text-sm text-slate-500 py-4 text-center">No recent activity recorded.</p>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 5).map((act, i) => (
            <div
              key={act.id || i}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400 text-xs border border-indigo-800/40">
                {act.actionType || 'ACT'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 font-medium truncate">
                  {act.description}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                  <span>@{act.performedByUsername || act.actorUsername || 'user'}</span>
                  <span>•</span>
                  <span>{new Date(act.timestamp || act.performedAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
