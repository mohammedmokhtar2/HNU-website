'use client';

import React from 'react';
import { BlogStats as BlogStatsType } from '@/types/blog';
import { getMultilingualText } from '@/utils/multilingual';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    FileText,
    Eye,
    EyeOff,
    Star,
    Building,
    Tag,
    TrendingUp
} from 'lucide-react';

interface BlogStatsProps {
    stats: BlogStatsType | null;
    loading: boolean;
}

export function BlogStats({ stats, loading }: BlogStatsProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center h-32">
                            <div className="text-muted-foreground">Loading statistics...</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center h-32">
                            <div className="text-muted-foreground">No statistics available</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            All blog posts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.published}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.draft}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.total > 0 ? Math.round((stats.draft / stats.total) * 100) : 0}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Featured</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.featured}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.total > 0 ? Math.round((stats.featured / stats.total) * 100) : 0}% of total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Blogs by University */}
                {stats.byUniversity && stats.byUniversity.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Blogs by University
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.byUniversity.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{item.count}</Badge>
                                            <span className="text-sm font-medium truncate">
                                                {getMultilingualText(item.universityName, 'en', 'Unknown University')}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Blogs by College */}
                {stats.byCollege && stats.byCollege.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Blogs by College
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.byCollege.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{item.count}</Badge>
                                            <span className="text-sm font-medium truncate">
                                                {getMultilingualText(item.collageName, 'en', 'Unknown College')}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Popular Tags */}
            {stats.byTags && stats.byTags.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            Popular Tags
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {stats.byTags.slice(0, 20).map((item, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {item.tag}
                                    <span className="text-xs opacity-70">({item.count})</span>
                                </Badge>
                            ))}
                            {stats.byTags.length > 20 && (
                                <Badge variant="outline" className="text-xs">
                                    +{stats.byTags.length - 20} more
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-1">
                            <div className="font-medium">Content Status</div>
                            <div className="text-muted-foreground">
                                {stats.published} published, {stats.draft} drafts
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="font-medium">Featured Content</div>
                            <div className="text-muted-foreground">
                                {stats.featured} featured posts
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="font-medium">Distribution</div>
                            <div className="text-muted-foreground">
                                {stats.byUniversity.length} universities, {stats.byCollege.length} colleges
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
