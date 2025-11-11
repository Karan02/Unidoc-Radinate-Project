'use client';
import Link from 'next/link';
export default function UnauthorizedPage() { return (
  <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center'>
    <h1 className='text-3xl font-bold text-red-600 mb-2'>Access Denied</h1>
    <p className='text-gray-600 mb-6'>You do not have permission to access this page.</p>
    <Link href='/' className='text-blue-600 underline hover:text-blue-800'>Go back</Link>
  </div>
)}
