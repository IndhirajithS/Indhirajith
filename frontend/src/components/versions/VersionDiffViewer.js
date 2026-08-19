import React from 'react';
import { computeLineDiff, computeWordDelta } from '../../utils/diffCalculator';

export const VersionDiffViewer = ({ v1Content = '', v2Content = '', v1Label = 'v1', v2Label = 'v2' }) => {
  const diffData = computeLineDiff(v1Content, v2Content);
  const wordDelta = computeWordDelta(v1Content, v2Content);

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Diff Header Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Comparing {v1Label} vs {v2Label}
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Line-by-line delta comparison
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--diff-add-text)', fontWeight: 600 }}>
              +{diffData.summary.additions} additions
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-red)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--diff-del-text)', fontWeight: 600 }}>
              -{diffData.summary.deletions} deletions
            </span>
          </div>

          <div style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Word Delta: {wordDelta.formattedDelta}
          </div>
        </div>
      </div>

      {/* Code / Text Diff Box */}
      <div className="diff-container">
        {diffData.diffLines.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No differences found between versions.
          </div>
        ) : (
          diffData.diffLines.map((line, idx) => {
            const prefix = line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' ';
            return (
              <div key={idx} className={`diff-line ${line.type}`}>
                <span style={{ width: '40px', display: 'inline-block', userSelect: 'none', opacity: 0.5, fontSize: '0.75rem' }}>
                  {line.lineNoV1 || ''}
                </span>
                <span style={{ width: '40px', display: 'inline-block', userSelect: 'none', opacity: 0.5, fontSize: '0.75rem' }}>
                  {line.lineNoV2 || ''}
                </span>
                <span style={{ width: '20px', userSelect: 'none', fontWeight: 'bold' }}>{prefix}</span>
                <span>{line.content}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VersionDiffViewer;
