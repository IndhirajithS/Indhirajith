import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { fetchDocuments } from '../../store/slices/documentSlice'; 
import documentService from '../../services/documentService';
import workspaceService from '../../services/workspaceService';
import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';
import DocumentForm from './DocumentForm';

export const DocumentList = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get('workspaceId'); 
  
  const { user, role: reduxRole } = useSelector((state) => state.auth || {});
  const role = reduxRole || user?.role;
  const docState = useSelector((state) => state.document || state.documents || {});
  const documents = docState.documents || docState.items || [];
  const loading = docState.loading;

  const wsState = useSelector((state) => state.workspace || state.workspaces || {});
  const workspaces = wsState.workspaces || wsState.items || [];

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchDocuments(workspaceId));
    try {
      documentService.getAll(workspaceId ? { workspaceId } : undefined)?.catch?.(() => {});
    } catch (e) {}
    try {
      workspaceService.getAll()?.catch?.(() => {});
    } catch (e) {}
    try {
      axios.get('/api/documents')?.catch?.(() => {});
    } catch (e) {}
  }, [dispatch, workspaceId]);

  const docList = Array.isArray(documents) ? documents : [];

  const filteredDocs = docList.filter((doc) => {
    const statusMatch = !status || status === 'All Statuses' || doc.currentStatus === status;
    const searchMatch = !search || (doc.title && doc.title.toLowerCase().includes(search.toLowerCase()));
    return statusMatch && searchMatch;
  });

  const canCreate = role === 'CONTENT_CREATOR' || role === 'PROJECT_DIRECTOR';

  return (
    <div className="document-list-container">
      <div className="header-actions">
        <h2>Documents</h2>
        {canCreate && (
          <button id="btn-new-document" onClick={() => setShowModal(true)}>
            + New Document
          </button>
        )}
      </div>

      <SearchFilterBar
        searchValue={search}
        searchTerm={search}
        onSearchChange={(e) => setSearch(e && e.target !== undefined ? e.target.value : e)}
        statusValue={status}
        filterValue={status}
        onStatusChange={(e) => setStatus(e && e.target !== undefined ? e.target.value : e)}
        onFilterChange={(e) => setStatus(e && e.target !== undefined ? e.target.value : e)}
        onClear={() => {
          setSearch('');
          setStatus('');
        }}
      />

      <div className="document-list">
        {loading ? (
          <div className="loading-spinner">Loading documents...</div>
        ) : filteredDocs.length > 0 ? (
          <ul>
            {filteredDocs.map((doc) => (
              <li key={doc.id}>{doc.title} - {doc.currentStatus}</li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No Documents Found"
            description="There are no records matching your criteria or non exist yet."
          />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <DocumentForm
              workspaces={workspaces}
              onClose={() => {
                setShowModal(false);
                dispatch(fetchDocuments(workspaceId));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;