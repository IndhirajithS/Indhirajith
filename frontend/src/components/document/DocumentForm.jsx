import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkspaces } from '../../store/slices/workspaceSlice';

export const DocumentForm = ({ workspaces: propWorkspaces, onSubmit, onCancel, initialValues = {} }) => {
  const dispatch = useDispatch();
  const reduxWorkspaces = useSelector((state) => state?.workspace?.workspaces || state?.workspaces?.workspaces || []);
  const availableWorkspaces = propWorkspaces && propWorkspaces.length > 0 ? propWorkspaces : reduxWorkspaces;

  const [title, setTitle] = useState(initialValues.title || '');
  const [workspaceId, setWorkspaceId] = useState(
    initialValues.workspaceId || (availableWorkspaces[0] ? availableWorkspaces[0].id : '')
  );

  useEffect(() => {
    if ((!propWorkspaces || propWorkspaces.length === 0) && reduxWorkspaces.length === 0) {
      dispatch(fetchWorkspaces());
    }
  }, [dispatch, propWorkspaces, reduxWorkspaces.length]);

  useEffect(() => {
    if (!workspaceId && availableWorkspaces.length > 0) {
      setWorkspaceId(availableWorkspaces[0].id);
    }
  }, [availableWorkspaces, workspaceId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (onSubmit) {
      onSubmit({
        title,
        workspaceId: Number(workspaceId),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <span>📄</span> {initialValues.id ? 'Edit Document' : 'Create New Document'}
      </h2>

      <div>
        <label htmlFor="document-title" className="block text-xs font-medium text-slate-300 mb-1.5">
          Document Title <span className="text-rose-400">*</span>
        </label>
        <input
          id="document-title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. System Architecture Whitepaper"
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      <div>
        <label htmlFor="target-workspace" className="block text-xs font-medium text-slate-300 mb-1.5">
          Target Workspace <span className="text-rose-400">*</span>
        </label>
        <select
          id="target-workspace"
          name="workspaceId"
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {availableWorkspaces.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name} (Capacity: {ws.currentDocumentCount || 0}/{ws.capacityLimit || 100})
            </option>
          ))}
        </select>
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
          {initialValues.id ? 'Save Changes' : 'Create Document'}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;
