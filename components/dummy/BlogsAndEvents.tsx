'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, Calendar } from 'lucide-react';
import { useLocale } from 'next-intl';
import { format } from 'date-fns';
import { BlogWithRelations } from '@/types/blog';

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

export interface EventItem {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  image?: string;
  date: {
    ar: string;
    en: string;
  };
  time: {
    ar: string;
    en: string;
  };
  location: {
    ar: string;
    en: string;
  };
  category: {
    ar: string;
    en: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed';
  href?: string;
}

export interface NewsItem {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  image: string;
  date: {
    ar: string;
    en: string;
  };
  author: {
    ar: string;
    en: string;
  };
  category: {
    ar: string;
    en: string;
  };
  readTime: {
    ar: string;
    en: string;
  };
  href: string;
}

export interface BlogsAndEventsProps {
  blogsTitle: {
    ar: string;
    en: string;
  };
  eventsTitle: {
    ar: string;
    en: string;
  };
  subtitle: {
    ar: string;
    en: string;
  };
  blogItems: BlogWithRelations[];
  eventItems: EventItem[];
  local: string;
}

function NewsAndEvents({
  blogsTitle,
  eventsTitle,
  subtitle,
  blogItems,
  eventItems,
  local,
}: BlogsAndEventsProps) {
  // Separate items into blogs and events based on isEvent property
  const blogs = Array.isArray(blogItems) ? blogItems : [];
  const events = Array.isArray(eventItems) ? eventItems : [];

  console.log('BlogsAndEvents received:', {
    blogs,
    events,
    blogItems,
    eventItems,
  });

  // Fallbacks for section titles
  const safeBlogsTitle = blogsTitle || { ar: 'المدونات', en: 'Blogs' };
  const safeEventsTitle = eventsTitle || { ar: 'الفعاليات', en: 'Events' };

  return (
    <section className='relative py-20'>
      {/* Decorative background shapes */}
      <div className='absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl z-0' />
      <div className='absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl z-0' />

      <div className='container mx-auto px-4 relative z-10'>
        {/* Header Section */}
        <div className='max-w-3xl mx-auto text-center mb-16 relative z-10'>
          <h2 className='text-4xl sm:text-5xl font-extrabold text-[#023e8a] drop-shadow-lg tracking-tight mb-2'>
            {local === 'ar' ? safeBlogsTitle.ar : safeBlogsTitle.en}
          </h2>
          <p className='text-lg sm:text-2xl text-gray-700 max-w-2xl mx-auto font-medium'>
            {local === 'ar' ? subtitle.ar : subtitle.en}
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16'>
          {/* Blogs Section (with BlogSection UI) */}
          <div className='space-y-6'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full'></div>
              <h3 className='text-3xl font-bold text-[#023e8a]'>
                {local === 'ar' ? safeBlogsTitle.ar : safeBlogsTitle.en}
              </h3>
            </div>
            {/* Blogs Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {blogs
                .slice(0, 4)
                .map((blog: BlogWithRelations, index: number) => {
                  const getBlogTitle = (blog: any): string => {
                    if (typeof blog.title === 'object' && blog.title !== null) {
                      return (
                        (blog.title as any)[local] ||
                        (blog.title as any).en ||
                        'Untitled'
                      );
                    }
                    // Handle case where title is a string
                    if (typeof blog.title === 'string') {
                      return blog.title;
                    }
                    return 'Untitled';
                  };

                  const getBlogContent = (blog: any): string => {
                    if (
                      typeof blog.content === 'object' &&
                      blog.content !== null
                    ) {
                      return (
                        (blog.content as any)[local] ||
                        (blog.content as any).en ||
                        ''
                      );
                    }
                    // Handle case where content is a string
                    if (typeof blog.content === 'string') {
                      return blog.content;
                    }
                    return '';
                  };

                  const getBlogImage = (blog: BlogWithRelations) => {
                    if (Array.isArray(blog.image)) {
                      return blog.image.length > 0 ? blog.image[0] : null;
                    }
                    if (typeof blog.image === 'string') {
                      return blog.image;
                    }
                    return null;
                  };

                  const blogTitle = getBlogTitle(blog);
                  const blogContent = getBlogContent(blog);
                  const blogImage = getBlogImage(blog);

                  return (
                    <div
                      key={blog.id}
                      className={`group cursor-pointer transition-all duration-500 ${
                        index === 0
                          ? 'sm:col-span-2 bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:scale-[1.02]'
                          : 'bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl hover:border-blue-300 hover:-translate-y-1'
                      }`}
                      onClick={() =>
                        (window.location.href = `/${local}/blogs/${blog.slug || blog.id}`)
                      }
                    >
                      {index === 0 ? (
                        // Featured Blog Card (Large)
                        <>
                          <div className='relative h-48 w-full rounded-xl overflow-hidden mb-4'>
                            {blogImage ? (
                              <Image
                                src={blogImage}
                                alt={blogTitle}
                                className='object-cover w-full h-full group-hover:scale-110 transition-transform duration-700'
                                fill
                                sizes='(max-width: 640px) 100vw, 50vw'
                                priority
                              />
                            ) : (
                              <div className='w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center'>
                                <span className='text-muted-foreground text-sm'>
                                  No Image
                                </span>
                              </div>
                            )}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent'></div>
                            <span className='absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm'>
                              {blog.isFeatured
                                ? local === 'ar'
                                  ? 'مميز'
                                  : 'Featured'
                                : local === 'ar'
                                  ? 'مدونة'
                                  : 'Blog'}
                            </span>
                          </div>

                          <h4 className='text-xl font-bold text-[#023e8a] mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300'>
                            {blogTitle}
                          </h4>

                          <p className='text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed'>
                            {blogContent.length > 100
                              ? `${blogContent.substring(0, 100)}...`
                              : blogContent}
                          </p>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3 text-xs text-gray-500'>
                              <span className='font-medium'>
                                {blog.createdBy?.name ||
                                  (local === 'ar' ? 'الإدارة' : 'Admin')}
                              </span>
                              <span>•</span>
                              <span>
                                {blog.createdAt
                                  ? format(
                                      new Date(blog.createdAt),
                                      'MMM dd, yyyy'
                                    )
                                  : local === 'ar'
                                    ? 'غير محدد'
                                    : 'Unknown'}
                              </span>
                            </div>
                            <div className='flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all duration-300'>
                              <span>
                                {local === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                              </span>
                              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                            </div>
                          </div>
                        </>
                      ) : (
                        // Regular Blog Cards (Small)
                        <>
                          <div className='relative h-32 w-full rounded-lg overflow-hidden mb-3'>
                            {blogImage ? (
                              <Image
                                src={blogImage}
                                alt={blogTitle}
                                className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-500'
                                fill
                                sizes='(max-width: 640px) 100vw, 25vw'
                              />
                            ) : (
                              <div className='w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center'>
                                <span className='text-muted-foreground text-sm'>
                                  No Image
                                </span>
                              </div>
                            )}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
                          </div>

                          <h5 className='text-sm font-bold text-[#023e8a] mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300'>
                            {blogTitle}
                          </h5>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 text-xs text-gray-400'>
                              <span>
                                {blog.createdAt
                                  ? format(
                                      new Date(blog.createdAt),
                                      'MMM dd, yyyy'
                                    )
                                  : local === 'ar'
                                    ? 'غير محدد'
                                    : 'Unknown'}
                              </span>
                              <span>•</span>
                              <span>
                                {blog.createdBy?.name ||
                                  (local === 'ar' ? 'الإدارة' : 'Admin')}
                              </span>
                            </div>
                            <ArrowRight className='w-3 h-3 text-blue-600 group-hover:translate-x-1 transition-transform duration-300' />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Events Section */}
          <div className='space-y-6'>
            <div className='flex items-center gap-3 mb-6'>
              <h3 className='text-3xl font-bold text-[#023e8a]'>
                {local === 'ar' ? safeEventsTitle.ar : safeEventsTitle.en}
              </h3>
              <div className='h-1 flex-1 bg-gradient-to-r from-blue-600 to-transparent rounded'></div>
            </div>

            {/* Events List */}
            <div className='space-y-4'>
              {events.slice(0, 4).map((event: EventItem) => (
                <div
                  key={event.id}
                  className='bg-white/80 rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 group'
                >
                  <div className='flex items-start justify-between mb-3'>
                    <h4 className='text-lg font-bold text-[#023e8a] line-clamp-2 flex-1'>
                      {local === 'ar' ? event.title.ar : event.title.en}
                    </h4>
                  </div>

                  <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                    {local === 'ar'
                      ? event.description.ar
                      : event.description.en}
                  </p>

                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                      <Calendar className='w-4 h-4 text-[#023e8a]' />
                      <span>
                        {local === 'ar' ? event.date.ar : event.date.en}
                      </span>
                    </div>
                  </div>

                  <button className='mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1'>
                    {local === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                    <ArrowRight className='w-4 h-4' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <button className='inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-300 transform hover:scale-105'>
            {local === 'ar' ? (
              <>
                {'عرض جميع المدونات'}
                <ChevronLeft className='w-5 h-5' />
              </>
            ) : (
              <>
                {'View All Blogs'}
                <ArrowRight className='w-5 h-5' />
              </>
            )}
          </button>

          <button className='inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-700 to-green-500 text-white font-bold rounded-xl shadow-lg hover:from-green-800 hover:to-green-600 transition-all duration-300 transform hover:scale-105'>
            {local === 'ar' ? (
              <>
                {'عرض جميع الفعاليات'}
                <ChevronLeft className='w-5 h-5' />
              </>
            ) : (
              <>
                {'View All Events'}
                <ArrowRight className='w-5 h-5' />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default NewsAndEvents;
