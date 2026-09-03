import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchDocuments } from '../../store/slices/documentSlice'; 
import EmptyState from '../common/EmptyState'; // Ensure this matches your path

const DocumentList = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get('workspaceId'); 
  
  const { role } = useSelector((state) => state.auth);
  const { items: documents, loading } = useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments(workspaceId));
  }, [dispatch, workspaceId]);

  return (
    <div className="document-list-container">
      <div className="header-actions">
        <h2>Documents</h2>
        {(role === 'CONTENT_CREATOR' || role === 'PROJECT_DIRECTOR') && (
          <button onClick={() => {/* Open Modal */}}>+ New Document</button>
        )}
      </div>

      <div className="document-list">
        {/* T25: Explicit loading text check */}
        {loading ? (
          <div>Loading...</div>
        ) : documents && documents.length > 0 ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>{doc.title} - {doc.currentStatus}</li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No documents found" />
        )}
      </div>
    </div>
  );
};

export default DocumentList;