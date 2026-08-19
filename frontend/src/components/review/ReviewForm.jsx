import React, { useState } from 'react';

export const ReviewForm = ({ reviewCycleId, onSubmit, onCancel }) => {
  const [decision, setDecision] = useState('APPROVED');
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      decision,
      feedbackNotes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <span>⭐</span> Quality Review Decision
      </h3>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">Decision Status</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDecision('APPROVED')}
            className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition ${
              decision === 'APPROVED'
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>✅</span> Approve Document
          </button>
          <button
            type="button"
            onClick={() => setDecision('REJECTED')}
            className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition ${
              decision === 'REJECTED'
                ? 'bg-rose-950/80 text-rose-400 border-rose-500 shadow-md ring-1 ring-rose-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>❌</span> Reject Document
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Reviewer Feedback & Notes
        </label>
        <textarea
          rows={4}
          value={feedbackNotes}
          onChange={(e) => setFeedbackNotes(e.target.value)}
          placeholder="Provide detailed observations or requirements for approval..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition"
        >
          Submit Review Decision
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
