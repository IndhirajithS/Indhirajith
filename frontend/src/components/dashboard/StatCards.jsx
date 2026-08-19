import React from 'react';

export const StatCards = ({ workspaces = [], documents = [], pendingReviews = 0 }) => {
  const activeDocs = documents.length;
  const approvedDocs = documents.filter((d) => d.currentStatus === 'APPROVED').length;
  const draftDocs = documents.filter((d) => d.currentStatus === 'DRAFT').length;

  const stats = [
    {
      title: 'Total Workspaces',
      value: workspaces.length,
      icon: '📂',
      trend: '+12% this month',
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    },
    {
      title: 'Active Documents',
      value: activeDocs,
      icon: '📄',
      trend: `${draftDocs} in draft stage`,
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Pending Reviews',
      value: pendingReviews,
      icon: '⏳',
      trend: 'Requires quality reviewer action',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    },
    {
      title: 'Approved Documents',
      value: approvedDocs,
      icon: '✅',
      trend: `${Math.round((approvedDocs / (activeDocs || 1)) * 100)}% approval rate`,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`p-5 rounded-2xl bg-gradient-to-br border ${stat.color} backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {stat.title}
            </span>
            <span className="text-2xl p-2 bg-slate-900/60 rounded-xl border border-slate-800">
              {stat.icon}
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-1 font-mono">
            {stat.value}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {stat.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
