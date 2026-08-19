export const mockWorkspaces = [
  {
    id: 1,
    name: 'Engineering Docs',
    capacityLimit: 50,
    currentDocumentCount: 12,
    ownerUsername: 'director_user',
    status: 'ACTIVE',
    memberCount: 5,
  },
  {
    id: 2,
    name: 'Product Specs',
    capacityLimit: 20,
    currentDocumentCount: 18,
    ownerUsername: 'creator_user',
    status: 'ACTIVE',
    memberCount: 3,
  },
  {
    id: 3,
    name: 'Archived Initiatives',
    capacityLimit: 100,
    currentDocumentCount: 85,
    ownerUsername: 'director_user',
    status: 'NEAR_CAPACITY',
    memberCount: 8,
  },
];

export const mockDocuments = [
  {
    id: 101,
    title: 'System Architecture v2.0',
    workspaceId: 1,
    currentStatus: 'APPROVED',
    createdByUsername: 'director_user',
    createdAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 102,
    title: 'Authentication Strategy',
    workspaceId: 1,
    currentStatus: 'IN_REVIEW',
    createdByUsername: 'creator_user',
    createdAt: '2026-08-16T14:30:00Z',
  },
  {
    id: 103,
    title: 'API Rate Limiting Spec',
    workspaceId: 2,
    currentStatus: 'DRAFT',
    createdByUsername: 'creator_user',
    createdAt: '2026-08-18T09:15:00Z',
  },
  {
    id: 104,
    title: 'Database Migration Plan',
    workspaceId: 1,
    currentStatus: 'REJECTED',
    createdByUsername: 'creator_user',
    createdAt: '2026-08-17T11:00:00Z',
  },
];

export const mockVersions = [
  {
    id: 1,
    documentId: 101,
    versionNumber: 1,
    contentDelta: '# System Architecture\nInitial draft of microservices layout.',
    commitMessage: 'Initial commit of architecture outline',
    versionStatus: 'SUPERSEDED',
    authorUsername: 'director_user',
  },
  {
    id: 2,
    documentId: 101,
    versionNumber: 2,
    contentDelta: '# System Architecture\nUpdated layout with Redis caching layer and Kafka event stream.',
    commitMessage: 'Add caching and event streaming specs',
    versionStatus: 'CURRENT',
    authorUsername: 'creator_user',
  },
];

export const mockAuditLogs = [
  {
    id: 1,
    action: 'CREATE_WORKSPACE',
    actionType: 'CREATE',
    performedByUsername: 'director_user',
    targetEntity: 'WORKSPACE',
    targetEntityId: 1,
    targetId: 1,
    description: 'Created workspace "Engineering Docs" with capacity limit 50',
    timestamp: '2026-08-15T09:00:00Z',
    performedAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 2,
    action: 'CREATE_DOCUMENT',
    actionType: 'CREATE',
    performedByUsername: 'director_user',
    targetEntity: 'DOCUMENT',
    targetEntityId: 101,
    targetId: 101,
    description: 'Created document "System Architecture v2.0"',
    timestamp: '2026-08-15T10:00:00Z',
    performedAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 3,
    action: 'SUBMIT_FOR_REVIEW',
    actionType: 'UPDATE',
    performedByUsername: 'creator_user',
    targetEntity: 'DOCUMENT',
    targetEntityId: 102,
    targetId: 102,
    description: 'Submitted "Authentication Strategy" for quality review',
    timestamp: '2026-08-16T15:00:00Z',
    performedAt: '2026-08-16T15:00:00Z',
  },
];

export default {
  mockWorkspaces,
  mockDocuments,
  mockVersions,
  mockAuditLogs,
};
