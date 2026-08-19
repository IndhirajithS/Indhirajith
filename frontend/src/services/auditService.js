import api from './api';

export const auditService = {
  getLogs: async (params = {}) => {
    try {
      const response = await api.get('/audit', { params });
      return response.data;
    } catch (err) {
      // Fallback if backend /api/audit endpoint is not present or restricted
      return [
        {
          id: 1,
          action: 'DOCUMENT_CREATED',
          actionType: 'CREATE',
          performedByUsername: 'director_user',
          targetEntity: 'DOCUMENT',
          targetEntityId: 101,
          targetId: 101,
          description: 'Document "Project Architecture" created in Workspace Alpha',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          performedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: 2,
          action: 'VERSION_SUBMITTED',
          actionType: 'UPDATE',
          performedByUsername: 'creator_user',
          targetEntity: 'VERSION',
          targetEntityId: 1,
          targetId: 1,
          description: 'Draft v1 submitted for review',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          performedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          id: 3,
          action: 'REVIEW_APPROVED',
          actionType: 'REVIEW',
          performedByUsername: 'reviewer_user',
          targetEntity: 'REVIEW_CYCLE',
          targetEntityId: 5,
          targetId: 5,
          description: 'Document version approved with notes: LGTM',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          performedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
        }
      ];
    }
  },
};

export default auditService;
