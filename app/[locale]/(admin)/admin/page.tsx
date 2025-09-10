'use client';

import { useUser, useUserLoading } from '@/contexts/userContext';

export default function AdminDashboard() {
  const { user } = useUser();
  const loading = useUserLoading();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            User not found
          </h1>
          <p className='text-gray-600'>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-white dark:text-gray-900'>
          Admin Dashboard
        </h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Total Users
          </h3>
          {/* TODO: Add total users */}
          <p className='text-3xl font-bold text-blue-600'>
            {/* TODO: Add total users */}
            {1}
          </p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Active Sessions
          </h3>
          {/* TODO: Add active sessions */}
          <p className='text-3xl font-bold text-green-600'>1</p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            System Status
          </h3>
          {/* TODO: Add system status */}
          <p className='text-3xl font-bold text-yellow-600'>Online</p>
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          User Information
        </h2>
        <div className='space-y-2'>
          <p>
            <strong>Name:</strong> {user?.name || 'Not provided'}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>User ID:</strong> {user?.id}
          </p>
          <p>
            <strong>User Type:</strong> {user?.role}
          </p>
          <p>
            <strong>Created:</strong>{' '}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
