import api from './client';

export type AlertResponse = {
  count: number;
  alerts: Alert[];
};

export type Alert = {
  id: number;
  type: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  created_at: string;
  ack_by?: string | null;
};

export const fetchAlerts = async (): Promise<AlertResponse> => {
  const res = await api.get('/alerts');
  return res.data;
};

export const sendTestAlert = async () => {
  const res = await api.post('/alerts/test');
  return res.data;
};
