import api from './client';

export type DriftSignal = {
  id: number;
  model_name: string;
  feature: string;
  method: string;
  p_value: number;
  diff: number;
  status: 'drifted' | 'stable' | 'warning';
  window: string;
};

export const fetchDriftSignals = async (
  model = 'AIModel-X',
  from?: string,
  to?: string
): Promise<DriftSignal[]> => {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);

  const q = params.toString() ? `?${params.toString()}` : '';
  const res = await api.get(`/models/${encodeURIComponent(model)}/drift${q}`);
  return res.data;
};
