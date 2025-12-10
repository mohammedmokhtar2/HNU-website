import { api } from '@/lib/axios';
import {
  BlogResponse,
  BlogWithRelationsResponse,
  CreateBlogInput,
  UpdateBlogInput,
  BlogQueryParams,
  PaginatedBlogResponse,
  BlogStats,
} from '@/types/blog';

export class BlogService {
  /**
   * Get all blogs with pagination and filtering
   */
  static async getBlogs(
    params?: BlogQueryParams
  ): Promise<PaginatedBlogResponse> {
    try {
      const res = await api.get('/blogs', { params });
      return res.data;
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }

  /**
   * Get all blogs as array (for compatibility with existing code)
   */
  static async getAllBlogs(
    params?: Omit<BlogQueryParams, 'page' | 'limit'>
  ): Promise<BlogResponse[]> {
    try {
      const res = await api.get('/blogs', {
        params: {
          ...params,
          page: 1,
          limit: 1000, // Get all blogs
        },
      });
      return res.data.data || [];
    } catch (error: any) {
      console.error('Error fetching all blogs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }

  /**
   * Get blog by ID
   */
  static async getBlogById(blogId: string): Promise<BlogWithRelationsResponse> {
    try {
      if (!blogId || typeof blogId !== 'string') {
        throw new Error('Valid blog ID is required');
      }

      const res = await api.get(`/blogs/${blogId}`);
      return res.data;
    } catch (error: any) {
      console.error('Error fetching blog by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch blog');
    }
  }

  /**
   * Get blog by slug
   */
  static async getBlogBySlug(slug: string): Promise<BlogWithRelationsResponse> {
    try {
      if (!slug || typeof slug !== 'string') {
        throw new Error('Valid slug is required');
      }

      const res = await api.get(`/blogs/slug/${slug}`);
      return res.data;
    } catch (error: any) {
      console.error('Error fetching blog by slug:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch blog');
    }
  }

  /**
   * Create a new blog
   */
  static async createBlog(blogData: CreateBlogInput): Promise<BlogResponse> {
    try {
      if (!blogData.title || !blogData.content || !blogData.slug) {
        throw new Error('Title, content, and slug are required');
      }

      const res = await api.post('/blogs', blogData);
      return res.data;
    } catch (error: any) {
      console.error('Error creating blog:', error);
      throw new Error(error.response?.data?.message || 'Failed to create blog');
    }
  }

  /**
   * Update blog by ID
   */
  static async updateBlog(
    blogId: string,
    updates: UpdateBlogInput
  ): Promise<BlogResponse> {
    try {
      if (!blogId || typeof blogId !== 'string') {
        throw new Error('Valid blog ID is required');
      }

      const res = await api.patch(`/blogs/${blogId}`, updates);
      return res.data;
    } catch (error: any) {
      console.error('Error updating blog:', error);
      throw new Error(error.response?.data?.message || 'Failed to update blog');
    }
  }

  /**
   * Delete blog by ID
   */
  static async deleteBlog(
    blogId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!blogId || typeof blogId !== 'string') {
        throw new Error('Valid blog ID is required');
      }

      const res = await api.delete(`/blogs/${blogId}`);
      return res.data;
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete blog');
    }
  }

  /**
   * Get published blogs
   */
  static async getPublishedBlogs(
    params?: Omit<BlogQueryParams, 'isPublished'>
  ): Promise<PaginatedBlogResponse> {
    try {
      const res = await api.get('/blogs/published', {
        params: {
          ...params,
          isPublished: true,
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Error fetching published blogs:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch published blogs'
      );
    }
  }

  /**
   * Get featured blogs
   */
  static async getFeaturedBlogs(
    params?: Omit<BlogQueryParams, 'isFeatured'>
  ): Promise<PaginatedBlogResponse> {
    try {
      const res = await api.get('/blogs/featured', {
        params: {
          ...params,
          isFeatured: true,
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Error fetching featured blogs:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch featured blogs'
      );
    }
  }

  /**
   * Get blogs by university
   */
  static async getBlogsByUniversity(
    universityId: string,
    params?: Omit<BlogQueryParams, 'universityId'>
  ): Promise<PaginatedBlogResponse> {
    try {
      if (!universityId || typeof universityId !== 'string') {
        throw new Error('Valid university ID is required');
      }

      const res = await api.get(`/blogs/university/${universityId}`, {
        params: {
          ...params,
          universityId,
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Error fetching blogs by university:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch blogs by university'
      );
    }
  }

  /**
   * Get blogs by college
   */
  static async getBlogsByCollege(
    collageId: string,
    params?: Omit<BlogQueryParams, 'collageId'>
  ): Promise<PaginatedBlogResponse> {
    try {
      if (!collageId || typeof collageId !== 'string') {
        throw new Error('Valid college ID is required');
      }

      const res = await api.get(`/blogs/college/${collageId}`, {
        params: {
          ...params,
          collageId,
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Error fetching blogs by college:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch blogs by college'
      );
    }
  }

  /**
   * Get blogs by author
   */
  static async getBlogsByAuthor(
    createdById: string,
    params?: Omit<BlogQueryParams, 'createdById'>
  ): Promise<PaginatedBlogResponse> {
    try {
      if (!createdById || typeof createdById !== 'string') {
        throw new Error('Valid author ID is required');
      }

      const res = await api.get(`/blogs/author/${createdById}`, {
        params: {
          ...params,
          createdById,
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Error fetching blogs by author:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch blogs by author'
      );
    }
  }

  /**
   * Search blogs by query
   */
  static async searchBlogs(
    query: string,
    params?: Omit<BlogQueryParams, 'search'>
  ): Promise<PaginatedBlogResponse> {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Valid search query is required');
      }

      const res = await api.get('/blogs/search', {
        params: {
          q: query,
          ...params,
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Error searching blogs:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to search blogs'
      );
    }
  }

  /**
   * Get blogs by tags
   */
  static async getBlogsByTags(
    tags: string[],
    params?: Omit<BlogQueryParams, 'tags'>
  ): Promise<PaginatedBlogResponse> {
    try {
      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        throw new Error('Valid tags array is required');
      }

      const res = await api.get('/blogs/tags', {
        params: {
          tags: tags.join(','),
          ...params,
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Error fetching blogs by tags:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch blogs by tags'
      );
    }
  }

  /**
   * Toggle blog featured status
   */
  static async toggleFeatured(blogId: string): Promise<BlogResponse> {
    try {
      if (!blogId || typeof blogId !== 'string') {
        throw new Error('Valid blog ID is required');
      }

      const res = await api.patch(`/blogs/${blogId}/toggle-featured`);
      return res.data;
    } catch (error: any) {
      console.error('Error toggling blog featured status:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to toggle featured status'
      );
    }
  }

  /**
   * Toggle blog published status
   */
  static async togglePublished(blogId: string): Promise<BlogResponse> {
    try {
      if (!blogId || typeof blogId !== 'string') {
        throw new Error('Valid blog ID is required');
      }

      const res = await api.patch(`/blogs/${blogId}/toggle-published`);
      return res.data;
    } catch (error: any) {
      console.error('Error toggling blog published status:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to toggle published status'
      );
    }
  }

  /**
   * Get blog statistics
   */
  static async getBlogStats(): Promise<BlogStats> {
    try {
      const res = await api.get('/blogs/stats');
      return res.data;
    } catch (error: any) {
      console.error('Error fetching blog statistics:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch blog statistics'
      );
    }
  }

  /**
   * Reorder blogs
   */
  static async reorderBlogs(
    blogIds: string[]
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!blogIds || !Array.isArray(blogIds) || blogIds.length === 0) {
        throw new Error('Valid blog IDs array is required');
      }

      const res = await api.patch('/blogs/reorder', { blogIds });
      return res.data;
    } catch (error: any) {
      console.error('Error reordering blogs:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to reorder blogs'
      );
    }
  }
}
