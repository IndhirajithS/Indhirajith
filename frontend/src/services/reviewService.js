import api from './api';

export const reviewService = {
  submitDecision: async (reviewCycleId, decisionData) => {
    const response = await api.put(`/reviews/${reviewCycleId}/decision`, decisionData);
    return response.data;
  },
};

export default reviewService;
