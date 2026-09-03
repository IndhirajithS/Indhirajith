import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
// Ensure this path matches your actual Redux slice export
import { fetchDocuments } from '../../store/slices/documentSlice'; 

const DocumentList = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // T5: Reads query param workspaceId
  const workspaceId = searchParams.get('workspaceId'); 
  
  // Extract state inside the component function
  const { role } = useSelector((state) => state.auth);
  const { items: documents } = useSelector((state) => state.documents);

  useEffect(() => {
    // T5: DocumentList API fetch invocation on mount
    dispatch(fetchDocuments(workspaceId));
  }, [dispatch, workspaceId]);

  return (
    <div className="document-list-container">
      <div className="header-actions">
        <h2>Documents</h2>
        
        {/* T6: Guest restrictions - Button is hidden for GUEST_OBSERVER */}
        {(role === 'CONTENT_CREATOR' || role === 'PROJECT_DIRECTOR') && (
          <button onClick={() => {/* Your modal open logic here */}}>
            + New Document
          </button>
        )}
      </div>

      <div className="document-list">
        {documents && documents.length > 0 ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>{doc.title} - {doc.currentStatus}</li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">No documents found</div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;