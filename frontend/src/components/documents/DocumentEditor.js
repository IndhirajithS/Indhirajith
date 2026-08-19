import React, { useState, useEffect } from 'react';
import { countWords } from '../../utils/diffCalculator';
import Button from '../common/Button';

export const DocumentEditor = ({
  initialContent = '',
  onSaveVersion,
  onSubmitReview,
  isSaving = false,
  readOnly = false
}) => {
  const [content, setContent] = useState(initialContent);
  const [commitMessage, setCommitMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    setWordCount(countWords(content));
  }, [content]);

  const handleSave = () => {
    if (onSaveVersion) {
      onSaveVersion(content, commitMessage || 'Updated content draft');
      setCommitMessage('');
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Editor Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Words: <strong style={{ color: 'var(--accent-blue)' }}>{wordCount}</strong>
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Lines: <strong style={{ color: 'var(--accent-purple)' }}>{content ? content.split('\n').length : 0}</strong>
          </span>
        </div>

        {!readOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onSubmitReview && (
              <Button variant="secondary" onClick={onSubmitReview}>
                Submit for Quality Evaluation
              </Button>
            )}
            <Button variant="primary" onClick={handleSave} loading={isSaving}>
              Save Version
            </Button>
          </div>
        )}
      </div>

      {/* Main Textarea */}
      <textarea
        className="form-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={readOnly}
        placeholder="Type document content draft here..."
        style={{
          width: '100%',
          minHeight: '340px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.925rem',
          lineHeight: '1.6',
          backgroundColor: '#0d1117',
          color: '#f0f6fc',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          resize: 'vertical'
        }}
      />

      {!readOnly && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Version Commit Message</label>
          <input
            type="text"
            className="form-input"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="e.g. Added section 3 security guidelines"
          />
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;
