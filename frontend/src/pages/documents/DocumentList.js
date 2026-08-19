import React, { useEffect, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import documentService from '../../services/documentService';
import DocumentCard from '../../components/documents/DocumentCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

export const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for New Document
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [workspaceId, setWorkspaceId] = useState(1);
  const [initialContent, setInitialContent] = useState('');
  const [creating, setCreating] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await documentService.getAll();
      setDocuments(data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
      setToast({ message: 'Failed to connect to /api/documents server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setToast({ message: 'Document title is required.', type: 'error' });
      return;
    }

    setCreating(true);
    try {
      const created = await documentService.create({
        title: newTitle,
        workspaceId: Number(workspaceId) || 1,
        initialContent: initialContent || 'Document draft initialized.'
      });
      setToast({ message: `Document "${created.title}" created successfully!`, type: 'success' });
      setIsModalOpen(false);
      setNewTitle('');
      setInitialContent('');
      fetchDocs();
    } catch (err) {
      console.error('Document creation failed:', err);
      setToast({ message: err.response?.data?.message || 'Failed to create document.', type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Document #${id}?`)) return;
    try {
      await documentService.delete(id);
      setToast({ message: `Document #${id} deleted.`, type: 'info' });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setToast({ message: 'Error deleting document.', type: 'error' });
    }
  };

  const handleSubmitForReview = async (id) => {
    try {
      await documentService.submitForReview(id);
      setToast({ message: `Document #${id} submitted for quality review loop!`, type: 'success' });
      fetchDocs();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to submit document.', type: 'error' });
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesFilter = activeFilter === 'ALL' || doc.currentStatus === activeFilter;
    const matchesSearch =
      (doc.title && doc.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(doc.id).includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <PageContainer title="Document Repository">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Document Workspaces
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Consumes <code>/api/documents</code> endpoint
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Create New Document
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((filter) => (
              <button
                key={filter}
                className={`btn ${activeFilter === filter ? 'btn-blue' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="form-input"
            style={{ width: '260px' }}
            placeholder="Search documents by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Documents Grid */}
        {loading ? (
          <Loader label="Loading documents from backend..." />
        ) : filteredDocuments.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <h3>No documents found</h3>
            <p style={{ marginTop: '8px' }}>Try adjusting search filters or create a new document.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={handleDeleteDocument}
                onSubmitForReview={handleSubmitForReview}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating New Document */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Document"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateDocument} loading={creating}>
              Create Document
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateDocument}>
          <div className="form-group">
            <label className="form-label">Document Title *</label>
            <input
              type="text"
              className="form-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. System Security Spec 2026"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Workspace ID</label>
            <input
              type="number"
              className="form-input"
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Draft Content</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={initialContent}
              onChange={(e) => setInitialContent(e.target.value)}
              placeholder="Write the initial text overview..."
            />
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </PageContainer>
  );
};

export default DocumentList;
