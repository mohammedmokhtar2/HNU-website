'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ChevronLeft,
  Calendar,
  X,
  User,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { BlogWithRelations } from '@/types/blog';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { useOutsideClick } from '@/hooks/use-outside-click';

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

export const BlogSection = ({
  universityId,
  collegeId,
  locale = 'en',
  content,
}: BlogSectionProps) => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBlog, setActiveBlog] = useState<BlogWithRelations | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const maxItems = content?.maxItems || 6;
        let url = `/api/blogs?limit=${maxItems}&isPublished=true`;

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
    router.push(`/${locale}/blogs/${slug}`);
  };

  const handleViewAllBlogs = () => {
    router.push(`/${locale}/blogs`);
  };

  const handleViewAllEvents = () => {
    router.push(`/${locale}/events`);
  };

  const handleBlogClick = (blog: BlogWithRelations) => {
    setActiveBlog(blog);
  };

  const handleViewFullBlog = (blog: BlogWithRelations) => {
    router.push(`/${locale}/blogs/${blog.slug || blog.id}`);
  };

  // Handle escape key and outside click
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveBlog(null);
      }
    }

    if (activeBlog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeBlog]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setActiveBlog(null)
  );

  // Separate blogs and events based on isEvent property
  const regularBlogs = blogs.filter(blog => !blog.isEvent);
  const eventBlogs = blogs.filter(blog => blog.isEvent);

  // Helper functions for multilingual content
  const getBlogTitle = (blog: BlogWithRelations): string => {
    if (typeof blog.title === 'object' && blog.title !== null) {
      return (
        (blog.title as any)[locale] || (blog.title as any).en || 'Untitled'
      );
    }
    if (typeof blog.title === 'string') {
      return blog.title;
    }
    return 'Untitled';
  };

  const getBlogContent = (blog: BlogWithRelations): string => {
    if (typeof blog.content === 'object' && blog.content !== null) {
      return (blog.content as any)[locale] || (blog.content as any).en || '';
    }
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

  const sectionTitle = content?.title
    ? content.title[locale as keyof typeof content.title] ||
      content.title.en ||
      'Latest Blogs'
    : 'Latest Blogs';

  const sectionDescription = content?.description
    ? content.description[locale as keyof typeof content.description] ||
      content.description.en ||
      'Stay updated with our latest news, insights, and announcements'
    : 'Stay updated with our latest news, insights, and announcements';

  if (loading) {
    return (
      <section className='relative py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <div className='animate-pulse'>
              <div className='h-8 bg-muted rounded w-1/3 mx-auto mb-4'></div>
              <div className='h-4 bg-muted rounded w-1/2 mx-auto mb-8'></div>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                <div className='space-y-4'>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className='bg-muted rounded-lg h-32'></div>
                  ))}
                </div>
                <div className='space-y-4'>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className='bg-muted rounded-lg h-24'></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='relative py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold mb-4'>{sectionTitle}</h2>
            <p className='text-muted-foreground'>
              Unable to load blogs at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {activeBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/20 h-full w-full z-10'
          />
        )}
      </AnimatePresence>

      {/* Expanded Blog Card */}
      <AnimatePresence>
        {activeBlog ? (
          <div className='fixed inset-0 grid place-items-center z-[100] p-4 sm:p-6'>
            <motion.button
              key={`button-${activeBlog.id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
              className='flex absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-8 lg:right-8 items-center justify-center bg-white rounded-full h-8 w-8 sm:h-10 sm:w-10 shadow-lg z-20'
              onClick={() => setActiveBlog(null)}
            >
              <X className='h-4 w-4 sm:h-5 sm:w-5 text-gray-700' />
            </motion.button>

            <motion.div
              layoutId={`card-${activeBlog.id}`}
              ref={ref}
              className='w-full max-w-[95vw] sm:max-w-[600px] max-h-[90vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl'
            >
              {/* Image */}
              <motion.div
                layoutId={`image-${activeBlog.id}`}
                className='relative flex-shrink-0'
              >
                {getBlogImage(activeBlog) ? (
                  <Image
                    src={getBlogImage(activeBlog)!}
                    alt={getBlogTitle(activeBlog)}
                    width={600}
                    height={400}
                    className='w-full h-48 sm:h-64 md:h-80 object-cover'
                  />
                ) : (
                  <div className='w-full h-48 sm:h-64 md:h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                    <span className='text-gray-500 text-4xl'>📝</span>
                  </div>
                )}

                {/* Overlay with badges */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

                {/* Featured Badge */}
                {activeBlog.isFeatured && (
                  <div className='absolute top-2 right-2 sm:top-4 sm:right-4'>
                    <span className='bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold'>
                      {locale === 'ar' ? 'مميز' : 'Featured'}
                    </span>
                  </div>
                )}

                {/* Blog Type Badge */}
                <div className='absolute top-2 left-2 sm:top-4 sm:left-4'>
                  <span className='bg-white/90 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold'>
                    {activeBlog.isEvent
                      ? locale === 'ar'
                        ? 'فعالية'
                        : 'Event'
                      : locale === 'ar'
                        ? 'مدونة'
                        : 'Blog'}
                  </span>
                </div>
              </motion.div>

              {/* Content */}
              <div className='p-4 sm:p-6 flex-1 overflow-y-auto'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex-1'>
                    <motion.h3
                      layoutId={`title-${activeBlog.id}`}
                      className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'
                    >
                      {getBlogTitle(activeBlog)}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${activeBlog.id}`}
                      className='text-gray-600 text-base sm:text-lg'
                    >
                      {getBlogContent(activeBlog).length > 200
                        ? `${getBlogContent(activeBlog).substring(0, 200)}...`
                        : getBlogContent(activeBlog)}
                    </motion.p>
                  </div>
                </div>

                <div className='pt-4 relative'>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-gray-600 text-sm md:text-base flex flex-col items-start gap-4'
                  >
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2 text-sm text-gray-500'>
                        <Calendar className='w-4 h-4 text-blue-600' />
                        <span>
                          {activeBlog.createdAt
                            ? format(
                                new Date(activeBlog.createdAt),
                                'MMM dd, yyyy'
                              )
                            : locale === 'ar'
                              ? 'غير محدد'
                              : 'Unknown'}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-500'>
                        <User className='w-4 h-4 text-blue-600' />
                        <span>
                          {activeBlog.createdBy?.name ||
                            (locale === 'ar' ? 'الإدارة' : 'Admin')}
                        </span>
                      </div>
                      {activeBlog.isEvent &&
                        activeBlog.eventConfig?.location && (
                          <div className='flex items-center gap-2 text-sm text-gray-500'>
                            <span className='text-blue-600'>📍</span>
                            <span>{activeBlog.eventConfig.location}</span>
                          </div>
                        )}
                    </div>

                    <div className='pt-4'>
                      <h4 className='font-semibold text-gray-900 mb-2'>
                        {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                      </h4>
                      <p className='text-gray-600 leading-relaxed'>
                        {getBlogContent(activeBlog)}
                      </p>
                    </div>

                    <div className='pt-4'>
                      <button
                        onClick={() => handleViewFullBlog(activeBlog)}
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2'
                      >
                        <span>
                          {locale === 'ar'
                            ? 'عرض المقال كاملاً'
                            : 'View Full Article'}
                        </span>
                        <ArrowRight className='w-4 h-4' />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <section className='relative py-20'>
        {/* Decorative background shapes */}
        <div className='absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl z-0' />
        <div className='absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl z-0' />

        <div className='container mx-auto px-4 relative z-10'>
          {/* Header Section */}
          <div className='max-w-3xl mx-auto text-center mb-16 relative z-10'>
            <h2 className='text-4xl sm:text-5xl font-extrabold text-[#023e8a] drop-shadow-lg tracking-tight mb-2'>
              {sectionTitle}
            </h2>
            <p className='text-lg sm:text-2xl text-gray-700 max-w-2xl mx-auto font-medium'>
              {sectionDescription}
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16'>
            {/* Blogs Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-3 mb-8'>
                <div className='w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full'></div>
                <h3 className='text-3xl font-bold text-[#023e8a]'>
                  {locale === 'ar' ? 'المدونات' : 'Blogs'}
                </h3>
              </div>

              {/* Blogs Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {regularBlogs
                  .slice(0, 4)
                  .map((blog: BlogWithRelations, index: number) => {
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
                        onClick={() => handleBlogClick(blog)}
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
                                  ? locale === 'ar'
                                    ? 'مميز'
                                    : 'Featured'
                                  : locale === 'ar'
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
                                    (locale === 'ar' ? 'الإدارة' : 'Admin')}
                                </span>
                                <span>•</span>
                                <span>
                                  {blog.createdAt
                                    ? format(
                                        new Date(blog.createdAt),
                                        'MMM dd, yyyy'
                                      )
                                    : locale === 'ar'
                                      ? 'غير محدد'
                                      : 'Unknown'}
                                </span>
                              </div>
                              <div className='flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all duration-300'>
                                <span>
                                  {locale === 'ar'
                                    ? 'اقرأ المزيد'
                                    : 'Read More'}
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
                                    : locale === 'ar'
                                      ? 'غير محدد'
                                      : 'Unknown'}
                                </span>
                                <span>•</span>
                                <span>
                                  {blog.createdBy?.name ||
                                    (locale === 'ar' ? 'الإدارة' : 'Admin')}
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
            {eventBlogs.length > 0 && (
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <h3 className='text-3xl font-bold text-[#023e8a]'>
                    {locale === 'ar' ? 'الفعاليات' : 'Events'}
                  </h3>
                  <div className='h-1 flex-1 bg-gradient-to-r from-blue-600 to-transparent rounded'></div>
                </div>

                {/* Events List */}
                <div className='space-y-4'>
                  {eventBlogs.slice(0, 4).map((event: BlogWithRelations) => {
                    const eventTitle = getBlogTitle(event);
                    const eventDescription = getBlogContent(event);
                    const eventImage = getBlogImage(event);

                    return (
                      <div
                        key={event.id}
                        className='bg-white/80 rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 group cursor-pointer'
                        onClick={() => handleBlogClick(event)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <h4 className='text-lg font-bold text-[#023e8a] line-clamp-2 flex-1'>
                            {eventTitle}
                          </h4>
                        </div>

                        <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                          {eventDescription}
                        </p>

                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 text-sm text-gray-500'>
                            <Calendar className='w-4 h-4 text-[#023e8a]' />
                            <span>
                              {event.createdAt
                                ? format(
                                    new Date(event.createdAt),
                                    'MMM dd, yyyy'
                                  )
                                : locale === 'ar'
                                  ? 'غير محدد'
                                  : 'Unknown'}
                            </span>
                          </div>
                          {event.eventConfig?.location && (
                            <div className='flex items-center gap-2 text-sm text-gray-500'>
                              <span className='text-[#023e8a]'>📍</span>
                              <span>{event.eventConfig.location}</span>
                            </div>
                          )}
                        </div>

                        <button className='mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1'>
                          {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                          <ArrowRight className='w-4 h-4' />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
