'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
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
  GraduationCap,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogWithRelations } from '@/types/blog';
import { getMultilingualText } from '@/utils/multilingual';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { AnimatePresence, motion } from 'motion/react';

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

const BlogCard = ({
  blog,
  locale,
  onViewBlog,
  onViewAll,
  id,
}: BlogCardProps & { id: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  useOutsideClick(cardRef as React.RefObject<HTMLDivElement>, () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  });

  const getBlogTitle = (blog: BlogWithRelations): string => {
    if (typeof blog.title === 'object' && blog.title !== null) {
      return (
        (blog.title as any)[locale] || (blog.title as any).en || 'Untitled'
      );
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
        name: getMultilingualText(
          blog.University.name as Record<string, any>,
          locale,
          'Unknown University'
        ),
      };
    }
    if (blog.collage) {
      return {
        type: 'college',
        name: getMultilingualText(
          blog.collage.name as Record<string, any>,
          locale,
          'Unknown College'
        ),
      };
    }
    return null;
  };

  const blogTitle = getBlogTitle(blog);
  const blogContent = getBlogContent(blog);
  const blogImage = getBlogImage(blog);
  const associatedEntity = getAssociatedEntity(blog);

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/20 h-full w-full z-10'
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded ? (
          <div className='fixed inset-0 grid place-items-center z-[100]'>
            <motion.button
              key={`button-${blog.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6'
              onClick={() => setIsExpanded(false)}
            >
              <X className='h-4 w-4 text-black' />
            </motion.button>

            <motion.div
              layoutId={`card-${blog.id}-${id}`}
              ref={cardRef}
              className='w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden'
            >
              <motion.div layoutId={`image-${blog.id}-${id}`}>
                {blogImage ? (
                  <Image
                    width={500}
                    height={320}
                    src={blogImage}
                    alt={blogTitle}
                    className='w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center'
                  />
                ) : (
                  <div className='w-full h-80 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center'>
                    <span className='text-muted-foreground'>No Image</span>
                  </div>
                )}
              </motion.div>

              <div>
                <div className='flex justify-between items-start p-4'>
                  <div className='flex-1'>
                    <motion.h3
                      layoutId={`title-${blog.id}-${id}`}
                      className='font-bold text-neutral-700 dark:text-neutral-200 text-lg'
                    >
                      {blogTitle}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${blog.id}-${id}`}
                      className='text-neutral-600 dark:text-neutral-400 text-sm mt-1'
                    >
                      {associatedEntity?.name || 'Blog Post'}
                    </motion.p>
                  </div>

                  <motion.button
                    layoutId={`button-${blog.id}-${id}`}
                    onClick={() => onViewBlog(blog.slug)}
                    className='px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white hover:bg-green-600 transition-colors'
                  >
                    View Blog
                  </motion.button>
                </div>

                <div className='pt-4 relative px-4'>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]'
                  >
                    <p className='whitespace-pre-wrap'>{blogContent}</p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {blog.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='text-xs'
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Event Information */}
                    {blog.isEvent && blog.eventConfig && (
                      <div className='bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Calendar className='h-4 w-4 text-purple-600' />
                          <span className='font-semibold text-purple-800 dark:text-purple-200'>Event Details</span>
                        </div>
                        <div className='space-y-1 text-sm'>
                          {blog.eventConfig.eventType && (
                            <div className='flex items-center gap-2'>
                              <span className='text-purple-600 dark:text-purple-400'>Type:</span>
                              <span className='capitalize'>{blog.eventConfig.eventType}</span>
                            </div>
                          )}
                          {blog.eventConfig.location && (
                            <div className='flex items-center gap-2'>
                              <span className='text-purple-600 dark:text-purple-400'>Location:</span>
                              <span>{blog.eventConfig.location}</span>
                            </div>
                          )}
                          {blog.eventConfig.status && (
                            <div className='flex items-center gap-2'>
                              <span className='text-purple-600 dark:text-purple-400'>Status:</span>
                              <Badge variant='outline' className='text-xs capitalize'>
                                {blog.eventConfig.status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Meta Information */}
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                      </div>
                      {blog.createdBy && (
                        <div className='flex items-center gap-1'>
                          <User className='h-3 w-3' />
                          {blog.createdBy.name || blog.createdBy.email}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Main Image Card */}
      <motion.div
        layoutId={`card-${blog.id}-${id}`}
        onClick={() => setIsExpanded(true)}
        className='group cursor-pointer transition-all duration-300 hover:scale-105'
      >
        <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
          {blogImage ? (
            <motion.div layoutId={`image-${blog.id}-${id}`}>
              <Image
                src={blogImage}
                alt={blogTitle}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-110'
              />
            </motion.div>
          ) : (
            <div className='w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center'>
              <span className='text-muted-foreground text-sm'>No Image</span>
            </div>
          )}

          {/* Overlay with title on hover */}
          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center'>
            <div className='text-center px-4'>
              <motion.h3
                layoutId={`title-${blog.id}-${id}`}
                className='text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2'
              >
                {blogTitle}
              </motion.h3>
              <motion.p
                layoutId={`description-${blog.id}-${id}`}
                className='text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1'
              >
                {associatedEntity?.name || 'Blog Post'}
              </motion.p>
            </div>
          </div>

          {/* Status Badges */}
          <div className='absolute top-2 right-2 flex flex-col gap-1'>
            {blog.isEvent && (
              <Badge
                variant='default'
                className='text-xs bg-purple-500 hover:bg-purple-600 px-2 py-1'
              >
                <Calendar className='h-3 w-3 mr-1' />
                Event
              </Badge>
            )}
            {blog.isFeatured && (
              <Badge
                variant='default'
                className='text-xs bg-yellow-500 hover:bg-yellow-600 px-2 py-1'
              >
                <Star className='h-3 w-3 mr-1' />
                Featured
              </Badge>
            )}
            <Badge
              variant={blog.isPublished ? 'default' : 'secondary'}
              className='text-xs px-2 py-1'
            >
              {blog.isPublished ? (
                <>
                  <Eye className='h-3 w-3 mr-1' />
                  Published
                </>
              ) : (
                'Draft'
              )}
            </Badge>
          </div>

          {/* Associated Entity */}
          {associatedEntity && (
            <div className='absolute top-2 left-2'>
              <Badge
                variant='secondary'
                className='text-xs bg-white/90 text-black px-2 py-1'
              >
                {associatedEntity.type === 'university' ? (
                  <Building className='h-3 w-3 mr-1' />
                ) : (
                  <GraduationCap className='h-3 w-3 mr-1' />
                )}
                {associatedEntity.name}
              </Badge>
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            layoutId={`button-${blog.id}-${id}`}
            className='absolute bottom-2 right-2 px-3 py-1 text-xs rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black transition-colors opacity-0 group-hover:opacity-100'
            onClick={e => {
              e.stopPropagation();
              onViewBlog(blog.slug);
            }}
          >
            View Blog
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export const BlogSection = ({
  sectionId,
  universityId,
  collegeId,
  locale = 'en',
  content,
}: BlogSectionProps) => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = useId();

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
    router.push(`/${slug}`);
  };

  const handleViewAll = () => {
    router.push('/blogs');
  };

  console.log("blogs in blog section", blogs);

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
      <div className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <div className='animate-pulse'>
              <div className='h-8 bg-muted rounded w-1/3 mx-auto mb-4'></div>
              <div className='h-4 bg-muted rounded w-1/2 mx-auto mb-8'></div>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className='bg-muted rounded-lg aspect-video'
                  ></div>
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
      <div className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold mb-4'>{sectionTitle}</h2>
            <p className='text-muted-foreground'>
              Unable to load blogs at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    console.log('no blogs found');
    return null
  }

  return (
    <div className='py-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold mb-4'>{sectionTitle}</h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            {sectionDescription}
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8'>
          {blogs.map(blog => (
            <BlogCard
              key={blog.id}
              blog={blog}
              locale={locale}
              onViewBlog={handleViewBlog}
              onViewAll={handleViewAll}
              id={id}
            />
          ))}
        </div>

        <div className='text-center'>
          <Button onClick={handleViewAll} size='lg' className='px-8'>
            View All Blogs
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </div>
      </div>
    </div>
  );
};
