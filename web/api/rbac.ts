import api from './client';

export type RBACUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
};

export const fetchUsers = async (): Promise<RBACUser[]> => {
  const res = await api.get('/rbac/users');
  return res.data;
};

export const createUser = async (data: {
  username: string;
  email: string;
  role: string;
  password?: string; // optional for backend that may accept it
}) => {
  const res = await api.post('/rbac/users', data);
  return res.data;
};
