import api from './client';

export type ModelSummary = {
  id: string;
  name: string;
  version: string;
  last_run?: string;
  precision?: number;
  recall?: number;
  f1_score?: number;
  health?: 'healthy' | 'warning' | 'critical';
};

export const fetchModels = async (): Promise<ModelSummary[]> => {
  const res = await api.get('/models');
  return res.data;
};
