import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import Button from '../common/Button';

export const VersionHistoryTimeline = ({
  versions = [],
  selectedV1,
  selectedV2,
  onSelectV1,
  onSelectV2,
  onCompare
}) => {
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Version History Timeline
        </h3>
        {onCompare && (
          <Button
            variant="blue"
            size="sm"
            onClick={onCompare}
            disabled={!selectedV1 || !selectedV2 || selectedV1 === selectedV2}
          >
            Compare Selected ({selectedV1 || '?'} vs {selectedV2 || '?'})
          </Button>
        )}
      </div>

      {versions.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No version history recorded yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          {versions.map((ver) => {
            const isV1 = selectedV1 === ver.versionNumber;
            const isV2 = selectedV2 === ver.versionNumber;

            return (
              <div
                key={ver.id || ver.versionNumber}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  backgroundColor: isV1 || isV2 ? 'rgba(88, 166, 255, 0.1)' : 'var(--bg-tertiary)',
                  border: isV1 || isV2 ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid var(--accent-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'var(--accent-purple)'
                  }}
                >
                  v{ver.versionNumber}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ver.commitMessage || 'Draft submission'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDate(ver.createdAt || new Date())}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Author: <strong style={{ color: 'var(--text-primary)' }}>{ver.authorUsername || 'Creator'}</strong></span>
                    <span>Status: <strong style={{ color: 'var(--accent-blue)' }}>{ver.versionStatus || 'DRAFT'}</strong></span>
                  </div>
                </div>

                {onSelectV1 && onSelectV2 && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      className={`btn ${isV1 ? 'btn-blue' : 'btn-secondary'}`}
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      onClick={() => onSelectV1(ver.versionNumber)}
                    >
                      v1
                    </button>
                    <button
                      className={`btn ${isV2 ? 'btn-blue' : 'btn-secondary'}`}
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      onClick={() => onSelectV2(ver.versionNumber)}
                    >
                      v2
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VersionHistoryTimeline;
