import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import Button from '../common/Button';

export const DocumentCard = ({ document, onDelete, onSubmitForReview }) => {
  if (!document) return null;

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            <Link to={`/documents/${document.id}`} style={{ color: 'inherit' }}>
              {document.title || `Document #${document.id}`}
            </Link>
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Workspace #{document.workspaceId || 1} • Created by {document.createdByUsername || 'Author'}
          </span>
        </div>
        <StatusBadge status={document.currentStatus} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {formatDate(document.createdAt || new Date())}
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/documents/${document.id}`}>
            <Button size="sm" variant="secondary">
              View
            </Button>
          </Link>
          <Link to={`/versions/draft?docId=${document.id}`}>
            <Button size="sm" variant="blue">
              Edit Draft
            </Button>
          </Link>
          {document.currentStatus === 'DRAFT' && onSubmitForReview && (
            <Button size="sm" variant="primary" onClick={() => onSubmitForReview(document.id)}>
              Submit
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="danger" onClick={() => onDelete(document.id)}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
