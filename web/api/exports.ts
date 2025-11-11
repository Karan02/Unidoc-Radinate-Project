import api from './client';

export const generateMonthlyPack = async (): Promise<Blob> => {
  const res = await api.post('/exports/monthly-pack', {}, { responseType: 'blob' });
  return res.data;
};
