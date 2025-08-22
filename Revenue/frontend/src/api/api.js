import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
});

export const expensesApi = {
  list: () => api.get('/api/expenses'),
  create: (payload, file) => {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => form.append(k, v));
    if (file) form.append('receipt', file);
    return api.post('/api/expenses', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  approve: (id) => api.post(`/api/expenses/${id}/approve`),
  remove: (id) => api.delete(`/api/expenses/${id}`),
  insights: (monthlyLimit) => api.get('/api/predict/expenses/insights', { params: { monthlyLimit } })
};

export const revenueApi = {
  list: (params) => api.get('/api/revenue', { params }),
  create: (payload) => api.post('/api/revenue', payload),
  analytics: (period) => api.get('/api/predict/revenue/analytics', { params: { period } }),
  update: (id, payload) => api.put(`/api/revenue/${id}`, payload),
  remove: (id) => api.delete(`/api/revenue/${id}`)
};

export const predictionApi = {
  revenue: ({ history, horizon }) => api.post('/api/predict/revenue', { history, horizon }),
  suggestCategory: (description) => api.post('/api/predict/category', { description }),
  insight: ({ expenses, monthlyLimit }) => api.post('/api/predict/expenses/insight', { expenses, monthlyLimit }),
  dashboard: () => api.get('/api/predict/dashboard'),
  modelMetrics: () => api.get('/api/predict/model/metrics')
};

export default api;
