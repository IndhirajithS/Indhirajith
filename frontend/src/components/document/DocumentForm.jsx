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

  // T8: Async Workspace fetching on Form mount
  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const action = isEditing 
      ? updateDocument({ id: existingDocument.id, dto: { title } }) 
      : createDocument({ title, workspaceId });

    // T9: Modal dismissal callback execution (Safe Promise Resolution)
    dispatch(action).then((response) => {
      if (!response.error && onClose) {
        onClose();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="doc-title">Title</label>
        <input 
          id="doc-title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>

      {!isEditing && (
        <div>
          <label htmlFor="doc-workspace">Workspace</label>
          <select 
            id="doc-workspace" 
            value={workspaceId} 
            onChange={(e) => setWorkspaceId(e.target.value)} 
            required
          >
            <option value="" disabled>Select Workspace</option>
            {workspaces && workspaces.map((ws) => (
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