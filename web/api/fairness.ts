import api from './client';

export type FairnessMetric = {
  id: number;
  model_name: string;
  window: string;
  subgroup: string;
  precision: number;
  recall: number;
  f1_score: number;
  delta: number;
  created_at: string;
};

export type FairnessData = {
  model_name: string;
  avg_bias: number;
  subgroups: FairnessMetric[];
};


export const fetchFairnessMetrics = async (
  model = 'AIModel-X',
  from?: string,
  to?: string
): Promise<FairnessData> => {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);

  
   


  const q = params.toString() ? `?${params.toString()}` : '';
  const res = await api.get(`/fairness/${encodeURIComponent(model)}${q}`);
  // const res = await fetch(`/fairness/${encodeURIComponent(model)}${q}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  //   },
    
  //   // body: JSON.stringify({ month: selectedMonth }),
  // });
  // const res = await api.get(`/fairness/${encodeURIComponent(model)}${q}`);
  // return res.json();
  return res.data;
};
