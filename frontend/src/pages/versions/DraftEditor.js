import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import DocumentEditor from '../../components/documents/DocumentEditor';
import VersionHistoryTimeline from '../../components/versions/VersionHistoryTimeline';
import documentService from '../../services/documentService';
import versionService from '../../services/versionService';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';
import Button from '../../components/common/Button';

export const DraftEditor = () => {
  const [searchParams] = useSearchParams();
  const docIdParam = searchParams.get('docId');
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(docIdParam || '');
  const [activeDocument, setActiveDocument] = useState(null);
  const [draftContent, setDraftContent] = useState('');
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Load document selector list
  useEffect(() => {
    documentService.getAll().then((list) => {
      setDocuments(list || []);
      if (!selectedDocId && list && list.length > 0) {
        setSelectedDocId(list[0].id);
      }
    }).catch(console.error);
  }, []);

  // Load selected document and version history
  useEffect(() => {
    if (!selectedDocId) return;

    const loadDocData = async () => {
      setLoading(true);
      try {
        const doc = await documentService.getById(selectedDocId);
        setActiveDocument(doc);

        const verHistory = await versionService.getVersionHistory(selectedDocId).catch(() => []);
        setVersions(verHistory || []);

        if (verHistory && verHistory.length > 0) {
          const latest = verHistory[verHistory.length - 1];
          setDraftContent(latest.contentDelta || '');
        } else {
          setDraftContent('');
        }
      } catch (err) {
        console.error('Error loading draft editor data:', err);
        setToast({ message: `Could not load Document #${selectedDocId}`, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadDocData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocId]);

  const handleSaveVersion = async (content, commitMessage) => {
    if (!selectedDocId) {
      setToast({ message: 'Please select a target document first.', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const newVersion = await versionService.saveDraftVersion({
        documentId: Number(selectedDocId),
        contentDelta: content,
        commitMessage: commitMessage || 'Saved version draft'
      });

      setVersions((prev) => [...prev, newVersion]);
      setToast({ message: `Version v${newVersion.versionNumber} saved successfully to /api/versions!`, type: 'success' });
    } catch (err) {
      console.error('Save version failed:', err);
      setToast({ message: err.response?.data?.message || 'Failed to save version draft.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedDocId) return;
    try {
      await documentService.submitForReview(selectedDocId);
      setToast({ message: 'Draft submitted for quality review evaluation loop!', type: 'success' });
      if (activeDocument) {
        setActiveDocument({ ...activeDocument, currentStatus: 'UNDER_REVIEW' });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Submission failed.', type: 'error' });
    }
  };

  return (
    <PageContainer title="Draft Editor Workstation">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header & Document Switcher */}
        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Draft Version Editor
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Consumes <code>/api/versions</code> for saving drafts and logging version history
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label className="form-label" style={{ margin: 0 }}>Select Document:</label>
            <select
              className="form-select"
              style={{ width: '240px' }}
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
            >
              <option value="">-- Choose Document --</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.id} - {d.title}
                </option>
              ))}
            </select>

            {selectedDocId && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/versions/compare/1/2?docId=${selectedDocId}`)}
              >
                🔍 Compare Diffs
              </Button>
            )}
          </div>
        </div>

        {/* Main Workstation View */}
        {loading ? (
          <Loader label="Loading active draft content..." />
        ) : !selectedDocId ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <h3>No Document Selected</h3>
            <p style={{ marginTop: '8px' }}>Select a document from the dropdown above to edit and save draft versions.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
            {/* Left: Interactive Rich Draft Editor */}
            <DocumentEditor
              initialContent={draftContent}
              onSaveVersion={handleSaveVersion}
              onSubmitReview={handleSubmitReview}
              isSaving={saving}
              readOnly={activeDocument?.currentStatus === 'UNDER_REVIEW'}
            />

            {/* Right: Version History Drawer */}
            <VersionHistoryTimeline versions={versions} />
          </div>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </PageContainer>
  );
};

export default DraftEditor;
