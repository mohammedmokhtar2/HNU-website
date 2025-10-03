'use client';

import { useUser, useUserLoading } from '@/contexts/userContext';
import { useQuery } from '@tanstack/react-query';
import { UserType } from '@/types/enums';
import {
  Users,
  Shield,
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Building2,
  BookOpen,
  Mail,
  FolderOpen,
  BarChart3,
  TrendingUp,
  Clock,
  Globe,
  Settings,
  FileText,
  Database,
  ClipboardList,
  Eye,
  Calendar,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Star,
  Zap,
  Target,
  Layers,
  PieChart,
  LineChart,
  BarChart,
  Users2,
  GraduationCap,
  School,
  MessageSquare,
  FileImage,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { user } = useUser();
  const loading = useUserLoading();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch comprehensive dashboard data
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ['admin-dashboard', user?.role],
    queryFn: async () => {
      console.log('🔄 Fetching dashboard data...');
      try {
        const response = await fetch(
          `/api/admin/dashboard?role=${user?.role || 'GUEST'}`
        );
        const result = await response.json();
        console.log('✅ Dashboard data fetched:', result);
        return result;
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      console.log('🔄 Refreshing dashboard data...');
      await refetchDashboard();
      console.log('✅ Dashboard data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

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

  const dashboard = dashboardData?.data || {};
  const statistics = dashboard.statistics || {};
  const detailedStats = dashboard.detailedStats || {};
  const recentActivity = dashboard.recentActivity || [];
  const systemHealth = dashboard.systemHealth || {};
  const quickActions = dashboard.quickActions || [];

  // Extract key statistics
  const totalUsers = statistics.totalUsers || 0;
  const totalColleges = statistics.totalColleges || 0;
  const totalPrograms = statistics.totalPrograms || 0;
  const totalBlogs = statistics.totalBlogs || 0;
  const totalMessages = statistics.totalMessages || 0;
  const totalAuditLogs = statistics.totalAuditLogs || 0;

  // Icon mapping for quick actions
  const iconMap: Record<string, any> = {
    Building2,
    School,
    GraduationCap,
    BookOpen,
    MessageSquare,
    Users2,
    BarChart3,
    ClipboardList,
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl font-bold text-white'>Admin Dashboard</h1>
          <p className='text-gray-300 mt-2'>
            Welcome back, {user.name || 'Admin'}! Here's your system overview.
          </p>
        </div>
        <div className='flex space-x-3'>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant='outline'
            className='bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button
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
            className='bg-green-600 hover:bg-green-700'
          >
            <Activity className='h-4 w-4 mr-2' />
            Test API
          </Button>
        </div>
      </div>

      {/* System Overview Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardLoading ? (
                <Loader2 className='h-6 w-6 animate-spin' />
              ) : (
                totalUsers.toLocaleString()
              )}
            </div>
            <p className='text-xs text-blue-100'>
              System administrators and guests
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-green-500 to-green-600 border-0 text-white'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Colleges</CardTitle>
            <School className='h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardLoading ? (
                <Loader2 className='h-6 w-6 animate-spin' />
              ) : (
                totalColleges.toLocaleString()
              )}
            </div>
            <p className='text-xs text-green-100'>Active college departments</p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Programs</CardTitle>
            <GraduationCap className='h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardLoading ? (
                <Loader2 className='h-6 w-6 animate-spin' />
              ) : (
                totalPrograms.toLocaleString()
              )}
            </div>
            <p className='text-xs text-purple-100'>Academic programs offered</p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Blog Posts</CardTitle>
            <BookOpen className='h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardLoading ? (
                <Loader2 className='h-6 w-6 animate-spin' />
              ) : (
                totalBlogs.toLocaleString()
              )}
            </div>
            <p className='text-xs text-orange-100'>
              Published articles and news
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className='bg-gray-900 border-gray-800'>
        <CardHeader>
          <CardTitle className='text-white flex items-center'>
            <Zap className='h-5 w-5 mr-2 text-yellow-500' />
            Quick Actions
          </CardTitle>
          <CardDescription className='text-gray-400'>
            Access the most commonly used admin functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {dashboardLoading ? (
              <div className='col-span-full flex justify-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
              </div>
            ) : quickActions.length > 0 ? (
              quickActions.map((action: any, index: number) => {
                const Icon = iconMap[action.icon] || Building2;
                return (
                  <Link key={action.id || index} href={action.href}>
                    <Card className='bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer group'>
                      <CardContent className='p-4'>
                        <div className='flex items-center space-x-3'>
                          <div
                            className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
                          >
                            <Icon className='h-5 w-5 text-white' />
                          </div>
                          <div className='flex-1'>
                            <h3 className='font-medium text-white group-hover:text-blue-400 transition-colors'>
                              {action.title}
                            </h3>
                            <p className='text-sm text-gray-400'>
                              {action.description}
                            </p>
                          </div>
                          <ArrowRight className='h-4 w-4 text-gray-500 group-hover:text-white transition-colors' />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className='col-span-full text-center py-8'>
                <p className='text-gray-400'>
                  No actions available for your role
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Status & Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* System Status */}
        <Card className='bg-gray-900 border-gray-800'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <Activity className='h-5 w-5 mr-2 text-green-500' />
              System Status
            </CardTitle>
            <CardDescription className='text-gray-400'>
              Current system health and performance
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                <span className='text-white font-medium'>API Status</span>
              </div>
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800'
              >
                Online
              </Badge>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Database className='h-4 w-4 text-blue-500' />
                <span className='text-white font-medium'>Database</span>
              </div>
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800'
              >
                Connected
              </Badge>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Mail className='h-4 w-4 text-purple-500' />
                <span className='text-white font-medium'>Email Service</span>
              </div>
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800'
              >
                Active
              </Badge>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <FileImage className='h-4 w-4 text-orange-500' />
                <span className='text-white font-medium'>File Storage</span>
              </div>
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800'
              >
                Available
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className='bg-gray-900 border-gray-800'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <Clock className='h-5 w-5 mr-2 text-blue-500' />
              Recent Activity
            </CardTitle>
            <CardDescription className='text-gray-400'>
              Latest system actions and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {dashboardLoading ? (
                <div className='space-y-2'>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className='flex items-center space-x-3'>
                      <Skeleton className='h-8 w-8 rounded-full' />
                      <div className='space-y-1 flex-1'>
                        <Skeleton className='h-4 w-3/4' />
                        <Skeleton className='h-3 w-1/2' />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity
                  .slice(0, 3)
                  .map((activity: any, index: number) => (
                    <div
                      key={index}
                      className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors'
                    >
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback className='bg-blue-500 text-white text-xs'>
                          {activity.clerkUser?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-white truncate'>
                          {activity.clerkUser?.name || 'Unknown User'}{' '}
                          {activity.action.toLowerCase()} {activity.entity}
                        </p>
                        <p className='text-xs text-gray-400'>
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant='outline' className='text-xs'>
                        {activity.action}
                      </Badge>
                    </div>
                  ))
              ) : (
                <div className='text-center py-4'>
                  <Clock className='h-8 w-8 text-gray-500 mx-auto mb-2' />
                  <p className='text-gray-400 text-sm'>No recent activity</p>
                </div>
              )}
            </div>
            {recentActivity.length > 5 && (
              <div className='mt-4 pt-4 border-t border-gray-800'>
                <Link href='/admin/system/logs'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                  >
                    View All Activity
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='bg-gray-900 border-gray-800'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <MessageSquare className='h-5 w-5 mr-2 text-red-500' />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white mb-2'>
              {dashboardLoading ? (
                <Loader2 className='h-6 w-6 animate-spin' />
              ) : (
                totalMessages.toLocaleString()
              )}
            </div>
            <p className='text-sm text-gray-400'>Total messages sent</p>
            <Link href='/admin/system/messages'>
              <Button
                variant='outline'
                size='sm'
                className='mt-3 bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              >
                Manage Messages
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='bg-gray-900 border-gray-800'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <ClipboardList className='h-5 w-5 mr-2 text-gray-500' />
              Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white mb-2'>
              {dashboardLoading ? (
                <Loader2 className='h-6 w-6 animate-spin' />
              ) : (
                totalAuditLogs.toLocaleString()
              )}
            </div>
            <p className='text-sm text-gray-400'>System activity records</p>
            <Link href='/admin/system/logs'>
              <Button
                variant='outline'
                size='sm'
                className='mt-3 bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              >
                View Logs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='bg-gray-900 border-gray-800'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <BarChart3 className='h-5 w-5 mr-2 text-teal-500' />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white mb-2'>
              <TrendingUp className='h-6 w-6 inline mr-1' />
              Live
            </div>
            <p className='text-sm text-gray-400'>Real-time system metrics</p>
            <Link href='/admin/system/analysis'>
              <Button
                variant='outline'
                size='sm'
                className='mt-3 bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              >
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* User Information */}
      <Card className='bg-gray-900 border-gray-800'>
        <CardHeader>
          <CardTitle className='text-white flex items-center'>
            <Users className='h-5 w-5 mr-2 text-blue-500' />
            Your Profile
          </CardTitle>
          <CardDescription className='text-gray-400'>
            Current user information and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <CheckCircle className='h-5 w-5 text-green-500' />
                <div>
                  <p className='text-sm text-gray-400'>Name</p>
                  <p className='font-medium text-white'>
                    {user?.name || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <CheckCircle className='h-5 w-5 text-green-500' />
                <div>
                  <p className='text-sm text-gray-400'>Email</p>
                  <p className='font-medium text-white'>{user?.email}</p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <CheckCircle className='h-5 w-5 text-green-500' />
                <div>
                  <p className='text-sm text-gray-400'>Role</p>
                  <Badge
                    variant='secondary'
                    className='bg-blue-100 text-blue-800'
                  >
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <CheckCircle className='h-5 w-5 text-green-500' />
                <div>
                  <p className='text-sm text-gray-400'>User ID</p>
                  <p className='font-medium text-white text-sm font-mono'>
                    {user?.id}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <CheckCircle className='h-5 w-5 text-green-500' />
                <div>
                  <p className='text-sm text-gray-400'>Created</p>
                  <p className='font-medium text-white'>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <CheckCircle className='h-5 w-5 text-green-500' />
                <div>
                  <p className='text-sm text-gray-400'>Last Updated</p>
                  <p className='font-medium text-white'>
                    {user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
