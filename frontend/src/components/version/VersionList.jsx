import React from 'react';
import EmptyState from '../common/EmptyState';

export const VersionList = ({ versions = [] }) => {
  if (versions.length === 0) {
    return (
      <EmptyState
        icon="📜"
        title="No Version History"
        description="This document does not have any saved version iterations yet."
      />
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg space-y-4">
      <h3 className="text-base font-semibold text-slate-100 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span>📜</span> Version History
        </span>
        <span className="text-xs text-slate-400 font-mono">{versions.length} Releases</span>
      </h3>

      <div className="space-y-3">
        {versions.map((ver) => (
          <div
            key={ver.id}
            className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-md">
                  v{ver.versionNumber}
                </span>
                <span className="text-sm font-semibold text-slate-200">{ver.commitMessage}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">@{ver.authorUsername || 'author'}</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{ver.contentDelta}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionList;
