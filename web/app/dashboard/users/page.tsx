'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiFetch } from '@/lib/api';
export default function UsersPage(){ const { token } = useAuth(); const [users,setUsers]=useState<any[]>([]);
useEffect(() => {
  async function load() {
    const res = await apiFetch('/rbac/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const d = await res.json();
      setUsers(d.users || []);
    } else {
      console.error('users load failed', res.status);
    }
  }
  if (token) load();
}, [token]);
  return (<ProtectedRoute allowedRoles={['CMIO']}><div className='p-6'><h1 className='text-2xl font-bold mb-4'>Users</h1>{users.length===0? <p className='text-gray-500'>No users found.</p> : (<div className='space-y-3'>{users.map(u=>(<div key={u.id} className='bg-white p-3 rounded border flex justify-between'><div><div className='font-semibold'>{u.email}</div><div className='text-xs text-gray-600'>Role: {u.role?.name || u.role?.role}</div></div></div>))}</div>)}</div></ProtectedRoute>);
}
