'use client';

import React, { useState, useEffect } from 'react';
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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  Download,
} from 'lucide-react';

interface VisitorStats {
  counter: number;
  newVisitors: number;
  returningVisitors: number;
  lastVisit: string;
  dailyStats: {
    [date: string]: {
      visitors: number;
      pageViews: number;
      sessions: number;
      newVisitors: number;
      returningVisitors: number;
    };
  };
  monthlyStats: {
    [month: string]: {
      visitors: number;
      pageViews: number;
      sessions: number;
      newVisitors: number;
      returningVisitors: number;
    };
  };
  hourlyStats: {
    [hour: string]: number;
  };
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserStats: {
    [browser: string]: number;
  };
  countryStats: {
    [country: string]: number;
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
];

const ComprehensiveAnalyticsPage = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/configs');
      if (response.ok) {
        const data = await response.json();

        // Ensure we have a proper structure
        const globalConfig = data.globalConfig || {};
        const safeStats = {
          counter: globalConfig.counter || 0,
          newVisitors: globalConfig.newVisitors || 0,
          returningVisitors: globalConfig.returningVisitors || 0,
          lastVisit: globalConfig.lastVisit || new Date().toISOString(),
          dailyStats: globalConfig.dailyStats || {},
          monthlyStats: globalConfig.monthlyStats || {},
          hourlyStats: globalConfig.hourlyStats || {},
          deviceStats: globalConfig.deviceStats || {
            desktop: 0,
            mobile: 0,
            tablet: 0,
          },
          browserStats: globalConfig.browserStats || {},
          countryStats: globalConfig.countryStats || {},
        };

        setStats(safeStats);
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch statistics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportToExcel = async () => {
    if (!stats) return;

    setIsExporting(true);
    try {
      // Prepare daily stats data
      const dailyStatsData = Object.entries(stats.dailyStats || {}).map(
        ([date, data]) => ({
          Date: date,
          Visitors: data?.visitors || 0,
          'Page Views': data?.pageViews || 0,
          Sessions: data?.sessions || 0,
          'New Visitors': data?.newVisitors || 0,
          'Returning Visitors': data?.returningVisitors || 0,
        })
      );

      // Prepare monthly stats data
      const monthlyStatsData = Object.entries(stats.monthlyStats || {}).map(
        ([month, data]) => ({
          Month: month,
          Visitors: data?.visitors || 0,
          'Page Views': data?.pageViews || 0,
          Sessions: data?.sessions || 0,
          'New Visitors': data?.newVisitors || 0,
          'Returning Visitors': data?.returningVisitors || 0,
        })
      );

      // Prepare hourly stats data
      const hourlyStatsData = Object.entries(stats.hourlyStats || {}).map(
        ([hour, count]) => ({
          Hour: `${hour}:00`,
          Visitors: count || 0,
        })
      );

      // Prepare device stats data
      const deviceStatsData = [
        { Device: 'Desktop', Visitors: stats.deviceStats?.desktop || 0 },
        { Device: 'Mobile', Visitors: stats.deviceStats?.mobile || 0 },
        { Device: 'Tablet', Visitors: stats.deviceStats?.tablet || 0 },
      ];

      // Prepare browser stats data
      const browserStatsData = Object.entries(stats.browserStats || {}).map(
        ([browser, count]) => ({
          Browser: browser,
          Visitors: count || 0,
        })
      );

      // Prepare country stats data
      const countryStatsData = Object.entries(stats.countryStats || {}).map(
        ([country, count]) => ({
          Country: country,
          Visitors: count || 0,
        })
      );

      // Prepare summary data
      const summaryData = [
        {
          Metric: 'Total Visitors',
          Value: stats.counter || 0,
        },
        {
          Metric: 'New Visitors',
          Value: stats.newVisitors || 0,
        },
        {
          Metric: 'Returning Visitors',
          Value: stats.returningVisitors || 0,
        },
        {
          Metric: 'Last Visit',
          Value: new Date(stats.lastVisit || new Date()).toLocaleString(),
        },
        {
          Metric: 'Daily Records Count',
          Value: Object.keys(stats.dailyStats || {}).length,
        },
        {
          Metric: 'Monthly Records Count',
          Value: Object.keys(stats.monthlyStats || {}).length,
        },
        {
          Metric: 'Device Types Count',
          Value: Object.values(stats.deviceStats || {}).filter(v => v > 0)
            .length,
        },
        {
          Metric: 'Browser Types Count',
          Value: Object.keys(stats.browserStats || {}).length,
        },
        {
          Metric: 'Countries Count',
          Value: Object.keys(stats.countryStats || {}).length,
        },
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Add worksheets
      if (dailyStatsData.length > 0) {
        const dailyWS = XLSX.utils.json_to_sheet(dailyStatsData);
        dailyWS['!cols'] = [
          { wch: 12 }, // Date
          { wch: 12 }, // Visitors
          { wch: 12 }, // Page Views
          { wch: 12 }, // Sessions
          { wch: 15 }, // New Visitors
          { wch: 18 }, // Returning Visitors
        ];
        XLSX.utils.book_append_sheet(workbook, dailyWS, 'Daily Stats');
      }

      if (monthlyStatsData.length > 0) {
        const monthlyWS = XLSX.utils.json_to_sheet(monthlyStatsData);
        monthlyWS['!cols'] = [
          { wch: 12 }, // Month
          { wch: 12 }, // Visitors
          { wch: 12 }, // Page Views
          { wch: 12 }, // Sessions
          { wch: 15 }, // New Visitors
          { wch: 18 }, // Returning Visitors
        ];
        XLSX.utils.book_append_sheet(workbook, monthlyWS, 'Monthly Stats');
      }

      if (hourlyStatsData.length > 0) {
        const hourlyWS = XLSX.utils.json_to_sheet(hourlyStatsData);
        hourlyWS['!cols'] = [
          { wch: 10 }, // Hour
          { wch: 12 }, // Visitors
        ];
        XLSX.utils.book_append_sheet(workbook, hourlyWS, 'Hourly Stats');
      }

      if (deviceStatsData.length > 0) {
        const deviceWS = XLSX.utils.json_to_sheet(deviceStatsData);
        deviceWS['!cols'] = [
          { wch: 12 }, // Device
          { wch: 12 }, // Visitors
        ];
        XLSX.utils.book_append_sheet(workbook, deviceWS, 'Device Stats');
      }

      if (browserStatsData.length > 0) {
        const browserWS = XLSX.utils.json_to_sheet(browserStatsData);
        browserWS['!cols'] = [
          { wch: 15 }, // Browser
          { wch: 12 }, // Visitors
        ];
        XLSX.utils.book_append_sheet(workbook, browserWS, 'Browser Stats');
      }

      if (countryStatsData.length > 0) {
        const countryWS = XLSX.utils.json_to_sheet(countryStatsData);
        countryWS['!cols'] = [
          { wch: 15 }, // Country
          { wch: 12 }, // Visitors
        ];
        XLSX.utils.book_append_sheet(workbook, countryWS, 'Country Stats');
      }

      // Add summary sheet
      const summaryWS = XLSX.utils.json_to_sheet(summaryData);
      summaryWS['!cols'] = [
        { wch: 25 }, // Metric
        { wch: 15 }, // Value
      ];
      XLSX.utils.book_append_sheet(workbook, summaryWS, 'Summary');

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const fileName = `analytics_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;

      saveAs(blob, fileName);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export analytics data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-white'>
            Comprehensive Analytics Dashboard
          </h1>
          <Skeleton className='h-10 w-20 bg-white' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {Array.from({ length: 4 }).map((_, i) => (
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
            Comprehensive Analytics Dashboard
          </h1>
          <Button
            onClick={fetchStats}
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
              <p className=' mb-4 text-white'>{error}</p>
              <Button onClick={fetchStats} className='text-white border-white'>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold text-white'>
          Comprehensive Analytics Dashboard
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

  // Chart data preparation functions
  const prepareChartData = () => {
    // Daily Visitors Trend (Line Chart)
    const dailyData = Object.entries(stats.dailyStats || {})
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7);

    // If no daily data, create empty chart
    if (dailyData.length === 0) {
      const emptyData = {
        labels: ['No Data'],
        datasets: [
          {
            label: 'Visitors',
            data: [0],
            backgroundColor: 'rgba(136, 132, 216, 0.2)',
            borderColor: 'rgba(136, 132, 216, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      const emptyBubbleData = {
        datasets: [
          {
            label: 'Daily Activity',
            data: [{ x: 0, y: 0, r: 0 }],
            backgroundColor: 'rgba(136, 132, 216, 0.6)',
            borderColor: 'rgba(136, 132, 216, 1)',
            borderWidth: 2,
          },
        ],
      };

      return {
        dailyChartData: emptyData,
        multiLineChartData: emptyData,
        stackedAreaChartData: emptyData,
        monthlyChartData: emptyData,
        cumulativeChartData: emptyData,
        hourlyChartData: emptyData,
        deviceChartData: emptyData,
        browserChartData: emptyData,
        browserPolarData: emptyData,
        visitorTypeData: emptyData,
        dailyVisitorTypeData: emptyData,
        countryChartData: emptyData,
        engagementChartData: emptyData,
        bubbleChartData: emptyBubbleData,
      };
    }

    const dailyChartData = {
      labels: dailyData.map(([date]) =>
        new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      ),
      datasets: [
        {
          label: 'Visitors',
          data: dailyData.map(([, data]) => data?.visitors || 0),
          backgroundColor: 'rgba(136, 132, 216, 0.2)',
          borderColor: 'rgba(136, 132, 216, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // Multi-Line Chart (Visitors, Page Views, Sessions)
    const multiLineChartData = {
      labels: dailyData.map(([date]) =>
        new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      ),
      datasets: [
        {
          label: 'Visitors',
          data: dailyData.map(([, data]) => data?.visitors || 0),
          borderColor: 'rgba(136, 132, 216, 1)',
          backgroundColor: 'rgba(136, 132, 216, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Page Views',
          data: dailyData.map(([, data]) => data?.pageViews || 0),
          borderColor: 'rgba(130, 202, 157, 1)',
          backgroundColor: 'rgba(130, 202, 157, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Sessions',
          data: dailyData.map(([, data]) => data?.sessions || 0),
          borderColor: 'rgba(255, 187, 40, 1)',
          backgroundColor: 'rgba(255, 187, 40, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };

    // Stacked Area Chart (New vs Returning Visitors)
    const stackedAreaChartData = {
      labels: dailyData.map(([date]) =>
        new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      ),
      datasets: [
        {
          label: 'New Visitors',
          data: dailyData.map(([, data]) => data?.newVisitors || 0),
          backgroundColor: 'rgba(0, 136, 254, 0.6)',
          borderColor: 'rgba(0, 136, 254, 1)',
          borderWidth: 1,
        },
        {
          label: 'Returning Visitors',
          data: dailyData.map(([, data]) => data?.returningVisitors || 0),
          backgroundColor: 'rgba(0, 196, 159, 0.6)',
          borderColor: 'rgba(0, 196, 159, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Monthly Visitors (Bar Chart)
    const monthlyData = Object.entries(stats.monthlyStats || {})
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6);

    const monthlyChartData = {
      labels: monthlyData.map(([month]) =>
        new Date(month + '-01').toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      ),
      datasets: [
        {
          label: 'Visitors',
          data: monthlyData.map(([, data]) => data?.visitors || 0),
          backgroundColor: 'rgba(136, 132, 216, 0.8)',
          borderColor: 'rgba(136, 132, 216, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Cumulative Growth Line
    let cumulativeTotal = 0;
    const cumulativeData = dailyData.map(([, data]) => {
      cumulativeTotal += data?.visitors || 0;
      return cumulativeTotal;
    });

    const cumulativeChartData = {
      labels: dailyData.map(([date]) =>
        new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      ),
      datasets: [
        {
          label: 'Cumulative Visitors',
          data: cumulativeData,
          borderColor: 'rgba(255, 128, 66, 1)',
          backgroundColor: 'rgba(255, 128, 66, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // Hourly Traffic (Radar Chart)
    const hourlyData = Object.entries(stats.hourlyStats || {}).sort(
      ([a], [b]) => a.localeCompare(b)
    );

    const hourlyChartData = {
      labels: hourlyData.map(([hour]) => `${hour}:00`),
      datasets: [
        {
          label: 'Visitors',
          data: hourlyData.map(([, count]) => count || 0),
          backgroundColor: 'rgba(136, 132, 216, 0.2)',
          borderColor: 'rgba(136, 132, 216, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(136, 132, 216, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(136, 132, 216, 1)',
        },
      ],
    };

    // Device Distribution (Doughnut Chart)
    const deviceData = [
      { name: 'Desktop', value: stats.deviceStats?.desktop || 0 },
      { name: 'Mobile', value: stats.deviceStats?.mobile || 0 },
      { name: 'Tablet', value: stats.deviceStats?.tablet || 0 },
    ].filter(item => item.value > 0);

    const deviceChartData = {
      labels: deviceData.map(item => item.name),
      datasets: [
        {
          data: deviceData.map(item => item.value),
          backgroundColor: COLORS.slice(0, deviceData.length),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };

    // Browser Usage (Horizontal Bar Chart)
    const browserData = Object.entries(stats.browserStats || {})
      .sort(([, a], [, b]) => (b || 0) - (a || 0))
      .slice(0, 5);

    const browserChartData = {
      labels: browserData.map(([browser]) => browser),
      datasets: [
        {
          label: 'Visitors',
          data: browserData.map(([, count]) => count || 0),
          backgroundColor: 'rgba(136, 132, 216, 0.8)',
          borderColor: 'rgba(136, 132, 216, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Browser Share (Polar Area Chart)
    const browserPolarData = {
      labels: browserData.map(([browser]) => browser),
      datasets: [
        {
          data: browserData.map(([, count]) => count || 0),
          backgroundColor: COLORS.slice(0, browserData.length),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };

    // New vs Returning Visitors (Pie Chart)
    const visitorTypeData = {
      labels: ['New Visitors', 'Returning Visitors'],
      datasets: [
        {
          data: [stats.newVisitors || 0, stats.returningVisitors || 0],
          backgroundColor: ['rgba(0, 136, 254, 0.8)', 'rgba(0, 196, 159, 0.8)'],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };

    // Daily New vs Returning Visitors (Stacked Bar)
    const dailyVisitorTypeData = {
      labels: dailyData.map(([date]) =>
        new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      ),
      datasets: [
        {
          label: 'New Visitors',
          data: dailyData.map(([, data]) => data?.newVisitors || 0),
          backgroundColor: 'rgba(0, 136, 254, 0.8)',
          borderColor: 'rgba(0, 136, 254, 1)',
          borderWidth: 1,
        },
        {
          label: 'Returning Visitors',
          data: dailyData.map(([, data]) => data?.returningVisitors || 0),
          backgroundColor: 'rgba(0, 196, 159, 0.8)',
          borderColor: 'rgba(0, 196, 159, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Top Countries (Bar Chart)
    const countryData = Object.entries(stats.countryStats || {})
      .sort(([, a], [, b]) => (b || 0) - (a || 0))
      .slice(0, 5);

    const countryChartData = {
      labels: countryData.map(([country]) => country),
      datasets: [
        {
          label: 'Visitors',
          data: countryData.map(([, count]) => count || 0),
          backgroundColor: 'rgba(130, 202, 157, 0.8)',
          borderColor: 'rgba(130, 202, 157, 1)',
          borderWidth: 1,
        },
      ],
    };

    // PageViews per Visitor (Bar Chart)
    const engagementData = dailyData.map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      pageViewsPerVisitor: data?.visitors ? data.pageViews / data.visitors : 0,
      sessionsPerVisitor: data?.visitors ? data.sessions / data.visitors : 0,
    }));

    const engagementChartData = {
      labels: engagementData.map(item => item.date),
      datasets: [
        {
          label: 'Page Views per Visitor',
          data: engagementData.map(item => item.pageViewsPerVisitor),
          backgroundColor: 'rgba(255, 187, 40, 0.8)',
          borderColor: 'rgba(255, 187, 40, 1)',
          borderWidth: 1,
        },
        {
          label: 'Sessions per Visitor',
          data: engagementData.map(item => item.sessionsPerVisitor),
          backgroundColor: 'rgba(255, 128, 66, 0.8)',
          borderColor: 'rgba(255, 128, 66, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Bubble Chart (Visitors vs Sessions vs PageViews)
    const bubbleData = dailyData.map(([, data]) => ({
      x: data?.visitors || 0,
      y: data?.sessions || 0,
      r: Math.sqrt(data?.pageViews || 0) / 10, // Scale bubble size
    }));

    const bubbleChartData = {
      datasets: [
        {
          label: 'Daily Activity',
          data: bubbleData,
          backgroundColor: 'rgba(136, 132, 216, 0.6)',
          borderColor: 'rgba(136, 132, 216, 1)',
          borderWidth: 2,
        },
      ],
    };

    return {
      dailyChartData,
      multiLineChartData,
      stackedAreaChartData,
      monthlyChartData,
      cumulativeChartData,
      hourlyChartData,
      deviceChartData,
      browserChartData,
      browserPolarData,
      visitorTypeData,
      dailyVisitorTypeData,
      countryChartData,
      engagementChartData,
      bubbleChartData,
    };
  };

  const chartData = prepareChartData();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-white'>
          Comprehensive Analytics Dashboard
        </h1>
        <div className='flex gap-2'>
          <Button
            onClick={handleExportToExcel}
            variant='outline'
            size='sm'
            className='hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800'
            disabled={isExporting || !stats}
          >
            {isExporting ? (
              <>
                <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                Exporting...
              </>
            ) : (
              <>
                <Download className='w-4 h-4 mr-2' />
                Export to Excel
              </>
            )}
          </Button>
          <Button
            onClick={fetchStats}
            variant='ghost'
            className='text-white border-white bg-transparent border-1 hover:text-white hover:bg-transparent cursor-pointer focus:bg-transparent active:bg-transparent'
          >
            <RefreshCw className='h-4 w-4 mr-2 text-white' />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        style={{
          border: '2px dashed white',
          borderRadius: '16px',
          padding: '16px',
        }}
      >
        <Card
          className='bg-transparent'
          style={{
            border: '2px dashed white',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-white'>
              Total Visitors
            </CardTitle>
            <Users className='h-4 w-4 text-white' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white'>
              {(stats.counter || 0).toLocaleString()}
            </div>
            <p className='text-xs text-white'>All time</p>
          </CardContent>
        </Card>

        <Card
          className='bg-transparent'
          style={{
            border: '2px dashed white',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-white'>
              New Visitors
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-white' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white'>
              {(stats.newVisitors || 0).toLocaleString()}
            </div>
            <p className='text-xs text-white'>
              {(stats.counter || 0) > 0
                ? Math.round(
                    ((stats.newVisitors || 0) / (stats.counter || 1)) * 100
                  )
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card
          className='bg-transparent'
          style={{
            border: '2px dashed white',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-white'>
              Returning Visitors
            </CardTitle>
            <RefreshCw className='h-4 w-4 text-white' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white'>
              {(stats.returningVisitors || 0).toLocaleString()}
            </div>
            <p className='text-xs text-white'>
              {(stats.counter || 0) > 0
                ? Math.round(
                    ((stats.returningVisitors || 0) / (stats.counter || 1)) *
                      100
                  )
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card
          className='bg-transparent'
          style={{
            border: '2px dashed white',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-white'>
              Last Visit
            </CardTitle>
            <Clock className='h-4 w-4 text-white' />
          </CardHeader>
          <CardContent>
            <div className='text-sm font-bold text-white'>
              {new Date(stats.lastVisit || new Date()).toLocaleDateString()}
            </div>
            <p className='text-xs text-white'>
              {new Date(stats.lastVisit || new Date()).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visitor & Traffic Trends */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold flex items-center gap-2 text-white'>
          <TrendingUp className='h-6 w-6 text-white' />
          Visitor & Traffic Trends
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Daily Visitors Trend */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Calendar className='h-5 w-5 text-white' />
                Daily Visitors Trend (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Line
                  data={chartData.dailyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      datalabels: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Multi-Line Chart */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <BarChart3 className='h-5 w-5 text-white' />
                Visitors, Page Views & Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Line
                  data={chartData.multiLineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      datalabels: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Stacked Area Chart */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Activity className='h-5 w-5 text-white' />
                New vs Returning Visitors Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Line
                  data={chartData.stackedAreaChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      datalabels: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true, stacked: true },
                      x: { stacked: true },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Monthly Visitors */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Calendar className='h-5 w-5 text-white' />
                Monthly Visitors (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Bar
                  data={chartData.monthlyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      datalabels: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cumulative Growth */}
        <Card
          className='bg-transparent'
          style={{ border: '2px dashed white', borderRadius: '16px' }}
        >
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white'>
              <TrendingUp className='h-5 w-5 text-white' />
              Cumulative Visitor Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px' }}>
              <Line
                data={chartData.cumulativeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    datalabels: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time-Based Behavior */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold flex items-center gap-2 text-white'>
          <Clock className='h-6 w-6 text-white' />
          Time-Based Behavior
        </h2>

        <Card
          className='bg-transparent'
          style={{ border: '2px dashed white', borderRadius: '16px' }}
        >
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white'>
              <Clock className='h-5 w-5 text-white' />
              Hourly Traffic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '400px' }}>
              <Radar
                data={chartData.hourlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    datalabels: { display: false },
                  },
                  scales: {
                    r: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices & Browsers */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold flex items-center gap-2 text-white'>
          <Monitor className='h-6 w-6 text-white' />
          Devices & Browsers
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Device Distribution */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Monitor className='h-5 w-5 text-white' />
                Device Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Doughnut
                  data={chartData.deviceChartData}
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
                          return `${value.toLocaleString()}`;
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Browser Usage */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Chrome className='h-5 w-5 text-white' />
                Browser Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Bar
                  data={chartData.browserChartData}
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

        {/* Browser Share (Polar Area) */}
        {/* <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Chrome className="h-5 w-5" />
                            Browser Share Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: '300px' }}>
                            <PolarArea
                                data={chartData.browserPolarData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'bottom' },
                                        datalabels: {
                                            display: true,
                                            formatter: (value: number) => {
                                                return `${value.toLocaleString()}`;
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </CardContent>
                </Card> */}
      </div>

      {/* Visitor Types */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold flex items-center gap-2 text-white'>
          <Users className='h-6 w-6 text-white' />
          Visitor Types
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* New vs Returning Visitors */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <PieChart className='h-5 w-5 text-white' />
                New vs Returning Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Pie
                  data={chartData.visitorTypeData}
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
                          return `${value.toLocaleString()}`;
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Daily New vs Returning Visitors */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <BarChart3 className='h-5 w-5 text-white' />
                Daily New vs Returning Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Bar
                  data={chartData.dailyVisitorTypeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top', labels: { color: 'white' } },
                      datalabels: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        stacked: true,
                        ticks: { color: 'white' },
                      },
                      x: { stacked: true, ticks: { color: 'white' } },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Countries */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold flex items-center gap-2 text-white'>
          <Globe className='h-6 w-6 text-white' />
          Geographic Distribution
        </h2>

        <Card
          className='bg-transparent'
          style={{ border: '2px dashed white', borderRadius: '16px' }}
        >
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white'>
              <MapPin className='h-5 w-5 text-white' />
              Top 5 Countries by Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px' }}>
              <Bar
                data={chartData.countryChartData}
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

      {/* Engagement Ratios */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold flex items-center gap-2 text-white'>
          <Eye className='h-6 w-6 text-white' />
          Engagement Ratios
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* PageViews per Visitor */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Eye className='h-5 w-5 text-white' />
                Page Views & Sessions per Visitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Bar
                  data={chartData.engagementChartData}
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

          {/* Bubble Chart */}
          <Card
            className='bg-transparent'
            style={{ border: '2px dashed white', borderRadius: '16px' }}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Activity className='h-5 w-5 text-white' />
                Daily Activity Correlation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <Bubble
                  data={chartData.bubbleChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      datalabels: { display: false },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Visitors',
                          color: 'white',
                        },
                        beginAtZero: true,
                        ticks: { color: 'white' },
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Sessions',
                          color: 'white',
                        },
                        beginAtZero: true,
                        ticks: { color: 'white' },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Data Summary */}
        <Card
          className='bg-transparent'
          style={{ border: '2px dashed white', borderRadius: '16px' }}
        >
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white'>
              <Activity className='h-5 w-5 text-white' />
              Data Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white'>
              <div className='space-y-2'>
                <div className='font-medium text-white'>Data Coverage</div>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span>Daily Records:</span>
                    <Badge
                      variant='outline'
                      className='text-white border-white'
                    >
                      {Object.keys(stats.dailyStats || {}).length} days
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span>Monthly Records:</span>
                    <Badge
                      variant='outline'
                      className='text-white border-white'
                    >
                      {Object.keys(stats.monthlyStats || {}).length} months
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span>Hourly Data Points:</span>
                    <Badge
                      variant='outline'
                      className='text-white border-white'
                    >
                      {Object.keys(stats.hourlyStats || {}).length} hours
                    </Badge>
                  </div>
                </div>
              </div>
              <div className='space-y-2'>
                <div className='font-medium text-white'>
                  Device & Browser Data
                </div>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span>Device Types:</span>
                    <Badge
                      variant='outline'
                      className='text-white border-white'
                    >
                      {
                        Object.values(stats.deviceStats || {}).filter(
                          v => v > 0
                        ).length
                      }{' '}
                      types
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span>Browser Types:</span>
                    <Badge
                      variant='outline'
                      className='text-white border-white'
                    >
                      {Object.keys(stats.browserStats || {}).length} browsers
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span>Countries:</span>
                    <Badge
                      variant='outline'
                      className='text-white border-white'
                    >
                      {Object.keys(stats.countryStats || {}).length} countries
                    </Badge>
                  </div>
                </div>
              </div>
              <div className='space-y-2'>
                <div className='font-medium text-white'>Data Freshness</div>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span>Last Updated:</span>
                    <Badge
                      variant='outline'
                      className='text-white border-white'
                    >
                      {new Date(
                        stats.lastVisit || new Date()
                      ).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span>Data Range:</span>
                    <Badge
                      variant='outline'
                      className='text-white border-white'
                    >
                      {Object.keys(stats.dailyStats || {}).length > 0
                        ? `${Object.keys(stats.dailyStats).sort()[0]} to ${Object.keys(stats.dailyStats).sort().pop()}`
                        : 'No data'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveAnalyticsPage;
