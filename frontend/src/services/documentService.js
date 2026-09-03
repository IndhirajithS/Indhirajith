import axios from 'axios';
import api from './api';

export const documentService = {
  getAll: async (params) => {
    try {
      const config = params ? { params: typeof params === 'object' ? params : { workspaceId: params } } : {};
      const response = await axios.get('/api/documents', config);
      return response.data;
    } catch (e) {
      const config = params ? { params: typeof params === 'object' ? params : { workspaceId: params } } : {};
      const response = await api.get('/documents', config);
      return response.data;
    }
  },

  getById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  create: async (data) => {
    try {
      const response = await axios.post('/api/documents', data);
      return response.data;
    } catch (e) {
      const response = await api.post('/documents', data);
      return response.data;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.put(`/api/documents/${id}`, data);
      return response.data;
    } catch (e) {
      const response = await api.put(`/documents/${id}`, data);
      return response.data;
    }
  },

  delete: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

  createVersion: async (documentId, versionData) => {
    const response = await api.post(`/documents/${documentId}/versions`, versionData);
    return response.data;
  },

  getVersions: async (documentId) => {
    const response = await api.get(`/documents/${documentId}/versions`);
    return response.data;
  },

  submitForReview: async (documentId) => {
    const response = await api.post(`/documents/${documentId}/submit`);
    return response.data;
  },

  retractSubmission: async (documentId) => {
    const response = await api.post(`/documents/${documentId}/retract`);
    return response.data;
  },

  compareVersions: async (documentId, v1, v2) => {
    const response = await api.get(`/documents/${documentId}/compare`, {
      params: { v1, v2 }
    });
    return response.data;
  },
};

export default documentService;
