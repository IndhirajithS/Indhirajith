import React, { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';

export const AuditLogTable = ({ logs = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      (log.performedByUsername && log.performedByUsername.toLowerCase().includes(term)) ||
      (log.actionType && log.actionType.toLowerCase().includes(term)) ||
      (log.description && log.description.toLowerCase().includes(term)) ||
      (log.targetEntity && log.targetEntity.toLowerCase().includes(term))
    );
  });

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Audit Trail Logs
        </h3>
        <input
          type="text"
          className="form-input"
          style={{ width: '260px' }}
          placeholder="Filter logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action Type</th>
              <th>Target Entity</th>
              <th>Target ID</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>
                  No audit log records found matching query.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>#{log.id}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {formatDate(log.performedAt || log.timestamp)}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>
                      {log.performedByUsername || 'System'}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(188, 140, 255, 0.15)',
                        color: 'var(--accent-purple)',
                        border: '1px solid rgba(188, 140, 255, 0.3)'
                      }}
                    >
                      {log.actionType || log.action}
                    </span>
                  </td>
                  <td>{log.targetEntity || 'System'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {log.targetId || log.targetEntityId || '-'}
                  </td>
                  <td style={{ color: 'var(--text-primary)' }}>{log.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;
