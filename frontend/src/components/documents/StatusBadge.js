import React from 'react';

export const StatusBadge = ({ status = 'DRAFT' }) => {
  const normalizedStatus = (status || 'DRAFT').toUpperCase();

  return (
    <span className={`status-badge ${normalizedStatus}`}>
      {normalizedStatus.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
