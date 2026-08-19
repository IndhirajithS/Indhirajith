import React from 'react';

export const EmptyState = ({
  icon = '📂',
  title = 'No items found',
  description = 'There are no records matching your criteria or non exist yet.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800 my-4">
      <div className="text-4xl mb-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/40 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition duration-150 ease-in-out active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
