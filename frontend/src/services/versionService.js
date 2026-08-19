import api from './api';

export const versionService = {
  /**
   * Save a new draft version (Consumes /api/versions or POST /api/versions/draft)
   * dto: { documentId, contentDelta, commitMessage }
   */
  async saveDraftVersion(dto) {
    try {
      const response = await api.post('/api/versions', dto);
      return response.data;
    } catch (e) {
      // Also attempt /api/versions/draft as referenced in prompt route mapping
      if (e.response && e.response.status === 404) {
        const fallbackRes = await api.post('/api/versions/draft', dto);
        return fallbackRes.data;
      }
      throw e;
    }
  },

  /**
   * Get version history by document ID (/api/versions/document/{docId})
   */
  async getVersionHistory(docId) {
    const response = await api.get(`/api/versions/document/${docId}`);
    return response.data;
  },

  /**
   * Get specific version by ID (/api/versions/{id})
   */
  async getVersionById(id) {
    const response = await api.get(`/api/versions/${id}`);
    return response.data;
  },

  /**
   * Compare two versions (/api/versions/compare?docId={docId}&v1={v1}&v2={v2})
   * or /api/versions/compare/{v1}/{v2}
   */
  async compareVersions(docId, v1, v2) {
    try {
      const response = await api.get(`/api/versions/compare?docId=${docId}&v1=${v1}&v2=${v2}`);
      return response.data;
    } catch (e) {
      // Path variable fallback format as per /api/versions/compare/{v1}/{v2}
      const fallbackRes = await api.get(`/api/versions/compare/${v1}/${v2}?docId=${docId}`);
      return fallbackRes.data;
    }
  }
};

export default versionService;
