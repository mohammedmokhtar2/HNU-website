'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgramService } from '@/services/program.service';
import { ProgramStats as ProgramStatsType } from '@/types/program';
import { BarChart3, GraduationCap, Building2, TrendingUp, RefreshCw } from 'lucide-react';

export function ProgramStats() {
    const [stats, setStats] = useState<ProgramStatsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ProgramService.getProgramStats();
            setStats(data);
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Program Statistics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Program Statistics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-destructive mb-4">{error}</p>
                        <Button onClick={fetchStats} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Programs */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">
                        Across all colleges
                    </p>
                </CardContent>
            </Card>

            {/* Programs by College */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Colleges with Programs</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.byCollege.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Active colleges
                    </p>
                </CardContent>
            </Card>

            {/* Average Programs per College */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Programs/College</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.byCollege.length > 0
                            ? (stats.total / stats.byCollege.length).toFixed(1)
                            : '0'
                        }
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Per college
                    </p>
                </CardContent>
            </Card>

            {/* Top College */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most Programs</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.byCollege.length > 0 ? Math.max(...stats.byCollege.map(c => c.count)) : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        In one college
                    </p>
                </CardContent>
            </Card>

            {/* Programs by College Breakdown */}
            {stats.byCollege.length > 0 && (
                <Card className="md:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Programs by College
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.byCollege
                                .sort((a, b) => b.count - a.count)
                                .map((college) => (
                                    <div key={college.collageId} className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {typeof college.collageName === 'string'
                                                    ? college.collageName
                                                    : (college.collageName as any)?.en || (college.collageName as any)?.ar || 'Unknown College'
                                                }
                                            </p>
                                            {typeof college.collageName === 'object' && (college.collageName as any)?.ar && (college.collageName as any)?.en && (
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {(college.collageName as any).ar}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">
                                                {college.count} program{college.count !== 1 ? 's' : ''}
                                            </Badge>
                                            <div className="w-20 bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{
                                                        width: `${(college.count / Math.max(...stats.byCollege.map(c => c.count))) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
