import React from 'react';

export const StatusDistributionBar = ({ documents = [] }) => {
  const total = documents.length || 1;

  const counts = {
    DRAFT: documents.filter((d) => d.currentStatus === 'DRAFT').length,
    SUBMITTED: documents.filter((d) => d.currentStatus === 'SUBMITTED' || d.currentStatus === 'IN_REVIEW').length,
    APPROVED: documents.filter((d) => d.currentStatus === 'APPROVED').length,
    REJECTED: documents.filter((d) => d.currentStatus === 'REJECTED').length,
  };

  const getPercent = (count) => Math.round((count / total) * 100);

  const segments = [
    { label: 'Draft', count: counts.DRAFT, color: 'bg-slate-500', text: 'text-slate-400' },
    { label: 'In Review', count: counts.SUBMITTED, color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Approved', count: counts.APPROVED, color: 'bg-emerald-500', text: 'text-emerald-400' },
    { label: 'Rejected', count: counts.REJECTED, color: 'bg-rose-500', text: 'text-rose-400' },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <span>📈</span> Document Status Distribution
        </h3>
        <span className="text-xs text-slate-400 font-mono">{documents.length} Total Documents</span>
      </div>

      <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 p-0.5 shadow-inner">
        {segments.map((seg, idx) => {
          const pct = getPercent(seg.count);
          if (pct === 0) return null;
          return (
            <div
              key={idx}
              className={`h-full ${seg.color} first:rounded-l-full last:rounded-r-full transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${seg.label}: ${seg.count} (${pct}%)`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-800/50">
            <span className={`w-3 h-3 rounded-full ${seg.color}`} />
            <div>
              <div className="text-xs font-medium text-slate-300">{seg.label}</div>
              <div className={`text-xs font-mono font-bold ${seg.text}`}>{seg.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDistributionBar;
