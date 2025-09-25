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
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

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
    LineElement
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsPage = () => {
    const [stats, setStats] = useState<VisitorStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    deviceStats: globalConfig.deviceStats || { desktop: 0, mobile: 0, tablet: 0 },
                    browserStats: globalConfig.browserStats || {},
                    countryStats: globalConfig.countryStats || {},
                };

                setStats(safeStats);
            } else {
                throw new Error('Failed to fetch analytics data');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <Skeleton className="h-10 w-20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-4 w-24" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-2" />
                                <Skeleton className="h-3 w-20" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <Button onClick={fetchStats} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-destructive mb-4">{error}</p>
                            <Button onClick={fetchStats}>Try Again</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center text-muted-foreground">
                            No analytics data available
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Prepare chart data with safe access for Chart.js
    const dailyData = Object.entries(stats.dailyStats || {})
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-7); // Last 7 days

    const dailyChartData = {
        labels: dailyData.map(([date]) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Visitors',
                data: dailyData.map(([, data]) => data?.visitors || 0),
                backgroundColor: 'rgba(136, 132, 216, 0.2)',
                borderColor: 'rgba(136, 132, 216, 1)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const hourlyData = Object.entries(stats.hourlyStats || {})
        .sort(([a], [b]) => a.localeCompare(b));

    const hourlyChartData = {
        labels: hourlyData.map(([hour]) => `${hour}:00`),
        datasets: [
            {
                label: 'Visitors',
                data: hourlyData.map(([, count]) => count || 0),
                backgroundColor: 'rgba(130, 202, 157, 0.8)',
                borderColor: 'rgba(130, 202, 157, 1)',
                borderWidth: 1,
            },
        ],
    };

    const deviceData = [
        { name: 'Desktop', value: stats.deviceStats?.desktop || 0, icon: Monitor },
        { name: 'Mobile', value: stats.deviceStats?.mobile || 0, icon: Smartphone },
        { name: 'Tablet', value: stats.deviceStats?.tablet || 0, icon: Tablet },
    ].filter(item => item.value > 0);

    const deviceChartData = {
        labels: deviceData.map(item => item.name),
        datasets: [
            {
                data: deviceData.map(item => item.value),
                backgroundColor: COLORS.slice(0, deviceData.length),
                borderWidth: 2,
            },
        ],
    };

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

    const countryData = Object.entries(stats.countryStats || {})
        .sort(([, a], [, b]) => (b || 0) - (a || 0))
        .slice(0, 10);

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

    const monthlyData = Object.entries(stats.monthlyStats || {})
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6); // Last 6 months

    const monthlyChartData = {
        labels: monthlyData.map(([month]) => new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })),
        datasets: [
            {
                label: 'Visitors',
                data: monthlyData.map(([, data]) => data?.visitors || 0),
                borderColor: 'rgba(136, 132, 216, 1)',
                backgroundColor: 'rgba(136, 132, 216, 0.2)',
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: 'Page Views',
                data: monthlyData.map(([, data]) => data?.pageViews || 0),
                borderColor: 'rgba(130, 202, 157, 1)',
                backgroundColor: 'rgba(130, 202, 157, 0.2)',
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <Button onClick={fetchStats} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(stats.counter || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Visitors</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(stats.newVisitors || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {(stats.counter || 0) > 0 ? Math.round(((stats.newVisitors || 0) / (stats.counter || 1)) * 100) : 0}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Returning Visitors</CardTitle>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(stats.returningVisitors || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {(stats.counter || 0) > 0 ? Math.round(((stats.returningVisitors || 0) / (stats.counter || 1)) * 100) : 0}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold">
                            {new Date(stats.lastVisit || new Date()).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {new Date(stats.lastVisit || new Date()).toLocaleTimeString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Visitors Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Daily Visitors Trend (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: '300px' }}>
                            <Line
                                data={dailyChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                        x: {
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Hourly Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Hourly Visitor Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: '300px' }}>
                            <Bar
                                data={hourlyChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                        x: {
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Device Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor className="h-5 w-5" />
                            Device Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: '300px' }}>
                            <Doughnut
                                data={deviceChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Browser Usage */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Chrome className="h-5 w-5" />
                            Browser Usage
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: '300px' }}>
                            <Bar
                                data={browserChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    indexAxis: 'y',
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        x: {
                                            beginAtZero: true,
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                        y: {
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Countries */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Top Countries
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: '300px' }}>
                            <Bar
                                data={countryChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                        x: {
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Monthly Trend (Last 6 Months)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: '300px' }}>
                            <Line
                                data={monthlyChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                        x: {
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Device Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor className="h-5 w-5" />
                            Device Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {deviceData.map((device, index) => {
                                const Icon = device.icon;
                                const percentage = (stats.counter || 0) > 0 ? (device.value / (stats.counter || 1)) * 100 : 0;
                                return (
                                    <div key={device.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-medium">{device.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{device.value.toLocaleString()}</Badge>
                                            <div className="w-20 bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-muted-foreground w-12 text-right">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Countries List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Top Countries
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {countryData.slice(0, 8).map(([country, visitors], index) => {
                                const percentage = (stats.counter || 0) > 0 ? (visitors / (stats.counter || 1)) * 100 : 0;
                                return (
                                    <div key={country} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{index + 1}</Badge>
                                            <span className="font-medium">{country}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{visitors.toLocaleString()}</Badge>
                                            <div className="w-16 bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-muted-foreground w-12 text-right">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsPage;
