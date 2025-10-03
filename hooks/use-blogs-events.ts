'use client';

import { useQuery } from '@tanstack/react-query';
import { BlogService } from '@/services/blog.service';
import { BlogResponse } from '@/types/blog';

/**
 * Hook to fetch all blogs (both regular and events)
 */
export function useBlogs(params?: {
    isPublished?: boolean;
    isFeatured?: boolean;
}) {
    return useQuery({
        queryKey: ['blogs', params],
        queryFn: () =>
            BlogService.getAllBlogs({
                isPublished: params?.isPublished ?? true,
                isFeatured: params?.isFeatured,
                isEvent: false, // Get only blogs, not events
            }),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch all events (blogs with isEvent: true)
 */
export function useEvents(params?: {
    isPublished?: boolean;
    isFeatured?: boolean;
}) {
    return useQuery({
        queryKey: ['events', params],
        queryFn: () =>
            BlogService.getAllBlogs({
                isPublished: params?.isPublished ?? true,
                isFeatured: params?.isFeatured,
                isEvent: true, // Get only events
            }),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch a single blog by ID
 */
export function useBlog(blogId?: string) {
    return useQuery({
        queryKey: ['blog', blogId],
        queryFn: () => {
            if (!blogId) throw new Error('Blog ID is required');
            return BlogService.getBlogById(blogId);
        },
        enabled: !!blogId,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch both blogs and events for dropdown selection
 */
export function useBlogsAndEvents() {
    const { data: blogs = [], isLoading: blogsLoading } = useBlogs({
        isPublished: true,
    });
    const { data: events = [], isLoading: eventsLoading } = useEvents({
        isPublished: true,
    });

    return {
        blogs,
        events,
        isLoading: blogsLoading || eventsLoading,
        allItems: [...blogs, ...events],
    };
}

/**
 * Helper to get blog/event title in a specific locale
 */
export function getBlogTitle(blog: BlogResponse, locale: string = 'en'): string {
    if (typeof blog.title === 'object' && blog.title !== null) {
        return blog.title[locale] || blog.title.en || blog.title.ar || 'Untitled';
    }
    return 'Untitled';
}

/**
 * Helper to get blog/event content/description in a specific locale
 */
export function getBlogContent(
    blog: BlogResponse,
    locale: string = 'en'
): string {
    if (typeof blog.content === 'object' && blog.content !== null) {
        return blog.content[locale] || blog.content.en || blog.content.ar || '';
    }
    return '';
}

/**
 * Helper to get blog/event excerpt (truncated content)
 */
export function getBlogExcerpt(
    blog: BlogResponse,
    locale: string = 'en',
    maxLength: number = 150
): string {
    const content = getBlogContent(blog, locale);
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
}
