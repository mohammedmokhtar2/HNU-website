'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { BlogWithRelations } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Calendar,
    User,
    Search,
    ArrowRight,
    Building,
    GraduationCap,
    Star,
    Eye,
    EyeOff
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { getMultilingualText } from '@/utils/multilingual';
import { PageSkeleton } from '@/components/ui/skeleton';

export default function BlogsPage() {
    const router = useRouter();
    const locale = useLocale();
    const [blogs, setBlogs] = useState<BlogWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState<BlogWithRelations[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/blogs?limit=20');
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }

                const data = await response.json();
                setBlogs(data.data || []);
                setFilteredBlogs(data.data || []);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = blogs.filter(blog => {
                const title = getBlogTitle(blog).toLowerCase();
                const content = getBlogContent(blog).toLowerCase();
                const query = searchQuery.toLowerCase();
                return title.includes(query) || content.includes(query);
            });
            setFilteredBlogs(filtered);
        } else {
            setFilteredBlogs(blogs);
        }
    }, [searchQuery, blogs]);

    const getBlogTitle = (blog: BlogWithRelations): string => {
        if (typeof blog.title === 'object' && blog.title !== null) {
            return (blog.title as any)[locale] || (blog.title as any).en || 'Untitled';
        }
        return 'Untitled';
    };

    const getBlogContent = (blog: BlogWithRelations): string => {
        if (typeof blog.content === 'object' && blog.content !== null) {
            return (blog.content as any)[locale] || (blog.content as any).en || '';
        }
        return '';
    };

    const getBlogImage = (blog: BlogWithRelations) => {
        return blog.image && blog.image.length > 0 ? blog.image[0] : null;
    };

    const getAssociatedEntity = (blog: BlogWithRelations) => {
        if (blog.University) {
            return {
                type: 'university',
                name: getMultilingualText(blog.University.name as Record<string, any>, locale, 'Unknown University')
            };
        }
        if (blog.collage) {
            return {
                type: 'college',
                name: getMultilingualText(blog.collage.name as Record<string, any>, locale, 'Unknown College')
            };
        }
        return null;
    };

    const handleViewBlog = (slug: string) => {
        router.push(`/${slug}`);
    };

    if (loading) {
        return <PageSkeleton />;
    }

    if (error) {
        return (
            <div className="container mx-auto py-16 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Error Loading Blogs</h1>
                    <p className="text-muted-foreground mb-8">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-muted/30">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Our Blogs</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Stay updated with our latest news, insights, and announcements
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-muted-foreground">
                        {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''} found
                        {searchQuery && ` for "${searchQuery}"`}
                    </p>
                </div>

                {/* Blogs Grid */}
                {filteredBlogs.length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold mb-4">No Blogs Found</h2>
                        <p className="text-muted-foreground mb-8">
                            {searchQuery ? 'Try adjusting your search terms.' : 'No blogs available at this time.'}
                        </p>
                        {searchQuery && (
                            <Button onClick={() => setSearchQuery('')}>
                                Clear Search
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.map((blog) => {
                            const blogTitle = getBlogTitle(blog);
                            const blogContent = getBlogContent(blog);
                            const blogImage = getBlogImage(blog);
                            const associatedEntity = getAssociatedEntity(blog);
                            const excerpt = blogContent.length > 150 ? blogContent.substring(0, 150) + '...' : blogContent;

                            return (
                                <Card
                                    key={blog.id}
                                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
                                    onClick={() => handleViewBlog(blog.slug)}
                                >
                                    <div className="relative">
                                        {/* Blog Image */}
                                        {blogImage ? (
                                            <div className="aspect-video w-full relative overflow-hidden rounded-t-lg">
                                                <Image
                                                    src={blogImage}
                                                    alt={blogTitle}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                                {/* Status Badges */}
                                                <div className="absolute top-3 right-3 flex flex-col gap-1">
                                                    {blog.isFeatured && (
                                                        <Badge variant="default" className="text-xs">
                                                            <Star className="h-3 w-3 mr-1" />
                                                            Featured
                                                        </Badge>
                                                    )}
                                                    <Badge
                                                        variant={blog.isPublished ? "default" : "secondary"}
                                                        className="text-xs"
                                                    >
                                                        {blog.isPublished ? (
                                                            <>
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                Published
                                                            </>
                                                        ) : (
                                                            'Draft'
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-video w-full bg-muted rounded-t-lg flex items-center justify-center">
                                                <span className="text-muted-foreground text-sm">No Image</span>
                                            </div>
                                        )}

                                        {/* Associated Entity */}
                                        {associatedEntity && (
                                            <div className="absolute top-3 left-3">
                                                <Badge variant="secondary" className="text-xs">
                                                    {associatedEntity.type === 'university' ? (
                                                        <Building className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <GraduationCap className="h-3 w-3 mr-1" />
                                                    )}
                                                    {associatedEntity.name}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                            {blogTitle}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Content Preview */}
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {excerpt}
                                        </p>

                                        {/* Tags */}
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {blog.tags.slice(0, 3).map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {blog.tags.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{blog.tags.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        {/* Meta Information */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                                                </div>
                                                {blog.createdBy && (
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {blog.createdBy.name || blog.createdBy.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Read More Button */}
                                        <Button
                                            size="sm"
                                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                                        >
                                            Read More
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
