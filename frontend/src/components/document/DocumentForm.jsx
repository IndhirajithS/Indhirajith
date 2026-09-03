import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDocument, updateDocument } from '../../store/slices/documentSlice';
import { fetchWorkspaces } from '../../store/slices/workspaceSlice';

const DocumentForm = ({ existingDocument, onClose }) => {
  const [title, setTitle] = useState(existingDocument ? existingDocument.title : '');
  const [workspaceId, setWorkspaceId] = useState('');
  
  const dispatch = useDispatch();
  const { items: workspaces } = useSelector((state) => state.workspaces);
  const isEditing = !!existingDocument;

  useEffect(() => {
    // T8: Dispatches fetchWorkspaces exactly on mount
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await dispatch(updateDocument({ id: existingDocument.id, dto: { title } })).unwrap();
      } else {
        await dispatch(createDocument({ title, workspaceId })).unwrap();
      }
      // T9: Executes dismissal callback immediately upon successful resolution
      if (onClose) onClose();
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="doc-title">Title</label>
        <input id="doc-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      {!isEditing && (
        <div>
          <label htmlFor="doc-workspace">Workspace</label>
          <select id="doc-workspace" value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} required>
            <option value="" disabled>Select Workspace</option>
            {workspaces?.map((ws) => (
              <option key={ws.id} value={ws.id}>{ws.name}</option>
            ))}
          </select>
        </div>
      )}

      <button id="doc-submit" type="submit">
        {isEditing ? 'Update Document' : 'Create Document'}
      </button>
    </form>
  );
};

export default DocumentForm;