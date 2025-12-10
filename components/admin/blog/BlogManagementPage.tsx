'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBlog, useBlogFilters, useBlogStats } from '@/contexts/BlogContext';
import { useUniversity } from '@/contexts/UniversityContext';
import { useCollege } from '@/contexts/CollegeContext';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Filter,
  BarChart3,
  FileText,
  Star,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MoreHorizontal,
  Grid3X3,
  List,
  GripVertical,
  Calendar,
} from 'lucide-react';
import { BlogWithRelations } from '@/types/blog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BlogTable } from './BlogTable';
import { BlogGridView } from './BlogGridView';
import { BlogStats } from './BlogStats';
import { BlogDeleteModal } from './BlogDeleteModal';

interface BlogManagementPageProps {
  universityId?: string;
  collegeId?: string;
  initialView?: 'list' | 'stats';
}

export function BlogManagementPage({
  universityId,
  collegeId,
  initialView = 'list',
}: BlogManagementPageProps) {
  const router = useRouter();
  const { user } = useUser();
  const { university } = useUniversity();
  const { colleges, selectedCollege } = useCollege();

  const {
    blogs,
    loading,
    error,
    queryParams,
    setQueryParams,
    searchBlogs,
    getBlogsByUniversity,
    getBlogsByCollege,
    getPublishedBlogs,
    getFeaturedBlogs,
    toggleFeatured,
    togglePublished,
    deleteBlog,
    reorderBlogs,
  } = useBlog();

  const { stats, loadingStats } = useBlogStats();

  // Local state
  const [activeTab, setActiveTab] = useState(initialView);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingBlog, setDeletingBlog] = useState<BlogWithRelations | null>(
    null
  );
  const [selectedBlogType, setSelectedBlogType] = useState<
    'all' | 'university' | 'college'
  >('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Initialize filters based on props
  useEffect(() => {
    if (universityId) {
      getBlogsByUniversity(universityId);
      setSelectedBlogType('university');
    } else if (collegeId) {
      getBlogsByCollege(collegeId);
      setSelectedBlogType('college');
    }
  }, [universityId, collegeId, getBlogsByUniversity, getBlogsByCollege]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchBlogs(query);
    } else {
      // Reset to current filter
      if (universityId) {
        getBlogsByUniversity(universityId);
      } else if (collegeId) {
        getBlogsByCollege(collegeId);
      } else {
        setQueryParams({ search: undefined, page: 1 });
      }
    }
  };

  // Handle blog type filter
  const handleBlogTypeChange = (type: 'all' | 'university' | 'college') => {
    setSelectedBlogType(type);
    switch (type) {
      case 'university':
        if (universityId) {
          getBlogsByUniversity(universityId);
        }
        break;
      case 'college':
        if (collegeId) {
          getBlogsByCollege(collegeId);
        }
        break;
      default:
        setQueryParams({
          universityId: undefined,
          collageId: undefined,
          page: 1,
        });
    }
  };

  // Handle blog actions
  const handleEdit = (blog: BlogWithRelations) => {
    router.push(`/admin/system/blogs/${blog.id}/edit`);
  };

  const handleDelete = (blog: BlogWithRelations) => {
    setDeletingBlog(blog);
  };

  const handleToggleFeatured = async (blog: BlogWithRelations) => {
    try {
      await toggleFeatured(blog.id);
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleTogglePublished = async (blog: BlogWithRelations) => {
    try {
      await togglePublished(blog.id);
    } catch (error) {
      console.error('Error toggling published status:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingBlog) {
      try {
        await deleteBlog(deletingBlog.id);
        setDeletingBlog(null);
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleReorder = async (blogIds: string[]) => {
    try {
      await reorderBlogs(blogIds);
    } catch (error) {
      console.error('Error reordering blogs:', error);
    }
  };

  // Get current context name
  const getContextName = (): string => {
    if (universityId && university) {
      return String(university.name);
    }
    if (collegeId && selectedCollege) {
      return String(selectedCollege.name);
    }
    return 'All Blogs';
  };

  // Get available colleges for the current university
  const availableColleges = universityId
    ? colleges.filter(college => college.universityId === universityId)
    : colleges;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Blog Management</h1>
          <p className='text-muted-foreground'>
            Manage blogs for {getContextName()}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {/* View Toggle */}
          <div className='flex items-center border rounded-lg p-1'>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('list')}
              className='h-8 px-3'
            >
              <List className='h-4 w-4 mr-1' />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('grid')}
              className='h-8 px-3'
            >
              <Grid3X3 className='h-4 w-4 mr-1' />
              Grid
            </Button>
          </div>
          <Button onClick={() => router.push('/admin/system/blogs/create')}>
            <Plus className='h-4 w-4 mr-2' />
            Create Blog
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Blogs</CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Published</CardTitle>
              <Eye className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.published}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Drafts</CardTitle>
              <EyeOff className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.draft}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Featured</CardTitle>
              <Star className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.featured}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search blogs...'
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            {/* Blog Type Filter */}
            <Select
              value={selectedBlogType}
              onValueChange={handleBlogTypeChange}
            >
              <SelectTrigger className='w-full sm:w-[200px]'>
                <SelectValue placeholder='Blog Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Blogs</SelectItem>
                <SelectItem value='university'>University Blogs</SelectItem>
                <SelectItem value='college'>College Blogs</SelectItem>
              </SelectContent>
            </Select>

            {/* Quick Filters */}
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={getPublishedBlogs}>
                <Eye className='h-4 w-4 mr-1' />
                Published
              </Button>
              <Button variant='outline' size='sm' onClick={getFeaturedBlogs}>
                <Star className='h-4 w-4 mr-1' />
                Featured
              </Button>
              <Button
                variant={queryParams.isEvent ? 'default' : 'outline'}
                size='sm'
                onClick={() =>
                  setQueryParams({ isEvent: !queryParams.isEvent })
                }
              >
                <Calendar className='h-4 w-4 mr-1' />
                Events
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as 'list' | 'stats')}
      >
        <TabsList>
          <TabsTrigger value='list'>Blog List</TabsTrigger>
          <TabsTrigger value='stats'>Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value='list' className='space-y-4'>
          {viewMode === 'list' ? (
            <BlogTable
              blogs={blogs}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              onTogglePublished={handleTogglePublished}
              universityId={universityId}
              collegeId={collegeId}
              availableColleges={availableColleges}
            />
          ) : (
            <BlogGridView
              blogs={blogs}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              onTogglePublished={handleTogglePublished}
              onReorder={handleReorder}
            />
          )}
        </TabsContent>

        <TabsContent value='stats' className='space-y-4'>
          <BlogStats stats={stats} loading={loadingStats} />
        </TabsContent>
      </Tabs>

      {/* Delete Modal */}
      <BlogDeleteModal
        isOpen={!!deletingBlog}
        onClose={() => setDeletingBlog(null)}
        blog={deletingBlog}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
