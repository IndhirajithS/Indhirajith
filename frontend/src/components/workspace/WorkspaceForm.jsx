import React, { useState } from 'react';

export const WorkspaceForm = ({ onSubmit, onCancel, initialValues = {} }) => {
  const [name, setName] = useState(initialValues.name || '');
  const [capacityLimit, setCapacityLimit] = useState(initialValues.capacityLimit || 50);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || capacityLimit <= 0) return;
    onSubmit({
      name,
      capacityLimit: Number(capacityLimit),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <span>📂</span> {initialValues.id ? 'Edit Workspace' : 'Create Workspace'}
      </h2>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Workspace Name <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Core Architecture Docs"
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Capacity Limit (Max Documents) <span className="text-rose-400">*</span>
        </label>
        <input
          type="number"
          min="1"
          max="500"
          value={capacityLimit}
          onChange={(e) => setCapacityLimit(e.target.value)}
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
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
          {initialValues.id ? 'Save Changes' : 'Create Workspace'}
        </button>
      </div>
    </form>
  );
};

export default WorkspaceForm;
