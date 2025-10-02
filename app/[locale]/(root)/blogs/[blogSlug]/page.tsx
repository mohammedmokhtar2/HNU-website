'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { BlogWithRelations } from '@/types/blog';
import { Program } from '@/types/program';
import { University } from '@/types/university';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogService } from '@/services/blog.service';
import { ProgramService } from '@/services/program.service';
import { useUniversity } from '@/contexts/UniversityContext';
import { useCollege } from '@/contexts/CollegeContext';
import {
  Calendar,
  User,
  ArrowLeft,
  Building,
  GraduationCap,
  Star,
  Eye,
  EyeOff,
  Clock,
  Award,
  BookOpen,
  ExternalLink,
  Globe,
  Tag,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getMultilingualText } from '@/utils/multilingual';
import { PageSkeleton } from '@/components/ui/skeleton';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const [blog, setBlog] = useState<BlogWithRelations | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogWithRelations[]>([]);
  const [relatedPrograms, setRelatedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { university } = useUniversity() as { university: University | null };
  const { colleges } = useCollege();

  const blogSlug = params?.blogSlug as string;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/blogs/slug/${blogSlug}`);
        if (!response.ok) {
          throw new Error('Blog not found');
        }

        const data = await response.json();
        setBlog(data);

        // Fetch related blogs and programs based on blog's association
        try {
          if (data.collageId) {
            // If blog belongs to a college, fetch related blogs and programs for that college
            const [blogsData, programsData] = await Promise.all([
              BlogService.getBlogsByCollege(data.collageId, {
                limit: 6,
                orderBy: 'createdAt',
                orderDirection: 'desc',
                isPublished: true,
              }),
              ProgramService.getProgramsByCollege(data.collageId, {
                limit: 6,
                orderBy: 'createdAt',
                orderDirection: 'desc',
              }),
            ]);

            // Filter out the current blog
            setRelatedBlogs(
              (blogsData.data || []).filter(b => b.id !== data.id)
            );
            setRelatedPrograms(programsData.data || []);
          } else if (data.universityId && university) {
            // If blog belongs to university, fetch related blogs and programs for university
            const [blogsData, programsData] = await Promise.all([
              BlogService.getBlogsByUniversity(data.universityId, {
                limit: 6,
                orderBy: 'createdAt',
                orderDirection: 'desc',
                isPublished: true,
              }),
              // For university level, we might want to get programs from all colleges
              // For now, let's get programs from the first college if available
              colleges.length > 0
                ? ProgramService.getProgramsByCollege(colleges[0].id, {
                    limit: 6,
                    orderBy: 'createdAt',
                    orderDirection: 'desc',
                  })
                : Promise.resolve({ data: [] }),
            ]);

            // Filter out the current blog
            setRelatedBlogs(
              (blogsData.data || []).filter(b => b.id !== data.id)
            );
            setRelatedPrograms(programsData.data || []);
          }
        } catch (relatedError) {
          console.warn('Error fetching related content:', relatedError);
          // Don't fail the entire page if related content can't be fetched
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    if (blogSlug) {
      fetchBlog();
    }
  }, [blogSlug, university, colleges]);

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

  // Helper functions for program data
  const getProgramName = (program: Program): string => {
    if (typeof program.name === 'object' && program.name !== null) {
      return (
        (program.name as any)[locale] || (program.name as any).en || 'Program'
      );
    }
    return 'Program';
  };

  const getCollegeName = (program: Program): string => {
    if (program.collage && typeof program.collage.name === 'object') {
      return (
        (program.collage.name as any)[locale] ||
        (program.collage.name as any).en ||
        ''
      );
    }
    return '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === 'ar' ? 'ar-EG' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
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

  if (loading) {
    return <PageSkeleton />;
  }

  if (error || !blog) {
    return (
      <div className='container mx-auto py-16 px-4'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Blog Not Found</h1>
          <p className='text-muted-foreground mb-8'>
            The blog you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push('/blogs')}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  const blogTitle = getBlogTitle(blog);
  const blogContent = getBlogContent(blog);
  const blogImage = getBlogImage(blog);
  const associatedEntity = getAssociatedEntity(blog);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='w-full px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                onClick={() => router.back()}
                className='flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors'
              >
                <ArrowLeft className='h-4 w-4' />
                {locale === 'ar' ? 'العودة' : 'Back'}
              </Button>
              <div className='h-6 w-px bg-gray-300'></div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {blogTitle}
                </h1>
                {associatedEntity && (
                  <p className='text-gray-600'>
                    {associatedEntity.type === 'university' ? (
                      <Building className='h-4 w-4 inline mr-1' />
                    ) : (
                      <GraduationCap className='h-4 w-4 inline mr-1' />
                    )}
                    {associatedEntity.name}
                  </p>
                )}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {blog.isFeatured && (
                <Badge variant='default'>
                  <Star className='h-3 w-3 mr-1' />
                  {locale === 'ar' ? 'مميز' : 'Featured'}
                </Badge>
              )}
              <Badge variant={blog.isPublished ? 'default' : 'secondary'}>
                {blog.isPublished ? (
                  <>
                    <Eye className='h-3 w-3 mr-1' />
                    {locale === 'ar' ? 'منشور' : 'Published'}
                  </>
                ) : (
                  <>
                    <EyeOff className='h-3 w-3 mr-1' />
                    {locale === 'ar' ? 'مسودة' : 'Draft'}
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 xl:grid-cols-12 gap-8'>
          {/* Left Column - Related Blogs */}
          <div className='xl:col-span-3'>
            <div className='bg-white rounded-lg shadow-md p-6 sticky top-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <BookOpen className='w-5 h-5 text-blue-600' />
                {locale === 'ar' ? 'مقالات أخرى' : 'Other Articles'}
              </h3>
              <div className='space-y-4'>
                {relatedBlogs.length > 0 ? (
                  relatedBlogs.map(relatedBlog => {
                    const relatedTitle = getBlogTitle(relatedBlog);
                    const relatedImage = getBlogImage(relatedBlog);
                    return (
                      <Link
                        key={relatedBlog.id}
                        href={`/blogs/${relatedBlog.slug}`}
                        className='block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200'
                      >
                        {relatedImage && (
                          <div className='relative h-24 w-full mb-3 rounded overflow-hidden'>
                            <Image
                              src={relatedImage}
                              alt={relatedTitle}
                              fill
                              className='object-cover'
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  'https://placehold.co/300x120/6b7280/ffffff?text=No+Image';
                              }}
                            />
                          </div>
                        )}
                        <h4 className='font-medium text-gray-900 mb-2 line-clamp-2 text-sm'>
                          {relatedTitle}
                        </h4>
                        <div className='flex items-center gap-2 text-xs text-gray-500'>
                          <Calendar className='w-3 h-3' />
                          <span>
                            {formatDate(relatedBlog.createdAt.toString())}
                          </span>
                        </div>
                        {relatedBlog.isFeatured && (
                          <div className='mt-2'>
                            <span className='inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs'>
                              <Star className='w-3 h-3' />
                              {locale === 'ar' ? 'مميز' : 'Featured'}
                            </span>
                          </div>
                        )}
                      </Link>
                    );
                  })
                ) : (
                  <p className='text-gray-500 text-sm'>
                    {locale === 'ar'
                      ? 'لا توجد مقالات أخرى'
                      : 'No other articles available'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center Column - Blog Content */}
          <div className='xl:col-span-6'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              {/* Featured Image */}
              {blogImage && (
                <div className='relative h-64 w-full'>
                  <Image
                    src={blogImage}
                    alt={blogTitle}
                    fill
                    className='object-cover'
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/800x400/6b7280/ffffff?text=No+Image';
                    }}
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className='p-8'>
                {/* Meta Information */}
                <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-4 w-4' />
                    {formatDate(blog.createdAt.toString())}
                  </div>
                  {blog.createdBy && (
                    <div className='flex items-center gap-1'>
                      <User className='h-4 w-4' />
                      {blog.createdBy.name || blog.createdBy.email}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-6'>
                    {blog.tags.map((tag, index) => (
                      <Badge key={index} variant='secondary'>
                        <Tag className='h-3 w-3 mr-1' />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Blog Content */}
                <div className='prose prose-lg max-w-none'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blogContent.replace(/\n/g, '<br />'),
                    }}
                  />
                </div>

                {/* Additional Images */}
                {blog.image && blog.image.length > 1 && (
                  <div className='mt-8'>
                    <h3 className='text-xl font-semibold mb-4'>
                      {locale === 'ar' ? 'صور إضافية' : 'More Images'}
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {blog.image.slice(1).map((imageUrl, index) => (
                        <div
                          key={index}
                          className='aspect-video relative overflow-hidden rounded-lg'
                        >
                          <Image
                            src={imageUrl}
                            alt={`${blogTitle} - Image ${index + 2}`}
                            fill
                            className='object-cover hover:scale-105 transition-transform duration-300 cursor-pointer'
                            onClick={() => window.open(imageUrl, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Related Programs & University/College Info */}
          <div className='xl:col-span-3'>
            <div className='space-y-6'>
              {/* Related Programs */}
              {relatedPrograms.length > 0 && (
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                    <GraduationCap className='w-5 h-5 text-green-600' />
                    {locale === 'ar' ? 'البرامج ذات الصلة' : 'Related Programs'}
                  </h3>
                  <div className='space-y-3'>
                    {relatedPrograms.map(program => {
                      const programName = getProgramName(program);
                      const collegeName = getCollegeName(program);
                      const collegeSlug = program.collage?.slug;
                      return (
                        <Link
                          key={program.id}
                          href={
                            collegeSlug
                              ? `/colleges/${collegeSlug}/programs/${program.id}`
                              : '#'
                          }
                          className='block p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200'
                        >
                          <h4 className='font-medium text-gray-900 mb-1 line-clamp-2 text-sm'>
                            {programName}
                          </h4>
                          <div className='flex items-center gap-2 text-xs text-gray-500'>
                            <Clock className='w-3 h-3' />
                            <span>{program.config?.duration || 'N/A'}</span>
                          </div>
                          {collegeName && (
                            <div className='flex items-center gap-2 text-xs text-gray-500 mt-1'>
                              <Building className='w-3 h-3' />
                              <span>{collegeName}</span>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* University Info */}
              {university && (
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                    <Globe className='w-5 h-5 text-blue-600' />
                    {locale === 'ar'
                      ? 'معلومات الجامعة'
                      : 'University Information'}
                  </h3>
                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-medium text-gray-900 mb-2'>
                        {university.name?.[locale] ||
                          university.name?.en ||
                          'University'}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        {locale === 'ar' ? 'جامعة حكومية' : 'Public University'}
                      </p>
                    </div>

                    {/* University Logo */}
                    {university.config?.logo && (
                      <div className='flex justify-center mb-4'>
                        <Image
                          src={university.config.logo}
                          alt={
                            university.name?.[locale] ||
                            university.name?.en ||
                            'University Logo'
                          }
                          width={80}
                          height={80}
                          className='object-contain'
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/80x80/6b7280/ffffff?text=Logo';
                          }}
                        />
                      </div>
                    )}

                    {/* Social Media Links */}
                    {university.config?.socialMedia &&
                      Object.keys(university.config.socialMedia).length > 0 && (
                        <div className='border-t pt-4'>
                          <h5 className='text-sm font-medium text-gray-700 mb-2'>
                            {locale === 'ar'
                              ? 'وسائل التواصل الاجتماعي'
                              : 'Social Media'}
                          </h5>
                          <div className='flex flex-wrap gap-2'>
                            {Object.entries(university.config.socialMedia).map(
                              ([platform, url]) => (
                                <a
                                  key={platform}
                                  href={url}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-blue-600 hover:text-blue-800 text-sm'
                                >
                                  {platform}
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* College Info */}
              {blog.collage && (
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                    <Building className='w-5 h-5 text-green-600' />
                    {locale === 'ar' ? 'معلومات الكلية' : 'College Information'}
                  </h3>
                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-medium text-gray-900 mb-2'>
                        {getMultilingualText(
                          blog.collage.name as Record<string, any>,
                          locale,
                          'Unknown College'
                        )}
                      </h4>
                      {blog.collage.description &&
                        typeof blog.collage.description === 'object' &&
                        (blog.collage.description as any)[locale] && (
                          <p className='text-sm text-gray-600'>
                            {(blog.collage.description as any)[locale]}
                          </p>
                        )}
                    </div>

                    {/* College Logo */}
                    {blog.collage.config &&
                      typeof blog.collage.config === 'object' &&
                      (blog.collage.config as any).logoUrl && (
                        <div className='flex justify-center mb-4'>
                          <Image
                            src={(blog.collage.config as any).logoUrl}
                            alt={getMultilingualText(
                              blog.collage.name as Record<string, any>,
                              locale,
                              'College Logo'
                            )}
                            width={60}
                            height={60}
                            className='object-contain'
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                'https://placehold.co/60x60/6b7280/ffffff?text=Logo';
                            }}
                          />
                        </div>
                      )}

                    {/* Social Media Links */}
                    {blog.collage.config &&
                      typeof blog.collage.config === 'object' &&
                      (blog.collage.config as any).socialMedia &&
                      Object.keys((blog.collage.config as any).socialMedia)
                        .length > 0 && (
                        <div className='border-t pt-4'>
                          <h5 className='text-sm font-medium text-gray-700 mb-2'>
                            {locale === 'ar'
                              ? 'وسائل التواصل الاجتماعي'
                              : 'Social Media'}
                          </h5>
                          <div className='flex flex-wrap gap-2'>
                            {Object.entries(
                              (blog.collage.config as any).socialMedia
                            ).map(([platform, url]) => {
                              if (!url) return null;
                              return (
                                <a
                                  key={platform}
                                  href={url as string}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-blue-600 hover:text-blue-800 text-sm'
                                >
                                  {platform}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
