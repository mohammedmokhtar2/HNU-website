'use client';

import React from 'react';
import { useBlogFilters } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Filter,
  X,
  Eye,
  EyeOff,
  Star,
  Building,
  User,
  Tag,
  Calendar,
} from 'lucide-react';

interface BlogFiltersProps {
  universityId?: string;
  collegeId?: string;
  availableColleges: any[];
}

export function BlogFilters({
  universityId,
  collegeId,
  availableColleges,
}: BlogFiltersProps) {
  const {
    queryParams,
    setQueryParams,
    searchBlogs,
    getBlogsByUniversity,
    getBlogsByCollege,
    getBlogsByAuthor,
    getBlogsByTags,
    getPublishedBlogs,
    getFeaturedBlogs,
  } = useBlogFilters();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchBlogs(query);
    } else {
      // Reset search
      setQueryParams({ search: undefined, page: 1 });
    }
  };

  const handleStatusFilter = (status: 'all' | 'published' | 'draft') => {
    switch (status) {
      case 'published':
        getPublishedBlogs();
        break;
      case 'draft':
        setQueryParams({ isPublished: false, page: 1 });
        break;
      default:
        setQueryParams({ isPublished: undefined, page: 1 });
    }
  };

  const handleFeaturedFilter = (
    featured: 'all' | 'featured' | 'not-featured'
  ) => {
    switch (featured) {
      case 'featured':
        getFeaturedBlogs();
        break;
      case 'not-featured':
        setQueryParams({ isFeatured: false, page: 1 });
        break;
      default:
        setQueryParams({ isFeatured: undefined, page: 1 });
    }
  };

  const handleUniversityFilter = (univId: string) => {
    if (univId && univId !== 'all') {
      getBlogsByUniversity(univId);
    } else {
      setQueryParams({ universityId: undefined, page: 1 });
    }
  };

  const handleCollegeFilter = (collId: string) => {
    if (collId && collId !== 'all') {
      getBlogsByCollege(collId);
    } else {
      setQueryParams({ collageId: undefined, page: 1 });
    }
  };

  const handleOrderBy = (orderBy: string) => {
    setQueryParams({ orderBy: orderBy as any, page: 1 });
  };

  const handleOrderDirection = (direction: 'asc' | 'desc') => {
    setQueryParams({ orderDirection: direction, page: 1 });
  };

  const clearFilters = () => {
    setQueryParams({
      search: undefined,
      isPublished: undefined,
      isFeatured: undefined,
      universityId: universityId,
      collageId: collegeId,
      createdById: undefined,
      tags: undefined,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      page: 1,
    });
  };

  const hasActiveFilters = () => {
    return !!(
      queryParams.search ||
      queryParams.isPublished !== undefined ||
      queryParams.isFeatured !== undefined ||
      queryParams.universityId ||
      queryParams.collageId ||
      queryParams.createdById ||
      queryParams.tags?.length
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filters
          </div>
          {hasActiveFilters() && (
            <Button variant='outline' size='sm' onClick={clearFilters}>
              <X className='h-4 w-4 mr-1' />
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Search */}
          <div>
            <Label htmlFor='search'>Search</Label>
            <div className='relative mt-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                id='search'
                placeholder='Search blogs...'
                value={queryParams.search || ''}
                onChange={e => handleSearch(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label>Publication Status</Label>
              <Select
                value={
                  queryParams.isPublished === true
                    ? 'published'
                    : queryParams.isPublished === false
                      ? 'draft'
                      : 'all'
                }
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='All statuses' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value='published'>
                    <div className='flex items-center gap-2'>
                      <Eye className='h-4 w-4' />
                      Published
                    </div>
                  </SelectItem>
                  <SelectItem value='draft'>
                    <div className='flex items-center gap-2'>
                      <EyeOff className='h-4 w-4' />
                      Draft
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Featured Status</Label>
              <Select
                value={
                  queryParams.isFeatured === true
                    ? 'featured'
                    : queryParams.isFeatured === false
                      ? 'not-featured'
                      : 'all'
                }
                onValueChange={handleFeaturedFilter}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='All featured' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Featured</SelectItem>
                  <SelectItem value='featured'>
                    <div className='flex items-center gap-2'>
                      <Star className='h-4 w-4' />
                      Featured
                    </div>
                  </SelectItem>
                  <SelectItem value='not-featured'>Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Organization Filters */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label>University</Label>
              <Select
                value={queryParams.universityId || 'all'}
                onValueChange={handleUniversityFilter}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='All universities' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Universities</SelectItem>
                  {/* Add university options here */}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>College</Label>
              <Select
                value={queryParams.collageId || 'all'}
                onValueChange={handleCollegeFilter}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='All colleges' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Colleges</SelectItem>
                  {availableColleges.map(college => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sorting */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label>Sort By</Label>
              <Select
                value={queryParams.orderBy || 'createdAt'}
                onValueChange={handleOrderBy}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='createdAt'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      Created Date
                    </div>
                  </SelectItem>
                  <SelectItem value='updatedAt'>Updated Date</SelectItem>
                  <SelectItem value='publishedAt'>Published Date</SelectItem>
                  <SelectItem value='order'>Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sort Direction</Label>
              <Select
                value={queryParams.orderDirection || 'desc'}
                onValueChange={handleOrderDirection}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Sort direction' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='desc'>Newest First</SelectItem>
                  <SelectItem value='asc'>Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <div>
              <Label className='text-sm font-medium'>Active Filters</Label>
              <div className='flex flex-wrap gap-2 mt-2'>
                {queryParams.search && (
                  <Badge
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    Search: {queryParams.search}
                    <X
                      className='h-3 w-3 cursor-pointer'
                      onClick={() =>
                        setQueryParams({ search: undefined, page: 1 })
                      }
                    />
                  </Badge>
                )}
                {queryParams.isPublished !== undefined && (
                  <Badge
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    {queryParams.isPublished ? 'Published' : 'Draft'}
                    <X
                      className='h-3 w-3 cursor-pointer'
                      onClick={() =>
                        setQueryParams({ isPublished: undefined, page: 1 })
                      }
                    />
                  </Badge>
                )}
                {queryParams.isFeatured !== undefined && (
                  <Badge
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    {queryParams.isFeatured ? 'Featured' : 'Not Featured'}
                    <X
                      className='h-3 w-3 cursor-pointer'
                      onClick={() =>
                        setQueryParams({ isFeatured: undefined, page: 1 })
                      }
                    />
                  </Badge>
                )}
                {queryParams.universityId && (
                  <Badge
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    University Filter
                    <X
                      className='h-3 w-3 cursor-pointer'
                      onClick={() =>
                        setQueryParams({ universityId: undefined, page: 1 })
                      }
                    />
                  </Badge>
                )}
                {queryParams.collageId && (
                  <Badge
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    College Filter
                    <X
                      className='h-3 w-3 cursor-pointer'
                      onClick={() =>
                        setQueryParams({ collageId: undefined, page: 1 })
                      }
                    />
                  </Badge>
                )}
                {queryParams.tags && queryParams.tags.length > 0 && (
                  <Badge
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    Tags: {queryParams.tags.join(', ')}
                    <X
                      className='h-3 w-3 cursor-pointer'
                      onClick={() =>
                        setQueryParams({ tags: undefined, page: 1 })
                      }
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
