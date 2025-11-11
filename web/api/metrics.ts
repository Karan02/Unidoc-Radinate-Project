import api from './client';

export const fetchMetrics = async (model = 'AIModel-X') => {
  const res = await api.get(`/models/${encodeURIComponent(model)}/metrics?from=2025-10-01&to=2025-11-30`);
  return res.data;
};
