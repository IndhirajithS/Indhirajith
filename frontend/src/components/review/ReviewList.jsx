import React from 'react';
import EmptyState from '../common/EmptyState';

export const ReviewList = ({ reviews = [], onSelectReview }) => {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title="No Pending Reviews"
        description="There are currently no documents submitted for quality review."
      />
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg space-y-4">
      <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
        <span>⭐</span> Pending Quality Reviews ({reviews.length})
      </h3>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
          >
            <div>
              <h4 className="text-sm font-semibold text-slate-100">Document #{rev.documentId}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Submitted by @{rev.reviewerUsername || 'creator'} • Status: {rev.status || 'SUBMITTED'}
              </p>
            </div>

            {onSelectReview && (
              <button
                onClick={() => onSelectReview(rev)}
                className="px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 rounded-lg transition"
              >
                Evaluate Review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
