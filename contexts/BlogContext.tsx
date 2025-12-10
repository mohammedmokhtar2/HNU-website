'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogService } from '@/services/blog.service';
import {
  Blog,
  BlogWithRelations,
  CreateBlogInput,
  UpdateBlogInput,
  BlogQueryParams,
  PaginatedBlogResponse,
  BlogStats,
} from '@/types/blog';

interface BlogContextType {
  // Data
  blogs: BlogWithRelations[];
  paginatedBlogs: PaginatedBlogResponse | null;
  currentBlog: BlogWithRelations | null;
  stats: BlogStats | null;

  // Loading states
  loading: boolean;
  loadingStats: boolean;
  isInitialLoad: boolean;

  // Error states
  error: string | null;

  // Query parameters
  queryParams: BlogQueryParams;
  setQueryParams: (params: Partial<BlogQueryParams>) => void;

  // Actions
  refetch: () => Promise<any>;
  refetchStats: () => Promise<any>;
  getBlogById: (id: string) => Promise<BlogWithRelations | null>;
  getBlogBySlug: (slug: string) => Promise<BlogWithRelations | null>;
  createBlog: (data: CreateBlogInput) => Promise<Blog>;
  updateBlog: (id: string, data: UpdateBlogInput) => Promise<Blog>;
  deleteBlog: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<Blog>;
  togglePublished: (id: string) => Promise<Blog>;
  reorderBlogs: (blogIds: string[]) => Promise<void>;

  // Search and filtering
  searchBlogs: (query: string) => Promise<void>;
  getBlogsByUniversity: (universityId: string) => Promise<void>;
  getBlogsByCollege: (collegeId: string) => Promise<void>;
  getBlogsByAuthor: (authorId: string) => Promise<void>;
  getBlogsByTags: (tags: string[]) => Promise<void>;
  getPublishedBlogs: () => Promise<void>;
  getFeaturedBlogs: () => Promise<void>;

  // Clear functions
  clearCurrentBlog: () => void;
  clearError: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

interface BlogProviderProps {
  children: ReactNode;
  initialParams?: Partial<BlogQueryParams>;
}

// Query keys
const BLOGS_QUERY_KEY = 'blogs';
const BLOG_STATS_QUERY_KEY = 'blog-stats';

export function BlogProvider({
  children,
  initialParams = {},
}: BlogProviderProps) {
  const queryClient = useQueryClient();

  // State
  const [currentBlog, setCurrentBlog] = useState<BlogWithRelations | null>(
    null
  );
  const [queryParams, setQueryParamsState] = useState<BlogQueryParams>({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    orderDirection: 'desc',
    ...initialParams,
  });
  const [error, setError] = useState<string | null>(null);

  // Set query parameters
  const setQueryParams = useCallback((params: Partial<BlogQueryParams>) => {
    setQueryParamsState(prev => ({ ...prev, ...params }));
  }, []);

  // Main blogs query
  const {
    data: paginatedBlogs,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [BLOGS_QUERY_KEY, queryParams],
    queryFn: () => BlogService.getBlogs(queryParams),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Blog stats query
  const {
    data: stats,
    isLoading: loadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: [BLOG_STATS_QUERY_KEY],
    queryFn: () => BlogService.getBlogStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Extract blogs from paginated response
  const blogs = useMemo(() => paginatedBlogs?.data || [], [paginatedBlogs]);

  // Check if this is initial load
  const isInitialLoad = loading && !paginatedBlogs;

  // Set error from query
  useEffect(() => {
    if (queryError) {
      setError(
        queryError instanceof Error ? queryError.message : 'An error occurred'
      );
    }
  }, [queryError]);

  // Get blog by ID
  const getBlogById = useCallback(
    async (id: string): Promise<BlogWithRelations | null> => {
      try {
        const blog = await BlogService.getBlogById(id);
        setCurrentBlog(blog);
        return blog;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog');
        return null;
      }
    },
    []
  );

  // Get blog by slug
  const getBlogBySlug = useCallback(
    async (slug: string): Promise<BlogWithRelations | null> => {
      try {
        const blog = await BlogService.getBlogBySlug(slug);
        setCurrentBlog(blog);
        return blog;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog');
        return null;
      }
    },
    []
  );

  // Create blog mutation
  const createBlogMutation = useMutation({
    mutationFn: (data: CreateBlogInput) => BlogService.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BLOG_STATS_QUERY_KEY] });
      setError(null);
    },
    onError: err => {
      setError(err instanceof Error ? err.message : 'Failed to create blog');
    },
  });

  // Update blog mutation
  const updateBlogMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogInput }) =>
      BlogService.updateBlog(id, data),
    onSuccess: updatedBlog => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BLOG_STATS_QUERY_KEY] });
      setCurrentBlog(updatedBlog);
      setError(null);
    },
    onError: err => {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
    },
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: (id: string) => BlogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BLOG_STATS_QUERY_KEY] });
      setCurrentBlog(null);
      setError(null);
    },
    onError: err => {
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => BlogService.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BLOG_STATS_QUERY_KEY] });
      setError(null);
    },
    onError: err => {
      setError(
        err instanceof Error ? err.message : 'Failed to toggle featured status'
      );
    },
  });

  // Toggle published mutation
  const togglePublishedMutation = useMutation({
    mutationFn: (id: string) => BlogService.togglePublished(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BLOG_STATS_QUERY_KEY] });
      setError(null);
    },
    onError: err => {
      setError(
        err instanceof Error ? err.message : 'Failed to toggle published status'
      );
    },
  });

  // Reorder blogs mutation
  const reorderBlogsMutation = useMutation({
    mutationFn: (blogIds: string[]) => BlogService.reorderBlogs(blogIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY_KEY] });
      setError(null);
    },
    onError: err => {
      setError(err instanceof Error ? err.message : 'Failed to reorder blogs');
    },
  });

  // Action functions
  const createBlog = useCallback(
    async (data: CreateBlogInput): Promise<Blog> => {
      return await createBlogMutation.mutateAsync(data);
    },
    [createBlogMutation]
  );

  const updateBlog = useCallback(
    async (id: string, data: UpdateBlogInput): Promise<Blog> => {
      return await updateBlogMutation.mutateAsync({ id, data });
    },
    [updateBlogMutation]
  );

  const deleteBlog = useCallback(
    async (id: string): Promise<void> => {
      await deleteBlogMutation.mutateAsync(id);
    },
    [deleteBlogMutation]
  );

  const toggleFeatured = useCallback(
    async (id: string): Promise<Blog> => {
      return await toggleFeaturedMutation.mutateAsync(id);
    },
    [toggleFeaturedMutation]
  );

  const togglePublished = useCallback(
    async (id: string): Promise<Blog> => {
      return await togglePublishedMutation.mutateAsync(id);
    },
    [togglePublishedMutation]
  );

  const reorderBlogs = useCallback(
    async (blogIds: string[]): Promise<void> => {
      await reorderBlogsMutation.mutateAsync(blogIds);
    },
    [reorderBlogsMutation]
  );

  // Search and filtering functions
  const searchBlogs = useCallback(
    async (query: string): Promise<void> => {
      setQueryParams({ search: query, page: 1 });
    },
    [setQueryParams]
  );

  const getBlogsByUniversity = useCallback(
    async (universityId: string): Promise<void> => {
      setQueryParams({ universityId, page: 1 });
    },
    [setQueryParams]
  );

  const getBlogsByCollege = useCallback(
    async (collegeId: string): Promise<void> => {
      setQueryParams({ collageId: collegeId, page: 1 });
    },
    [setQueryParams]
  );

  const getBlogsByAuthor = useCallback(
    async (authorId: string): Promise<void> => {
      setQueryParams({ createdById: authorId, page: 1 });
    },
    [setQueryParams]
  );

  const getBlogsByTags = useCallback(
    async (tags: string[]): Promise<void> => {
      setQueryParams({ tags, page: 1 });
    },
    [setQueryParams]
  );

  const getPublishedBlogs = useCallback(async (): Promise<void> => {
    setQueryParams({ isPublished: true, page: 1 });
  }, [setQueryParams]);

  const getFeaturedBlogs = useCallback(async (): Promise<void> => {
    setQueryParams({ isFeatured: true, page: 1 });
  }, [setQueryParams]);

  // Clear functions
  const clearCurrentBlog = useCallback(() => {
    setCurrentBlog(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: BlogContextType = useMemo(
    () => ({
      // Data
      blogs,
      paginatedBlogs: paginatedBlogs || null,
      currentBlog,
      stats: stats || null,

      // Loading states
      loading,
      loadingStats,
      isInitialLoad,

      // Error states
      error,

      // Query parameters
      queryParams,
      setQueryParams,

      // Actions
      refetch,
      refetchStats,
      getBlogById,
      getBlogBySlug,
      createBlog,
      updateBlog,
      deleteBlog,
      toggleFeatured,
      togglePublished,
      reorderBlogs,

      // Search and filtering
      searchBlogs,
      getBlogsByUniversity,
      getBlogsByCollege,
      getBlogsByAuthor,
      getBlogsByTags,
      getPublishedBlogs,
      getFeaturedBlogs,

      // Clear functions
      clearCurrentBlog,
      clearError,
    }),
    [
      blogs,
      paginatedBlogs,
      currentBlog,
      stats,
      loading,
      loadingStats,
      isInitialLoad,
      error,
      queryParams,
      setQueryParams,
      refetch,
      refetchStats,
      getBlogById,
      getBlogBySlug,
      createBlog,
      updateBlog,
      deleteBlog,
      toggleFeatured,
      togglePublished,
      reorderBlogs,
      searchBlogs,
      getBlogsByUniversity,
      getBlogsByCollege,
      getBlogsByAuthor,
      getBlogsByTags,
      getPublishedBlogs,
      getFeaturedBlogs,
      clearCurrentBlog,
      clearError,
    ]
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}

// Convenience hooks
export const useBlogs = () => {
  const { blogs, loading, error } = useBlog();
  return { blogs, loading, error };
};

export const useBlogStats = () => {
  const { stats, loadingStats, refetchStats } = useBlog();
  return { stats, loadingStats, refetchStats };
};

export const useCurrentBlog = () => {
  const { currentBlog, getBlogById, getBlogBySlug, clearCurrentBlog } =
    useBlog();
  return { currentBlog, getBlogById, getBlogBySlug, clearCurrentBlog };
};

export const useBlogMutations = () => {
  const {
    createBlog,
    updateBlog,
    deleteBlog,
    toggleFeatured,
    togglePublished,
    reorderBlogs,
  } = useBlog();
  return {
    createBlog,
    updateBlog,
    deleteBlog,
    toggleFeatured,
    togglePublished,
    reorderBlogs,
  };
};

export const useBlogFilters = () => {
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
  } = useBlog();
  return {
    queryParams,
    setQueryParams,
    searchBlogs,
    getBlogsByUniversity,
    getBlogsByCollege,
    getBlogsByAuthor,
    getBlogsByTags,
    getPublishedBlogs,
    getFeaturedBlogs,
  };
};
