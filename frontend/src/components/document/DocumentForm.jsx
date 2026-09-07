import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDocument, updateDocument } from '../../store/slices/documentSlice';
import { fetchWorkspaces } from '../../store/slices/workspaceSlice';

export const DocumentForm = ({
  workspaces: propWorkspaces,
  existingDocument,
  initialValues,
  isEditing: propIsEditing,
  onClose,
  onCancel,
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const reduxWorkspaces = useSelector(
    (state) => state?.workspace?.workspaces || state?.workspaces?.workspaces || state?.workspaces?.items || []
  );
  const workspaces = propWorkspaces && propWorkspaces.length > 0 ? propWorkspaces : reduxWorkspaces;

  const isEditing = Boolean(propIsEditing || initialValues?.id || existingDocument?.id);

  const [title, setTitle] = useState(
    initialValues?.title || existingDocument?.title || ''
  );
  const [workspaceId, setWorkspaceId] = useState(
    initialValues?.workspaceId || (workspaces && workspaces[0] ? workspaces[0].id : '')
  );

  // T8: Async Workspace fetching on Form mount
  useEffect(() => {
    if (dispatch) {
      dispatch(fetchWorkspaces());
    }
  }, [dispatch]);

  useEffect(() => {
    if (initialValues?.title !== undefined) {
      setTitle(initialValues.title);
    } else if (existingDocument?.title !== undefined) {
      setTitle(existingDocument.title);
    }
  }, [initialValues?.title, existingDocument?.title]);

  useEffect(() => {
    if (initialValues?.workspaceId !== undefined) {
      setWorkspaceId(initialValues.workspaceId);
    }
  }, [initialValues?.workspaceId]);

  const handleClose = (e) => {
    if (onClose) onClose(e);
    if (onCancel) onCancel(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const resolvedWorkspaceId = workspaceId || (workspaces && workspaces[0] ? workspaces[0].id : '');
    const payload = isEditing
      ? { title }
      : { title, workspaceId: resolvedWorkspaceId };

    if (onSubmit) {
      onSubmit(payload);
    }

    const action = isEditing
      ? updateDocument({ id: initialValues?.id || existingDocument?.id, data: payload })
      : createDocument(payload);

    if (dispatch) {
      dispatch(action).then((response) => {
        if (!response?.error && onClose) {
          onClose();
        }
      });
    } else {
      if (onClose) onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <span>📄</span> {isEditing ? 'Edit Document' : 'Create New Document'}
        </h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="text-slate-400 hover:text-slate-200 p-1 text-sm font-bold transition rounded-lg hover:bg-slate-800"
        >
          ✕
        </button>
      </div>

      <div>
        <label htmlFor="doc-title" className="block text-xs font-medium text-slate-300 mb-1.5">
          Title
        </label>
        <input
          id="doc-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      {!isEditing && (
        <div>
          <label htmlFor="doc-workspace" className="block text-xs font-medium text-slate-300 mb-1.5">
            Workspace
          </label>
          <select
            id="doc-workspace"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="" disabled>Select Workspace</option>
            {workspaces && workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>{ws.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl transition"
        >
          Close
        </button>
        <button
          id="doc-submit"
          type="submit"
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;