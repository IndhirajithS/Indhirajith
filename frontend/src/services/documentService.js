import api from './api';

export const documentService = {
  /**
   * Get all documents (/api/documents)
   */
  async getAll() {
    const response = await api.get('/api/documents');
    return response.data;
  },

  /**
   * Get document by ID (/api/documents/{id})
   */
  async getById(id) {
    const response = await api.get(`/api/documents/${id}`);
    return response.data;
  },

  /**
   * Create new document (/api/documents)
   * dto: { title, workspaceId, initialContent }
   */
  async create(dto) {
    const response = await api.post('/api/documents', dto);
    return response.data;
  },

  /**
   * Update document metadata (/api/documents/{id})
   */
  async update(id, dto) {
    const response = await api.put(`/api/documents/${id}`, dto);
    return response.data;
  },

  /**
   * Delete document (/api/documents/{id})
   */
  async delete(id) {
    const response = await api.delete(`/api/documents/${id}`);
    return response.data;
  },

  /**
   * Submit document for review (/api/documents/{id}/submit)
   */
  async submitForReview(id) {
    const response = await api.post(`/api/documents/${id}/submit`);
    return response.data;
  },

  /**
   * Retract submission (/api/documents/{id}/retract)
   */
  async retractSubmission(id) {
    const response = await api.post(`/api/documents/${id}/retract`);
    return response.data;
  },

  /**
   * Get document versions (/api/documents/{id}/versions)
   */
  async getVersions(id) {
    const response = await api.get(`/api/documents/${id}/versions`);
    return response.data;
  },

  /**
   * Compare document versions (/api/documents/{id}/compare?v1={v1}&v2={v2})
   */
  async compareVersions(id, v1, v2) {
    const response = await api.get(`/api/documents/${id}/compare?v1=${v1}&v2=${v2}`);
    return response.data;
  }
};

export default documentService;
