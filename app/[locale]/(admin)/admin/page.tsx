'use client';

import { useUser, useUserLoading } from '@/contexts/userContext';
import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/user.service';
import { UserType } from '@/types/enums';
import {
  Users,
  Shield,
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboard() {
  const { user } = useUser();
  const loading = useUserLoading();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch users data
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('🔄 Fetching users data...');
      try {
        const result = await UserService.getUsers({ page: 1, limit: 100 });
        console.log('✅ Users data fetched:', result);
        return result;
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch super admins
  const {
    data: superAdmins,
    isLoading: superAdminsLoading,
    error: superAdminsError,
  } = useQuery({
    queryKey: ['super-admins'],
    queryFn: async () => {
      console.log('🔄 Fetching super admins data...');
      try {
        const result = await UserService.getSuperAdmins();
        console.log('✅ Super admins data fetched:', result);
        return result;
      } catch (error) {
        console.error('❌ Error fetching super admins:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      console.log('🔄 Refreshing data...');
      await refetchUsers();
      console.log('✅ Data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Debug logging
  console.log('🔍 Dashboard Debug Info:', {
    user,
    usersData,
    usersLoading,
    usersError,
    superAdmins,
    superAdminsLoading,
    superAdminsError,
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center space-y-4'>
          <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            User not found
          </h1>
          <p className='text-gray-600'>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const totalUsers = usersData?.pagination?.total || 0;
  const adminUsers =
    usersData?.data?.filter((u: any) => u.role === UserType.ADMIN).length || 0;
  const superAdminUsers = superAdmins?.length || 0;
  const guestUsers =
    usersData?.data?.filter((u: any) => u.role === UserType.GUEST).length || 0;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-white'>Admin Dashboard</h1>
          <p className='text-white mt-1'>
            Welcome back, {user.name || 'Admin'}!
          </p>
        </div>
        <div className='flex space-x-2'>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className='flex items-center space-x-2 px-4 py-2 bg-slate-00 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors'
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            <span></span>
          </button>
          <button
            onClick={async () => {
              try {
                console.log('🧪 Testing API connection...');
                const response = await fetch('/api/test');
                const data = await response.json();
                console.log('✅ API Test Result:', data);
                alert(
                  `API Test: ${data.success ? 'SUCCESS' : 'FAILED'}\nMessage: ${data.message}`
                );
              } catch (error) {
                console.error('❌ API Test Error:', error);
                alert(
                  `API Test FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
              }
            }}
            className='flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
          >
            <Activity className='h-4 w-4' />
            <span>Test API</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Total Users
              </h3>
              <p className='text-3xl font-bold text-blue-600'>
                {usersLoading ? (
                  <Loader2 className='h-8 w-8 animate-spin' />
                ) : (
                  totalUsers
                )}
              </p>
            </div>
            <Users className='h-12 w-12 text-blue-500' />
          </div>
          {usersError && (
            <div className='mt-2 p-2 bg-red-50 border border-red-200 rounded'>
              <p className='text-sm text-red-600 font-medium'>
                Failed to load user count
              </p>
              <p className='text-xs text-red-500 mt-1'>
                {usersError instanceof Error
                  ? usersError.message
                  : 'Unknown error'}
              </p>
            </div>
          )}
        </div>

        <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Admins
              </h3>
              <p className='text-3xl font-bold text-green-600'>
                {usersLoading ? (
                  <Loader2 className='h-8 w-8 animate-spin' />
                ) : (
                  adminUsers
                )}
              </p>
            </div>
            <Shield className='h-12 w-12 text-green-500' />
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Super Admins
              </h3>
              <p className='text-3xl font-bold text-purple-600'>
                {superAdminsLoading ? (
                  <Loader2 className='h-8 w-8 animate-spin' />
                ) : (
                  superAdminUsers
                )}
              </p>
            </div>
            <Shield className='h-12 w-12 text-purple-500' />
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                System Status
              </h3>
              <p className='text-3xl font-bold text-yellow-600'>Online</p>
            </div>
            <Activity className='h-12 w-12 text-yellow-500' />
          </div>
        </div>
      </div>

      {/* User Role Distribution */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          User Role Distribution
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex items-center space-x-3 p-4 bg-blue-50 rounded-lg'>
            <Users className='h-8 w-8 text-blue-600' />
            <div>
              <p className='text-sm text-gray-600'>Guests</p>
              <p className='text-2xl font-bold text-blue-600'>
                {usersLoading ? (
                  <Loader2 className='h-6 w-6 animate-spin' />
                ) : (
                  guestUsers
                )}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3 p-4 bg-green-50 rounded-lg'>
            <Shield className='h-8 w-8 text-green-600' />
            <div>
              <p className='text-sm text-gray-600'>Admins</p>
              <p className='text-2xl font-bold text-green-600'>
                {usersLoading ? (
                  <Loader2 className='h-6 w-6 animate-spin' />
                ) : (
                  adminUsers
                )}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3 p-4 bg-purple-50 rounded-lg'>
            <Shield className='h-8 w-8 text-purple-600' />
            <div>
              <p className='text-sm text-gray-600'>Super Admins</p>
              <p className='text-2xl font-bold text-purple-600'>
                {superAdminsLoading ? (
                  <Loader2 className='h-6 w-6 animate-spin' />
                ) : (
                  superAdminUsers
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel - Remove in production */}
      {(usersError || superAdminsError) && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-yellow-800 mb-2'>
            Debug Information
          </h3>
          <div className='space-y-2 text-sm'>
            {usersError && (
              <div>
                <strong>Users Error:</strong>{' '}
                {usersError instanceof Error
                  ? usersError.message
                  : 'Unknown error'}
              </div>
            )}
            {superAdminsError && (
              <div>
                <strong>Super Admins Error:</strong>{' '}
                {superAdminsError instanceof Error
                  ? superAdminsError.message
                  : 'Unknown error'}
              </div>
            )}
            <div>
              <strong>API Base URL:</strong>{' '}
              {typeof window !== 'undefined'
                ? `${window.location.origin}/api`
                : 'Server-side'}
            </div>
          </div>
        </div>
      )}

      {/* Current User Information */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Your Information
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <div>
                <p className='text-sm text-gray-600'>Name</p>
                <p className='font-medium'>{user?.name || 'Not provided'}</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <div>
                <p className='text-sm text-gray-600'>Email</p>
                <p className='font-medium'>{user?.email}</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <div>
                <p className='text-sm text-gray-600'>Role</p>
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <div>
                <p className='text-sm text-gray-600'>User ID</p>
                <p className='font-medium text-sm font-mono'>{user?.id}</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <div>
                <p className='text-sm text-gray-600'>Created</p>
                <p className='font-medium'>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <div>
                <p className='text-sm text-gray-600'>Last Updated</p>
                <p className='font-medium'>
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
