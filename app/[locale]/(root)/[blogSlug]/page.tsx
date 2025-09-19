'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { BlogWithRelations } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  User,
  ArrowLeft,
  Building,
  GraduationCap,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { getMultilingualText } from '@/utils/multilingual';
import { PageSkeleton } from '@/components/ui/skeleton';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const [blog, setBlog] = useState<BlogWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const blogSlug = params.blogSlug as string;

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
  }, [blogSlug]);

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
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b'>
        <div className='container mx-auto px-4 py-4'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mb-4'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Button>
        </div>
      </div>

      {/* Blog Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Blog Header */}
          <div className='mb-8'>
            {/* Status Badges */}
            <div className='flex items-center gap-2 mb-4'>
              {blog.isFeatured && (
                <Badge variant='default'>
                  <Star className='h-3 w-3 mr-1' />
                  Featured
                </Badge>
              )}
              <Badge variant={blog.isPublished ? 'default' : 'secondary'}>
                {blog.isPublished ? (
                  <>
                    <Eye className='h-3 w-3 mr-1' />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className='h-3 w-3 mr-1' />
                    Draft
                  </>
                )}
              </Badge>
            </div>

            {/* Title */}
            <h1 className='text-4xl font-bold mb-4'>{blogTitle}</h1>

            {/* Meta Information */}
            <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
              </div>
              {blog.createdBy && (
                <div className='flex items-center gap-1'>
                  <User className='h-4 w-4' />
                  {blog.createdBy.name || blog.createdBy.email}
                </div>
              )}
              {associatedEntity && (
                <div className='flex items-center gap-1'>
                  {associatedEntity.type === 'university' ? (
                    <Building className='h-4 w-4' />
                  ) : (
                    <GraduationCap className='h-4 w-4' />
                  )}
                  {associatedEntity.name}
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-6'>
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant='secondary'>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          {blogImage && (
            <div className='mb-8'>
              <div className='aspect-video w-full relative overflow-hidden rounded-lg'>
                <Image
                  src={blogImage}
                  alt={blogTitle}
                  fill
                  className='object-cover'
                />
              </div>
            </div>
          )}

          {/* Blog Content */}
          <Card>
            <CardContent className='p-8'>
              <div
                className='prose prose-lg max-w-none'
                dangerouslySetInnerHTML={{
                  __html: blogContent.replace(/\n/g, '<br />'),
                }}
              />
            </CardContent>
          </Card>

          {/* Additional Images */}
          {blog.image && blog.image.length > 1 && (
            <div className='mt-8'>
              <h3 className='text-xl font-semibold mb-4'>More Images</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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

          {/* Navigation */}
          <div className='mt-12 pt-8 border-t'>
            <div className='flex justify-between items-center'>
              <Button variant='outline' onClick={() => router.push('/blogs')}>
                <ArrowLeft className='h-4 w-4 mr-2' />
                All Blogs
              </Button>
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
