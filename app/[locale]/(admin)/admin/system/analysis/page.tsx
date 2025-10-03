'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import {
  Bar,
  Line,
  Doughnut,
  Pie,
  PolarArea,
  Radar,
  Bubble,
} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ChartDataLabels,
  annotationPlugin
);

import {
  Users,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  TrendingUp,
  Clock,
  MapPin,
  RefreshCw,
  Calendar,
  Eye,
  Activity,
  BarChart3,
  PieChart,
  Building,
  BookOpen,
  FileText,
  MessageSquare,
  Shield,
  Settings,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  Zap,
  Layers,
  Grid,
  List,
  MoreHorizontal,
} from 'lucide-react';

// Chart data preparation functions
const prepareChartData = (analytics: AnalyticsData) => {
  // College Types Distribution
  const collegeTypesData = {
    labels: analytics.distributions.collegeTypes.map(item => item.type),
    datasets: [
      {
        data: analytics.distributions.collegeTypes.map(item => item.count),
        backgroundColor: COLORS.slice(
          0,
          analytics.distributions.collegeTypes.length
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // User Roles Distribution
  const userRolesData = {
    labels: analytics.distributions.userRoles.map(item => item.role),
    datasets: [
      {
        data: analytics.distributions.userRoles.map(item => item.count),
        backgroundColor: COLORS.slice(
          0,
          analytics.distributions.userRoles.length
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Section Types Distribution
  const sectionTypesData = {
    labels: analytics.distributions.sectionTypes.map(item => item.type),
    datasets: [
      {
        data: analytics.distributions.sectionTypes.map(item => item.count),
        backgroundColor: COLORS.slice(
          0,
          analytics.distributions.sectionTypes.length
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Top Colleges by Programs
  const topCollegesData = {
    labels: analytics.topPerformers.collegesByPrograms.map(item =>
      typeof item.name === 'object'
        ? item.name.en || item.name.ar || 'Unknown'
        : item.name
    ),
    datasets: [
      {
        label: 'Programs',
        data: analytics.topPerformers.collegesByPrograms.map(
          item => item.count
        ),
        backgroundColor: 'rgba(136, 132, 216, 0.8)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Top Universities by Colleges
  const topUniversitiesData = {
    labels: analytics.topPerformers.universitiesByColleges.map(item =>
      typeof item.name === 'object'
        ? item.name.en || item.name.ar || 'Unknown'
        : item.name
    ),
    datasets: [
      {
        label: 'Colleges',
        data: analytics.topPerformers.universitiesByColleges.map(
          item => item.count
        ),
        backgroundColor: 'rgba(130, 202, 157, 0.8)',
        borderColor: 'rgba(130, 202, 157, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Blog Publishing Trends
  const blogTrendsData = {
    labels: analytics.trends.blogPublishing.map(item =>
      new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'Blogs Published',
        data: analytics.trends.blogPublishing.map(item => item.count),
        backgroundColor: 'rgba(255, 187, 40, 0.2)',
        borderColor: 'rgba(255, 187, 40, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // User Registration Trends
  const userTrendsData = {
    labels: analytics.trends.userRegistration.map(item =>
      new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'New Users',
        data: analytics.trends.userRegistration.map(item => item.count),
        backgroundColor: 'rgba(0, 136, 254, 0.2)',
        borderColor: 'rgba(0, 136, 254, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // College Creation Trends
  const collegeTrendsData = {
    labels: analytics.trends.collegeCreation.map(item =>
      new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'New Colleges',
        data: analytics.trends.collegeCreation.map(item => item.count),
        backgroundColor: 'rgba(0, 196, 159, 0.2)',
        borderColor: 'rgba(0, 196, 159, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Program Creation Trends
  const programTrendsData = {
    labels: analytics.trends.programCreation.map(item =>
      new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'New Programs',
        data: analytics.trends.programCreation.map(item => item.count),
        backgroundColor: 'rgba(255, 128, 66, 0.2)',
        borderColor: 'rgba(255, 128, 66, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Multi-line chart for all trends
  const multiTrendsData = {
    labels: analytics.trends.userRegistration.map(item =>
      new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'Users',
        data: analytics.trends.userRegistration.map(item => item.count),
        borderColor: 'rgba(0, 136, 254, 1)',
        backgroundColor: 'rgba(0, 136, 254, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Colleges',
        data: analytics.trends.collegeCreation.map(item => item.count),
        borderColor: 'rgba(0, 196, 159, 1)',
        backgroundColor: 'rgba(0, 196, 159, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Programs',
        data: analytics.trends.programCreation.map(item => item.count),
        borderColor: 'rgba(255, 128, 66, 1)',
        backgroundColor: 'rgba(255, 128, 66, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Blogs',
        data: analytics.trends.blogPublishing.map(item => item.count),
        borderColor: 'rgba(255, 187, 40, 1)',
        backgroundColor: 'rgba(255, 187, 40, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Blog Tags Distribution
  const blogTagsData = {
    labels: analytics.distributions.blogTags.slice(0, 10).map(item => item.tag),
    datasets: [
      {
        data: analytics.distributions.blogTags
          .slice(0, 10)
          .map(item => item.count),
        backgroundColor: COLORS.slice(0, 10),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Actions Distribution
  const actionsData = {
    labels: analytics.distributions.actions.map(item => item.action),
    datasets: [
      {
        data: analytics.distributions.actions.map(item => item.count),
        backgroundColor: COLORS.slice(
          0,
          analytics.distributions.actions.length
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Message Analytics Charts
  const messageStatusData = {
    labels: analytics.messageAnalytics.statusDistribution.map(
      item => item.status
    ),
    datasets: [
      {
        data: analytics.messageAnalytics.statusDistribution.map(
          item => item.count
        ),
        backgroundColor: [
          '#4CAF50',
          '#FF9800',
          '#F44336',
          '#2196F3',
          '#9C27B0',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const messagePriorityData = {
    labels: analytics.messageAnalytics.priorityDistribution.map(
      item => item.priority
    ),
    datasets: [
      {
        data: analytics.messageAnalytics.priorityDistribution.map(
          item => item.count
        ),
        backgroundColor: ['#FF5722', '#FF9800', '#4CAF50', '#2196F3'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const messageTypeData = {
    labels: analytics.messageAnalytics.typeDistribution.map(item => item.type),
    datasets: [
      {
        data: analytics.messageAnalytics.typeDistribution.map(
          item => item.count
        ),
        backgroundColor: COLORS.slice(
          0,
          analytics.messageAnalytics.typeDistribution.length
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const messageTrendsData = {
    labels: analytics.messageAnalytics.dailyTrends.map(item =>
      new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'Messages Sent',
        data: analytics.messageAnalytics.dailyTrends.map(item => item.count),
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const hourlyMessageData = {
    labels: analytics.messageAnalytics.hourlyDistribution.map(
      item => `${item.hour}:00`
    ),
    datasets: [
      {
        label: 'Messages per Hour',
        data: analytics.messageAnalytics.hourlyDistribution.map(
          item => item.count
        ),
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const topSendersData = {
    labels: analytics.messageAnalytics.topSenders.map(item => item.email),
    datasets: [
      {
        label: 'Messages Sent',
        data: analytics.messageAnalytics.topSenders.map(item => item.count),
        backgroundColor: 'rgba(156, 39, 176, 0.8)',
        borderColor: 'rgba(156, 39, 176, 1)',
        borderWidth: 1,
      },
    ],
  };

  return {
    collegeTypesData,
    userRolesData,
    sectionTypesData,
    topCollegesData,
    topUniversitiesData,
    blogTrendsData,
    userTrendsData,
    collegeTrendsData,
    programTrendsData,
    multiTrendsData,
    blogTagsData,
    actionsData,
    messageStatusData,
    messagePriorityData,
    messageTypeData,
    messageTrendsData,
    hourlyMessageData,
    topSendersData,
  };
};

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalUniversities: number;
    totalColleges: number;
    totalPrograms: number;
    totalSections: number;
    totalPages: number;
    totalPageSections: number;
    totalBlogs: number;
    totalMessages: number;
    totalAuditLogs: number;
    totalPermissions: number;
    totalStatistics: number;
    growthRate: number;
    healthScore: number;
  };
  distributions: {
    collegeTypes: Array<{ type: string; count: number }>;
    userRoles: Array<{ role: string; count: number }>;
    sectionTypes: Array<{ type: string; count: number }>;
    pageSectionTypes: Array<{ type: string; count: number }>;
    actions: Array<{ action: string; count: number }>;
    blogTags: Array<{ tag: string; count: number }>;
  };
  topPerformers: {
    collegesByPrograms: Array<{ id: string; name: any; count: number }>;
    collegesBySections: Array<{ id: string; name: any; count: number }>;
    collegesByUsers: Array<{ id: string; name: any; count: number }>;
    universitiesByColleges: Array<{ id: string; name: any; count: number }>;
    universitiesByBlogs: Array<{ id: string; name: any; count: number }>;
    universitiesBySections: Array<{ id: string; name: any; count: number }>;
  };
  recentActivity: {
    users: Array<any>;
    colleges: Array<any>;
    blogs: Array<any>;
    programs: Array<any>;
    messages: Array<any>;
    auditLogs: Array<any>;
    systemActivity: Array<any>;
  };
  trends: {
    blogPublishing: Array<{ date: Date; count: number }>;
    userRegistration: Array<{ date: Date; count: number }>;
    collegeCreation: Array<{ date: Date; count: number }>;
    programCreation: Array<{ date: Date; count: number }>;
    messageTrends: Array<{ date: Date; count: number }>;
    auditTrends: Array<{ date: Date; count: number }>;
  };
  engagement: {
    totalUsers: number;
    activeUsers: number;
    userEngagementRate: number;
    totalColleges: number;
    collegesWithPrograms: number;
    collegeEngagementRate: number;
    totalPrograms: number;
    programsWithColleges: number;
    programEngagementRate: number;
    totalBlogs: number;
    publishedBlogs: number;
    blogPublishingRate: number;
  };
  systemHealth: {
    healthScore: number;
    dataIntegrity: number;
    totalRecords: number;
    recentActivity: number;
    systemUptime: number;
    performanceMetrics: any;
  };
  messageAnalytics: {
    totalMessages: number;
    recentMessages: Array<any>;
    statusDistribution: Array<{ status: string; count: number }>;
    priorityDistribution: Array<{ priority: string; count: number }>;
    typeDistribution: Array<{ type: string; count: number }>;
    dailyTrends: Array<{ date: string; count: number }>;
    hourlyDistribution: Array<{ hour: number; count: number }>;
    performanceMetrics: {
      averageResponseTime: string;
      deliveryRate: number;
      openRate: number;
      clickRate: number;
      bounceRate: number;
    };
    topSenders: Array<{ email: string; count: number }>;
  };
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
  '#8DD1E1',
  '#D084D0',
  '#FFB347',
  '#87CEEB',
];

function AnalysisPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/admin/analytics?timeRange=${timeRange}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch analytics'
      );
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, fetchAnalytics]);

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-white'>
            Admin Analytics Dashboard
          </h1>
          <Skeleton className='h-10 w-20 bg-white' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className='bg-transparent'>
              <CardHeader>
                <Skeleton className='h-4 w-24 bg-white' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-16 mb-2 bg-white' />
                <Skeleton className='h-3 w-20 bg-white' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-white'>
            Admin Analytics Dashboard
          </h1>
          <Button
            onClick={fetchAnalytics}
            variant='outline'
            className='text-white border-white'
          >
            <RefreshCw className='h-4 w-4 mr-2 text-white' />
            Retry
          </Button>
        </div>
        <Card className='bg-transparent'>
          <CardContent className='p-6'>
            <div className='text-center'>
              <p className='mb-4 text-white'>{error}</p>
              <Button
                onClick={fetchAnalytics}
                className='text-white border-white'
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold text-white'>
          Admin Analytics Dashboard
        </h1>
        <Card className='bg-transparent'>
          <CardContent className='p-6'>
            <div className='text-center text-white'>
              No analytics data available
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'distributions', label: 'Distributions', icon: PieChart },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'health', label: 'System Health', icon: Shield },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const chartData = prepareChartData(analytics);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-white'>
          Admin Analytics Dashboard
        </h1>
        <div className='flex items-center gap-4'>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className='bg-transparent border border-white text-white rounded px-3 py-2'
          >
            <option value='7'>Last 7 days</option>
            <option value='30'>Last 30 days</option>
            <option value='90'>Last 90 days</option>
            <option value='365'>Last year</option>
          </select>
          <Button
            onClick={fetchAnalytics}
            variant='ghost'
            className='text-white border-white bg-transparent border-1 hover:text-white hover:bg-transparent cursor-pointer focus:bg-transparent active:bg-transparent'
          >
            <RefreshCw className='h-4 w-4 mr-2 text-white' />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='space-x-1 grid grid-cols-6 bg-transparent border border-white rounded-lg p-1'>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center text-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Icon className='h-4 w-4' />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className='space-y-6'>
          {/* Overview Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Total Users
                </CardTitle>
                <Users className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.overview.totalUsers.toLocaleString()}
                </div>
                <p className='text-xs text-white'>
                  {analytics.engagement.userEngagementRate}% active
                </p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Total Colleges
                </CardTitle>
                <Building className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.overview.totalColleges.toLocaleString()}
                </div>
                <p className='text-xs text-white'>
                  {analytics.engagement.collegeEngagementRate}% with programs
                </p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Total Programs
                </CardTitle>
                <BookOpen className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.overview.totalPrograms.toLocaleString()}
                </div>
                <p className='text-xs text-white'>
                  {analytics.engagement.programEngagementRate}% assigned
                </p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Total Blogs
                </CardTitle>
                <FileText className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.overview.totalBlogs.toLocaleString()}
                </div>
                <p className='text-xs text-white'>
                  {analytics.engagement.blogPublishingRate}% published
                </p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Total Universities
                </CardTitle>
                <Globe className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.overview.totalUniversities.toLocaleString()}
                </div>
                <p className='text-xs text-white'>Active institutions</p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Total Sections
                </CardTitle>
                <Layers className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.overview.totalSections.toLocaleString()}
                </div>
                <p className='text-xs text-white'>Content sections</p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Total Messages
                </CardTitle>
                <MessageSquare className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.overview.totalMessages.toLocaleString()}
                </div>
                <p className='text-xs text-white'>System messages</p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  System Health
                </CardTitle>
                <Shield className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.systemHealth.healthScore}%
                </div>
                <p className='text-xs text-white'>Health score</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className='bg-transparent border-2 border-white rounded-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Zap className='h-5 w-5 text-white' />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <Button className='bg-transparent border border-white text-white hover:bg-white hover:text-black'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add User
                </Button>
                <Button className='bg-transparent border border-white text-white hover:bg-white hover:text-black'>
                  <Building className='h-4 w-4 mr-2' />
                  Add College
                </Button>
                <Button className='bg-transparent border border-white text-white hover:bg-white hover:text-black'>
                  <BookOpen className='h-4 w-4 mr-2' />
                  Add Program
                </Button>
                <Button className='bg-transparent border border-white text-white hover:bg-white hover:text-black'>
                  <FileText className='h-4 w-4 mr-2' />
                  Add Blog
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className='bg-transparent border-2 border-white rounded-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Activity className='h-5 w-5 text-white' />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {analytics.recentActivity.systemActivity
                  .slice(0, 5)
                  .map((activity, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-white/5 rounded-lg'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                        <div>
                          <p className='text-white font-medium'>
                            {activity.action}
                          </p>
                          <p className='text-white/70 text-sm'>
                            {activity.entity}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-white text-sm'>
                          {activity.user?.name || 'System'}
                        </p>
                        <p className='text-white/70 text-xs'>
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Distributions Tab */}
      {activeTab === 'distributions' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* College Types Distribution */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <Building className='h-5 w-5 text-white' />
                  College Types Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Doughnut
                    data={chartData.collegeTypesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: 'white' },
                        },
                        datalabels: {
                          display: true,
                          color: 'white',
                          formatter: (value: number) => {
                            return `${value}`;
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* User Roles Distribution */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <Users className='h-5 w-5 text-white' />
                  User Roles Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Pie
                    data={chartData.userRolesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: 'white' },
                        },
                        datalabels: {
                          display: true,
                          color: 'white',
                          formatter: (value: number) => {
                            return `${value}`;
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className='space-y-6'>
          {/* Multi-line Trends Chart */}
          <Card className='bg-transparent border-2 border-white rounded-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <TrendingUp className='h-5 w-5 text-white' />
                Content Creation Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '400px' }}>
                <Line
                  data={chartData.multiTrendsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top', labels: { color: 'white' } },
                      datalabels: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { color: 'white' } },
                      x: { ticks: { color: 'white' } },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Blog Publishing Trends */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <FileText className='h-5 w-5 text-white' />
                  Blog Publishing Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Line
                    data={chartData.blogTrendsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        datalabels: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { color: 'white' } },
                        x: { ticks: { color: 'white' } },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* User Registration Trends */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <Users className='h-5 w-5 text-white' />
                  User Registration Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Line
                    data={chartData.userTrendsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        datalabels: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { color: 'white' } },
                        x: { ticks: { color: 'white' } },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Top Colleges by Programs */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <Building className='h-5 w-5 text-white' />
                  Top Colleges by Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Bar
                    data={chartData.topCollegesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      plugins: {
                        legend: { display: false },
                        datalabels: { display: false },
                      },
                      scales: {
                        x: { beginAtZero: true, ticks: { color: 'white' } },
                        y: { ticks: { color: 'white' } },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Top Universities by Colleges */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <Globe className='h-5 w-5 text-white' />
                  Top Universities by Colleges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Bar
                    data={chartData.topUniversitiesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      plugins: {
                        legend: { display: false },
                        datalabels: { display: false },
                      },
                      scales: {
                        x: { beginAtZero: true, ticks: { color: 'white' } },
                        y: { ticks: { color: 'white' } },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card className='bg-transparent border-2 border-white rounded-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Target className='h-5 w-5 text-white' />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-white mb-2'>
                    {analytics.engagement.userEngagementRate}%
                  </div>
                  <div className='text-white/70'>User Engagement</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-white mb-2'>
                    {analytics.engagement.collegeEngagementRate}%
                  </div>
                  <div className='text-white/70'>College Engagement</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-white mb-2'>
                    {analytics.engagement.programEngagementRate}%
                  </div>
                  <div className='text-white/70'>Program Engagement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Health Tab */}
      {activeTab === 'health' && (
        <div className='space-y-6'>
          {/* System Health Overview */}
          <Card className='bg-transparent border-2 border-white rounded-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Shield className='h-5 w-5 text-white' />
                System Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-white mb-2'>
                    {analytics.systemHealth.healthScore}%
                  </div>
                  <div className='text-white/70'>Health Score</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-white mb-2'>
                    {analytics.systemHealth.totalRecords.toLocaleString()}
                  </div>
                  <div className='text-white/70'>Total Records</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-white mb-2'>
                    {analytics.systemHealth.recentActivity}
                  </div>
                  <div className='text-white/70'>Recent Activity</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-white mb-2'>
                    {analytics.systemHealth.systemUptime}%
                  </div>
                  <div className='text-white/70'>System Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Integrity */}
          <Card className='bg-transparent border-2 border-white rounded-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Database className='h-5 w-5 text-white' />
                Data Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <CheckCircle className='h-5 w-5 text-green-500' />
                    <div>
                      <p className='text-white font-medium'>Data Integrity</p>
                      <p className='text-white/70 text-sm'>
                        All data relationships are valid
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant='outline'
                    className='text-green-500 border-green-500'
                  >
                    Healthy
                  </Badge>
                </div>
                <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <CheckCircle className='h-5 w-5 text-green-500' />
                    <div>
                      <p className='text-white font-medium'>
                        System Performance
                      </p>
                      <p className='text-white/70 text-sm'>
                        All systems operating normally
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant='outline'
                    className='text-green-500 border-green-500'
                  >
                    Optimal
                  </Badge>
                </div>
                <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <CheckCircle className='h-5 w-5 text-green-500' />
                    <div>
                      <p className='text-white font-medium'>Backup Status</p>
                      <p className='text-white/70 text-sm'>
                        Last backup completed successfully
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant='outline'
                    className='text-green-500 border-green-500'
                  >
                    Up to Date
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className='space-y-6'>
          {/* Message Overview Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Total Messages
                </CardTitle>
                <MessageSquare className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.messageAnalytics.totalMessages.toLocaleString()}
                </div>
                <p className='text-xs text-white'>All time messages</p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Delivery Rate
                </CardTitle>
                <CheckCircle className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.messageAnalytics.performanceMetrics.deliveryRate}%
                </div>
                <p className='text-xs text-white'>Successfully delivered</p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Open Rate
                </CardTitle>
                <Eye className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {analytics.messageAnalytics.performanceMetrics.openRate}%
                </div>
                <p className='text-xs text-white'>Messages opened</p>
              </CardContent>
            </Card>

            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Response Time
                </CardTitle>
                <Clock className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {
                    analytics.messageAnalytics.performanceMetrics
                      .averageResponseTime
                  }
                </div>
                <p className='text-xs text-white'>Average response time</p>
              </CardContent>
            </Card>
          </div>

          {/* Message Distribution Charts */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Message Status Distribution */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <MessageSquare className='h-5 w-5 text-white' />
                  Message Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Doughnut
                    data={chartData.messageStatusData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: 'white' },
                        },
                        datalabels: {
                          display: true,
                          color: 'white',
                          formatter: (value: number) => {
                            return `${value}`;
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Message Priority Distribution */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <AlertTriangle className='h-5 w-5 text-white' />
                  Message Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Pie
                    data={chartData.messagePriorityData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: 'white' },
                        },
                        datalabels: {
                          display: true,
                          color: 'white',
                          formatter: (value: number) => {
                            return `${value}`;
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Trends */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Daily Message Trends */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <TrendingUp className='h-5 w-5 text-white' />
                  Daily Message Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Line
                    data={chartData.messageTrendsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        datalabels: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { color: 'white' } },
                        x: { ticks: { color: 'white' } },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hourly Message Distribution */}
            <Card className='bg-transparent border-2 border-white rounded-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <Clock className='h-5 w-5 text-white' />
                  Hourly Message Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '300px' }}>
                  <Bar
                    data={chartData.hourlyMessageData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        datalabels: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { color: 'white' } },
                        x: { ticks: { color: 'white' } },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Senders */}
          <Card className='bg-transparent border-2 border-white rounded-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Users className='h-5 w-5 text-white' />
                Top Message Senders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Bar
                  data={chartData.topSendersData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                      legend: { display: false },
                      datalabels: { display: false },
                    },
                    scales: {
                      x: { beginAtZero: true, ticks: { color: 'white' } },
                      y: { ticks: { color: 'white' } },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className='bg-transparent border-2 border-white rounded-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Activity className='h-5 w-5 text-white' />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {analytics.messageAnalytics.recentMessages
                  .slice(0, 5)
                  .map((message: any, index: number) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-white/5 rounded-lg'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                        <div>
                          <p className='text-white font-medium'>
                            {message.messageConfig?.subject || 'No Subject'}
                          </p>
                          <p className='text-white/70 text-sm'>
                            {message.messageConfig?.type || 'Unknown'} •{' '}
                            {message.messageConfig?.status || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-white text-sm'>
                          {message.messageConfig?.from || 'Unknown'}
                        </p>
                        <p className='text-white/70 text-xs'>
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AnalysisPage;
