import api from './api';

export const workspaceService = {
  getAll: async () => {
    const response = await api.get('/workspaces');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/workspaces/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/workspaces', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/workspaces/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/workspaces/${id}`);
    return response.data;
  },

  inviteMember: async (workspaceId, memberData) => {
    const response = await api.post(`/workspaces/${workspaceId}/members`, memberData);
    return response.data;
  },

  removeMember: async (workspaceId, userId) => {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
    return response.data;
  },
};

export default workspaceService;
