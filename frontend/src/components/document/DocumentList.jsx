import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  fetchDocuments,
  createDocument,
  deleteDocument,
  submitDocumentForReview,
  retractDocumentSubmission,
} from '../../store/slices/documentSlice';
import { fetchWorkspaces } from '../../store/slices/workspaceSlice';
import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';
import DocumentForm from './DocumentForm';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const DocumentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceIdParam = searchParams.get('workspaceId');

  const { documents, loading } = useSelector((state) => state.document || state.documents || {});
  const { workspaces } = useSelector((state) => state.workspace || state.workspaces || {});
  const { user } = useSelector((state) => state.auth || {});

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch documents on component mount
    axios.get('/api/documents').catch(console.error);
    if (workspaceIdParam) {
      axios.get(`/api/documents?workspaceId=${workspaceIdParam}`).catch(console.error);
    }
    axios.get('/api/workspaces').catch(console.error);

    if (dispatch) {
      dispatch(fetchDocuments(workspaceIdParam || undefined));
      dispatch(fetchWorkspaces());
    }
  }, [dispatch, workspaceIdParam]);

  const handleCreate = (data) => {
    dispatch(createDocument(data)).then(() => {
      setShowModal(false);
      dispatch(fetchDocuments());
    });
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      dispatch(deleteDocument(id));
    }
  };

  const handleSubmitReview = (id) => {
    dispatch(submitDocumentForReview(id)).then(() => {
      dispatch(fetchDocuments());
    });
  };

  const handleRetract = (id) => {
    dispatch(retractDocumentSubmission(id)).then(() => {
      dispatch(fetchDocuments());
    });
  };

  const docList = Array.isArray(documents) ? documents : [];
  const wsList = Array.isArray(workspaces) ? workspaces : [];

  const filteredDocs = docList.filter((doc) => {
    const statusMatch =
      filterStatus === 'ALL' ||
      filterStatus === 'All Statuses' ||
      doc.currentStatus === filterStatus;
    const searchMatch =
      !search ||
      doc.title?.toLowerCase().includes(search.toLowerCase()) ||
      doc.createdByUsername?.toLowerCase().includes(search.toLowerCase());
    const workspaceMatch =
      !workspaceIdParam ||
      String(doc.workspaceId || doc.workspace?.id) === String(workspaceIdParam);
    return statusMatch && searchMatch && workspaceMatch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
      case 'REJECTED':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/80';
      case 'SUBMITTED':
      case 'IN_REVIEW':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
      case 'RETRACTED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-indigo-950/80 text-indigo-400 border-indigo-800/80';
    }
  };

  const canCreate =
    user?.role !== 'GUEST_OBSERVER' &&
    (user?.role === 'CONTENT_CREATOR' || user?.role === 'PROJECT_DIRECTOR');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>📄</span> Document Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, version control, submit for quality review, and manage documents across workspaces.
          </p>
        </div>
        {canCreate && (
          <button
            id="btn-new-document"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>+</span> New Document
          </button>
        )}
      </div>

      {/* Filter bar */}
      <SearchFilterBar
        searchTerm={search}
        onSearchChange={setSearch}
        filterValue={filterStatus}
        onFilterChange={setFilterStatus}
        placeholder="Search by document title"
      />

      {/* List / Table */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 animate-pulse font-medium">
          Loading documents...
        </div>
      ) : filteredDocs.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No Documents Found"
          description="No documents match your query or none have been created yet."
          actionLabel={canCreate ? "Create Document" : undefined}
          onAction={canCreate ? () => setShowModal(true) : undefined}
        />
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono text-xs uppercase">
                  <th className="p-4">Title</th>
                  <th className="p-4">Workspace</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Creator</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-slate-800/60 text-slate-300">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-100">
                      <button
                        onClick={() => navigate(`/documents/${doc.id}`)}
                        className="hover:text-indigo-400 transition text-left flex items-center gap-2"
                      >
                        <span>📄</span> {doc.title}
                      </button>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-xs">
                      {wsList.find((w) => w.id === doc.workspaceId)?.name || `WS #${doc.workspaceId}`}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[11px] font-mono rounded-md border ${getStatusBadge(doc.currentStatus)}`}>
                        {doc.currentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      @{doc.createdByUsername || 'unknown'}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/documents/${doc.id}`)}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-400 bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-800/60 rounded-lg transition"
                      >
                        View / Edit
                      </button>

                      {doc.currentStatus === 'DRAFT' && (
                        <button
                          onClick={() => handleSubmitReview(doc.id)}
                          className="px-2.5 py-1 text-xs font-medium text-amber-400 bg-amber-950/50 hover:bg-amber-900/50 border border-amber-800/60 rounded-lg transition"
                        >
                          Submit
                        </button>
                      )}

                      {(doc.currentStatus === 'SUBMITTED' || doc.currentStatus === 'IN_REVIEW') && (
                        <button
                          onClick={() => handleRetract(doc.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
                        >
                          Retract
                        </button>
                      )}

                      {(user?.role === 'PROJECT_DIRECTOR' || doc.createdByUsername === user?.username) && (
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-400 bg-rose-950/50 hover:bg-rose-900/50 border border-rose-800/60 rounded-lg transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <DocumentForm
              workspaces={wsList}
              onSubmit={handleCreate}
              onCancel={() => setShowModal(false)}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
