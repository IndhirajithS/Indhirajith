import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchWorkspaces } from '../../store/slices/workspaceSlice';
import { createDocument, updateDocument } from '../../store/slices/documentSlice';

export const DocumentForm = ({
  workspaces: propWorkspaces,
  isEditing: propIsEditing,
  document: propDocument,
  onSubmit,
  onCancel,
  onClose,
  onDismiss,
  closeModal,
  initialValues = {},
  titleState,
  handleChange,
}) => {
  const dispatch = useDispatch();
  const reduxWorkspaces = useSelector((state) => state?.workspace?.workspaces || state?.workspaces?.workspaces || []);
  const [fetchedWorkspaces, setFetchedWorkspaces] = useState([]);

  const isEditing = Boolean(
    propIsEditing ||
    initialValues?.id ||
    propDocument?.id
  );

  const availableWorkspaces =
    propWorkspaces && propWorkspaces.length > 0
      ? propWorkspaces
      : fetchedWorkspaces.length > 0
      ? fetchedWorkspaces
      : reduxWorkspaces;

  const workspaces = Array.isArray(availableWorkspaces) ? availableWorkspaces : [];

  const [title, setTitle] = useState(titleState !== undefined ? titleState : (initialValues.title || ''));
  const [workspaceId, setWorkspaceId] = useState(
    initialValues.workspaceId || (workspaces[0] ? workspaces[0].id : '')
  );
  const [submitting, setSubmitting] = useState(false);

  const handleClose = (e) => {
    if (onClose) onClose(e);
    if (onCancel) onCancel(e);
    if (onDismiss) onDismiss(e);
    if (closeModal) closeModal(e);
  };

  const hasCloseHandler = Boolean(onClose || onCancel || onDismiss || closeModal);

  useEffect(() => {
    let isMounted = true;
    if (dispatch) {
      dispatch(fetchWorkspaces());
    }
    axios
      .get('/api/workspaces')
      .then((res) => {
        if (isMounted && res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setFetchedWorkspaces(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if ((workspaceId === '' || workspaceId === undefined || workspaceId === null) && workspaces.length > 0) {
      setWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, workspaceId]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (handleChange) handleChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedWsId = workspaceId || (workspaces[0] ? workspaces[0].id : 1);
    const payload = isEditing
      ? { title: title.trim() }
      : {
          title: title.trim(),
          workspaceId: Number(selectedWsId) || selectedWsId,
        };

    if (onSubmit) {
      onSubmit(payload);
    }

    if (dispatch) {
      setSubmitting(true);
      const action = isEditing
        ? updateDocument({ id: initialValues.id || propDocument?.id, data: payload })
        : createDocument(payload);

      try {
        const res = await dispatch(action);
        if (!res?.error) {
          handleClose();
        }
      } catch (err) {
        // preserve modal on error
      } finally {
        setSubmitting(false);
      }
    } else {
      handleClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <span>📄</span> {isEditing ? 'Edit Document' : 'Create New Document'}
        </h2>
        {hasCloseHandler && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-200 p-1 text-sm font-bold transition rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        )}
      </div>

      <div>
        <label htmlFor="doc-title" className="block text-xs font-medium text-slate-300 mb-1.5">
          Title
        </label>
        <input
          id="doc-title"
          name="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
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
            name="workspaceId"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
        {hasCloseHandler && (
          <>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cancel"
              className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl transition"
            >
              Close
            </button>
          </>
        )}
        <button
          id="doc-submit"
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;
