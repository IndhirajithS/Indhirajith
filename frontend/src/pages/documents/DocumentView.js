import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import documentService from '../../services/documentService';
import versionService from '../../services/versionService';
import StatusBadge from '../../components/documents/StatusBadge';
import VersionHistoryTimeline from '../../components/versions/VersionHistoryTimeline';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { formatDate } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

export const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const [v1Select, setV1Select] = useState(null);
  const [v2Select, setV2Select] = useState(null);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const doc = await documentService.getById(id);
      setDocument(doc);

      const verList = await versionService.getVersionHistory(id).catch(() => []);
      setVersions(verList || []);

      if (verList && verList.length >= 2) {
        setV1Select(verList[verList.length - 2].versionNumber);
        setV2Select(verList[verList.length - 1].versionNumber);
      } else if (verList && verList.length === 1) {
        setV1Select(verList[0].versionNumber);
        setV2Select(verList[0].versionNumber);
      }
    } catch (err) {
      console.error('Failed to fetch document:', err);
      setToast({ message: `Could not load Document #${id} from /api/documents/${id}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDocument();
  }, [id]);

  const handleRetract = async () => {
    try {
      await documentService.retractSubmission(id);
      setToast({ message: 'Document submission retracted back to DRAFT.', type: 'info' });
      fetchDocument();
    } catch (err) {
      setToast({ message: 'Error retracting submission.', type: 'error' });
    }
  };

  const handleSubmitForReview = async () => {
    try {
      await documentService.submitForReview(id);
      setToast({ message: 'Document submitted for review!', type: 'success' });
      fetchDocument();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error submitting document.', type: 'error' });
    }
  };

  const handleCompareTrigger = () => {
    if (v1Select && v2Select) {
      navigate(`/versions/compare/${v1Select}/${v2Select}?docId=${id}`);
    }
  };

  if (loading) {
    return (
      <PageContainer title={`Document #${id}`}>
        <Loader label={`Fetching Document #${id} details...`} fullScreen />
      </PageContainer>
    );
  }

  if (!document) {
    return (
      <PageContainer title="Document Not Found">
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <h2>Document #{id} Not Found</h2>
          <Link to="/documents" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Back to Documents
          </Link>
        </div>
      </PageContainer>
    );
  }

  const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;

  return (
    <PageContainer title={document.title || `Document #${document.id}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Document Details Header */}
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {document.title}
                </h1>
                <StatusBadge status={document.currentStatus} />
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                ID: <code>#{document.id}</code> • Workspace: #{document.workspaceId} • Author: {document.createdByUsername}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/versions/draft?docId=${document.id}`}>
                <Button variant="blue">+ Edit Draft Version</Button>
              </Link>

              {document.currentStatus === 'DRAFT' && (
                <Button variant="primary" onClick={handleSubmitForReview}>
                  Submit for Review
                </Button>
              )}

              {document.currentStatus === 'UNDER_REVIEW' && (
                <Button variant="secondary" onClick={handleRetract}>
                  Retract Submission
                </Button>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', gap: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>Created: {formatDate(document.createdAt)}</span>
            <span>Total Versions Recorded: <strong>{versions.length}</strong></span>
          </div>
        </div>

        {/* Latest Version Preview */}
        {latestVersion && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Latest Content Snapshot (v{latestVersion.versionNumber})
            </h3>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                backgroundColor: '#0d1117',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                whiteSpace: 'pre-wrap',
                maxHeight: '260px',
                overflowY: 'auto'
              }}
            >
              {latestVersion.contentDelta || 'No content delta text found for this version.'}
            </div>
          </div>
        )}

        {/* Interactive Version History Timeline */}
        <VersionHistoryTimeline
          versions={versions}
          selectedV1={v1Select}
          selectedV2={v2Select}
          onSelectV1={setV1Select}
          onSelectV2={setV2Select}
          onCompare={handleCompareTrigger}
        />
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </PageContainer>
  );
};

export default DocumentView;
