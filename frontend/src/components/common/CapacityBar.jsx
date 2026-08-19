import React from 'react';

export const CapacityBar = ({ current = 0, max = 100, label = 'Workspace Capacity' }) => {
  const percentage = Math.min(100, Math.round((current / (max || 1)) * 100));

  let colorClass = 'bg-emerald-500';
  let badgeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
  if (percentage >= 90) {
    colorClass = 'bg-rose-500';
    badgeColor = 'text-rose-400 bg-rose-950/40 border-rose-800/50';
  } else if (percentage >= 70) {
    colorClass = 'bg-amber-500';
    badgeColor = 'text-amber-400 bg-amber-950/40 border-amber-800/50';
  }

  return (
    <div className="w-full space-y-1.5 font-sans">
      <div className="flex justify-between items-center text-xs font-medium">
        <span className="text-slate-300 flex items-center gap-1.5">
          <span>{label}</span>
          <span className={`px-2 py-0.5 text-[10px] rounded-full border ${badgeColor}`}>
            {percentage}%
          </span>
        </span>
        <span className="text-slate-400 font-mono">
          {current} / {max} items
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default CapacityBar;
