'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export const ProtectedRoute = ({ allowedRoles, children }: { allowedRoles?: string[]; children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    if (!token || !user) { router.replace('/login'); return; }
    if (allowedRoles && !allowedRoles.includes(user.role)) { router.replace('/unauthorized'); return; }
    setAuthorized(true);
  }, [user, token, allowedRoles, router]);
  if (!authorized) return <div className='text-center mt-20 text-gray-500'>Checking access...</div>;
  return <>{children}</>;
};
