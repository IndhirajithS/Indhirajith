import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';

export const RecentActivityList = ({ activities = [] }) => {
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        ⚡ Recent Audit Activity
      </h3>

      {activities.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          No recent activity logged.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                borderLeft: '3px solid var(--accent-blue)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {act.description}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  by <span style={{ color: 'var(--accent-purple)' }}>{act.performedByUsername}</span> • {act.targetEntity} #{act.targetId}
                </div>
              </div>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {formatRelativeTime(act.performedAt || act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivityList;
