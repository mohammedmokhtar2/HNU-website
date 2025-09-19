'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    User,
    Eye,
    ArrowRight,
    ExternalLink,
    Star,
    Building,
    GraduationCap
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogWithRelations } from '@/types/blog';
import { getMultilingualText } from '@/utils/multilingual';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface BlogSectionProps {
    sectionId: string;
    universityId?: string;
    collegeId?: string;
    locale?: string;
    content?: {
        title: { ar: string; en: string };
        description: { ar: string; en: string };
        showFeaturedOnly?: boolean;
        maxItems?: number;
        showUniversityBlogs?: boolean;
        showCollegeBlogs?: boolean;
    };
}

interface BlogCardProps {
    blog: BlogWithRelations;
    locale: string;
    onViewBlog: (slug: string) => void;
    onViewAll: () => void;
}

const BlogCard = ({ blog, locale, onViewBlog, onViewAll }: BlogCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useOutsideClick(cardRef as React.RefObject<HTMLDivElement>, () => {
        if (isExpanded) {
            setIsExpanded(false);
        }
    });

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

    const blogTitle = getBlogTitle(blog);
    const blogContent = getBlogContent(blog);
    const blogImage = getBlogImage(blog);
    const associatedEntity = getAssociatedEntity(blog);
    const excerpt = blogContent.length > 150 ? blogContent.substring(0, 150) + '...' : blogContent;

    return (
        <Card
            ref={cardRef}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-xl ${isExpanded ? 'shadow-2xl scale-105 z-10' : 'hover:scale-105'
                } ${blog.isFeatured ? 'ring-2 ring-yellow-400 bg-yellow-50/50' : ''
                }`}
            onClick={() => setIsExpanded(!isExpanded)}
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
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {isExpanded ? blogContent : excerpt}
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
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                    <Button
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewBlog(blog.slug);
                        }}
                        className="flex-1"
                    >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Blog
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewAll();
                        }}
                    >
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export const BlogSection = ({ sectionId, universityId, collegeId, locale = 'en', content }: BlogSectionProps) => {
    const router = useRouter();
    const [blogs, setBlogs] = useState<BlogWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);

                const maxItems = content?.maxItems || 6;
                let url = `/api/blogs?limit=${maxItems}`;

                if (content?.showFeaturedOnly) {
                    url += '&isFeatured=true';
                }

                if (universityId) {
                    url += `&universityId=${universityId}`;
                } else if (collegeId) {
                    url += `&collageId=${collegeId}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }

                const data = await response.json();
                setBlogs(data.data || []);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [universityId, collegeId, content]);

    const handleViewBlog = (slug: string) => {
        router.push(`/${slug}`);
    };

    const handleViewAll = () => {
        router.push('/blogs');
    };

    const sectionTitle = content?.title ?
        (content.title[locale as keyof typeof content.title] || content.title.en || 'Latest Blogs') :
        'Latest Blogs';

    const sectionDescription = content?.description ?
        (content.description[locale as keyof typeof content.description] || content.description.en || 'Stay updated with our latest news, insights, and announcements') :
        'Stay updated with our latest news, insights, and announcements';

    if (loading) {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
                            <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-8"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-muted rounded-lg h-80"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">{sectionTitle}</h2>
                        <p className="text-muted-foreground">Unable to load blogs at this time.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">{sectionTitle}</h2>
                        <p className="text-muted-foreground">No blogs available at this time.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{sectionTitle}</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {sectionDescription}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {blogs.map((blog) => (
                        <BlogCard
                            key={blog.id}
                            blog={blog}
                            locale={locale}
                            onViewBlog={handleViewBlog}
                            onViewAll={handleViewAll}
                        />
                    ))}
                </div>

                <div className="text-center">
                    <Button
                        onClick={handleViewAll}
                        size="lg"
                        className="px-8"
                    >
                        View All Blogs
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
