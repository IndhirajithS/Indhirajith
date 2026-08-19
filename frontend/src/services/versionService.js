import api from './api';

export const versionService = {
  create: async (versionData) => {
    const response = await api.post('/versions', versionData);
    return response.data;
  },

  getHistory: async (docId) => {
    const response = await api.get(`/versions/document/${docId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/versions/${id}`);
    return response.data;
  },

  compare: async (docId, v1, v2) => {
    const response = await api.get('/versions/compare', {
      params: { docId, v1, v2 }
    });
    return response.data;
  },
};

export default versionService;
