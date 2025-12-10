'use client';

import React from 'react';
import { BlogWithRelations } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  ExternalLink,
  Calendar,
  User,
  Building,
  MapPin,
  Clock,
} from 'lucide-react';
import { EventConfigDisplay } from './EventConfigForm';
import { useEventDisplay } from '@/contexts/EventConfigContext';
import { EventStatus, EventType } from '@/types/event';
import { format } from 'date-fns';
import Image from 'next/image';

interface BlogTableProps {
  blogs: BlogWithRelations[];
  loading: boolean;
  error: string | null;
  onEdit: (blog: BlogWithRelations) => void;
  onDelete: (blog: BlogWithRelations) => void;
  onToggleFeatured: (blog: BlogWithRelations) => void;
  onTogglePublished: (blog: BlogWithRelations) => void;
  universityId?: string;
  collegeId?: string;
  availableColleges: any[];
}

export function BlogTable({
  blogs,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
  universityId,
  collegeId,
  availableColleges,
}: BlogTableProps) {
  const { formatEventDate, getEventStatusColor, getEventTypeDisplay } =
    useEventDisplay();
  if (loading) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center h-32'>
            <div className='text-muted-foreground'>Loading blogs...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center h-32'>
            <div className='text-destructive'>Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (blogs.length === 0) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center justify-center h-32 space-y-2'>
            <div className='text-muted-foreground'>No blogs found</div>
            <div className='text-sm text-muted-foreground'>
              Create your first blog to get started
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getBlogTitle = (blog: BlogWithRelations): string => {
    if (typeof blog.title === 'object' && blog.title !== null) {
      return (blog.title as any).en || (blog.title as any).ar || 'Untitled';
    }
    return 'Untitled';
  };

  const getBlogExcerpt = (blog: BlogWithRelations): string => {
    if (typeof blog.content === 'object' && blog.content !== null) {
      const content =
        (blog.content as any).en || (blog.content as any).ar || '';
      return content.length > 100 ? content.substring(0, 100) + '...' : content;
    }
    return '';
  };

  const getBlogImage = (blog: BlogWithRelations) => {
    return blog.image && blog.image.length > 0 ? blog.image[0] : null;
  };

  const getAssociatedEntity = (blog: BlogWithRelations) => {
    if (blog.University) {
      return { type: 'university', name: blog.University.name };
    }
    if (blog.collage) {
      return { type: 'college', name: blog.collage.name };
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blogs ({blogs.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {blogs.map(blog => {
            const associatedEntity = getAssociatedEntity(blog);
            const blogImage = getBlogImage(blog);
            const isEvent = blog.isEvent && blog.eventConfig;

            return (
              <div
                key={blog.id}
                className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors ${
                  isEvent ? 'border-blue-200 bg-blue-50/30' : 'border-border'
                }`}
              >
                <div className='flex items-start gap-4'>
                  {/* Blog Image */}
                  {blogImage ? (
                    <div className='w-20 h-20 relative flex-shrink-0'>
                      <Image
                        src={blogImage}
                        alt={getBlogTitle(blog)}
                        fill
                        className='object-cover rounded-md'
                      />
                    </div>
                  ) : (
                    <div className='w-20 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0'>
                      <span className='text-muted-foreground text-xs'>
                        No Image
                      </span>
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h3 className='font-semibold text-lg truncate'>
                            {getBlogTitle(blog)}
                          </h3>
                          {isEvent && (
                            <Badge
                              variant='outline'
                              className='text-xs bg-blue-100 text-blue-800 border-blue-300'
                            >
                              <Calendar className='h-3 w-3 mr-1' />
                              Event
                            </Badge>
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                          {getBlogExcerpt(blog)}
                        </p>

                        {/* Blog Meta */}
                        <div className='flex items-center gap-4 mt-2 text-xs text-muted-foreground'>
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

                        {/* Event Information */}
                        {isEvent && (
                          <div className='mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm'>
                            <div className='flex items-center gap-2 mb-2'>
                              <div className='p-1 bg-blue-100 rounded-full'>
                                <Calendar className='h-3 w-3 text-blue-600' />
                              </div>
                              <span className='text-sm font-semibold text-blue-900'>
                                Event Details
                              </span>
                              <Badge
                                variant='outline'
                                className={`text-xs font-medium ${getEventStatusColor(blog.eventConfig?.status || EventStatus.DRAFT)}`}
                              >
                                {blog.eventConfig?.status
                                  ? blog.eventConfig.status
                                      .charAt(0)
                                      .toUpperCase() +
                                    blog.eventConfig.status.slice(1)
                                  : 'Draft'}
                              </Badge>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'>
                              {blog.eventConfig?.eventDate && (
                                <div className='flex items-center gap-2 text-blue-800 '>
                                  <Clock className='h-4 w-4 text-blue-600' />
                                  <span className='font-medium'>Date:</span>
                                  <span>
                                    {formatEventDate(
                                      blog.eventConfig.eventDate
                                    )}
                                  </span>
                                </div>
                              )}
                              {blog.eventConfig?.location && (
                                <div className='flex items-center gap-2 text-blue-800 '>
                                  <MapPin className='h-4 w-4 text-blue-600' />
                                  <span className='font-medium'>Location:</span>
                                  <span className='truncate'>
                                    {blog.eventConfig.location}
                                  </span>
                                </div>
                              )}
                              <div className='flex items-center gap-2 text-blue-800 '>
                                <span className='font-medium'>Type:</span>
                                <Badge variant='secondary' className='text-xs'>
                                  {getEventTypeDisplay(
                                    blog.eventConfig?.eventType ||
                                      EventType.OTHER
                                  )}
                                </Badge>
                              </div>
                              {blog.eventConfig?.eventEndDate && (
                                <div className='flex items-center gap-2 text-blue-800'>
                                  <Clock className='h-4 w-4 text-blue-600' />
                                  <span className='font-medium'>Ends:</span>
                                  <span>
                                    {formatEventDate(
                                      blog.eventConfig.eventEndDate
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className='flex flex-wrap gap-1 mt-2'>
                            {blog.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant='secondary'
                                className='text-xs'
                              >
                                {tag}
                              </Badge>
                            ))}
                            {blog.tags.length > 3 && (
                              <Badge variant='outline' className='text-xs'>
                                +{blog.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status Badges and Actions */}
                      <div className='flex items-center gap-2 ml-4'>
                        {/* Fast Action Buttons */}
                        <div className='flex items-center gap-1'>
                          <Button
                            variant={blog.isFeatured ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => onToggleFeatured(blog)}
                            className='h-8 px-2'
                            title={
                              blog.isFeatured
                                ? 'Remove from Featured'
                                : 'Add to Featured'
                            }
                          >
                            <Star
                              className={`h-3 w-3 ${blog.isFeatured ? 'fill-current' : ''}`}
                            />
                          </Button>
                          <Button
                            variant={blog.isPublished ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => onTogglePublished(blog)}
                            className='h-8 px-2'
                            title={blog.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {blog.isPublished ? (
                              <Eye className='h-3 w-3' />
                            ) : (
                              <EyeOff className='h-3 w-3' />
                            )}
                          </Button>
                        </div>

                        {/* Status Badges */}
                        <div className='flex flex-col gap-1'>
                          {blog.isFeatured && (
                            <Badge variant='default' className='text-xs'>
                              <Star className='h-3 w-3 mr-1' />
                              Featured
                            </Badge>
                          )}
                          <Badge
                            variant={blog.isPublished ? 'default' : 'secondary'}
                            className='text-xs'
                          >
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

                        {/* Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => onEdit(blog)}>
                              <Edit className='h-4 w-4 mr-2' />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(`/blog/${blog.slug}`, '_blank')
                              }
                            >
                              <ExternalLink className='h-4 w-4 mr-2' />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(blog)}
                              className='text-destructive'
                            >
                              <Trash2 className='h-4 w-4 mr-2' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
