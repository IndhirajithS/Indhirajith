import React, { useState } from 'react';

export const VersionForm = ({ documentId, onSubmit, onCancel }) => {
  const [contentDelta, setContentDelta] = useState('');
  const [commitMessage, setCommitMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contentDelta.trim()) return;
    onSubmit({
      documentId,
      contentDelta,
      commitMessage: commitMessage || 'Version snapshot update',
    });
    setContentDelta('');
    setCommitMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
      <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
        <span>📝</span> Create Version Snapshot
      </h3>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Content Changes / Delta <span className="text-rose-400">*</span>
        </label>
        <textarea
          rows={4}
          value={contentDelta}
          onChange={(e) => setContentDelta(e.target.value)}
          placeholder="Enter modified section or complete text delta..."
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">Commit Message</label>
        <input
          type="text"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="e.g., Added section on OAuth 2.0 PKCE flow"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition"
        >
          Save Version
        </button>
      </div>
    </form>
  );
};

export default VersionForm;
