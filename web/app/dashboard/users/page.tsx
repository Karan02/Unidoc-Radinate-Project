// 'use client';
// import { useEffect, useState } from 'react';
// import { useAuth } from '@/context/AuthContext';

// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { apiFetch } from '@/lib/api';
// export default function UsersPage(){ const { token } = useAuth(); const [users,setUsers]=useState<any[]>([]);
// useEffect(() => {
//   async function load() {
//     const res = await apiFetch('/rbac/users', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (res.ok) {
//       const d = await res.json();
//       setUsers(d.users || []);
//     } else {
//       console.error('users load failed', res.status);
//     }
//   }
//   if (token) load();
// }, [token]);
//   return (<ProtectedRoute allowedRoles={['CMIO']}><div className='p-6'><h1 className='text-2xl font-bold mb-4'>Users</h1>{users.length===0? <p className='text-gray-500'>No users found.</p> : (<div className='space-y-3'>{users.map(u=>(<div key={u.id} className='bg-white p-3 rounded border flex justify-between'><div><div className='font-semibold'>{u.email}</div><div className='text-xs text-gray-600'>Role: {u.role?.name || u.role?.role}</div></div></div>))}</div>)}</div></ProtectedRoute>);
// }
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {ProtectedRoute} from '@/components/ProtectedRoute';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  role: { name: string };
  created_at: string;
}

export default function UsersPage() {
  const { token, user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // ✅ Fetch roles and users
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [rolesRes, usersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/rbac/roles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/rbac/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const rolesData = await rolesRes.json();
        const usersData = await usersRes.json();
        setRoles(rolesData.roles || []);
        setUsers(usersData.users || []);
      } catch (err) {
        console.error('Error fetching RBAC data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ✅ Create a new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !roleId) {
      setMessage('Email and role are required.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rbac/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role_id: roleId }),
      });

      const data = await res.json();
      if (data.success) {
        setUsers([...users, data.user]);
        setEmail('');
        setRoleId(null);
        setMessage('✅ User created successfully!');
      } else {
        setMessage(data.message || 'Error creating user');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error creating user.');
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  // ✅ CMIO-only restriction
  if (user?.role.toLowerCase() !== 'cmio') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Access denied. Only CMIO can manage users.
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['CMIO']}>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">👥 User Management</h1>
          <p className="text-gray-600 mb-6">
            Add, view, and manage system users and their roles.
          </p>

          {/* Create User Form */}
          <form
            onSubmit={handleCreateUser}
            className="flex flex-col md:flex-row gap-4 items-center mb-8"
          >
            <input
              type="email"
              placeholder="User Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={roleId || ''}
              onChange={(e) => setRoleId(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/3"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Add User
            </button>
          </form>

          {message && <p className="text-sm text-gray-700 mb-4">{message}</p>}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 capitalize">{u.role?.name || '—'}</td>
                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
