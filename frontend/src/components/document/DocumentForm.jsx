import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Ensure these match your actual thunk exports in documentSlice and workspaceSlice
import { createDocument, updateDocument } from '../../store/slices/documentSlice';
import { fetchWorkspaces } from '../../store/slices/workspaceSlice';

const DocumentForm = ({ existingDocument, onClose }) => {
  const [title, setTitle] = useState(existingDocument ? existingDocument.title : '');
  const [workspaceId, setWorkspaceId] = useState('');
  
  const dispatch = useDispatch();
  const { items: workspaces } = useSelector((state) => state.workspaces);
  
  const isEditing = !!existingDocument;

  useEffect(() => {
    // T8: Async Workspace fetching on Form mount
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let resultAction;
    
    if (isEditing) {
      resultAction = await dispatch(updateDocument({ id: existingDocument.id, dto: { title } }));
    } else {
      resultAction = await dispatch(createDocument({ title, workspaceId }));
    }

    // T9: Modal dismissal callback execution
    if (!resultAction.error && onClose) {
      onClose(); 
    }
  };

  return (
    <div className="document-form-modal">
      <form onSubmit={handleSubmit}>
        {/* T28: Form label accessibility: Title | T7: Form state Reactivity */}
        <div>
          <label htmlFor="doc-title">Title</label>
          <input 
            id="doc-title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        {/* T29: Form label accessibility: Workspace */}
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
              {workspaces?.map((ws) => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* T23: DocumentForm submit button role */}
        <button id="doc-submit" type="submit">
          {isEditing ? 'Update Document' : 'Create Document'}
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;