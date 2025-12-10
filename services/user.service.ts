import { api } from '@/lib/axios';
import { UserType } from '@/types/enums';
import {
  UserResponse,
  CreateUserInput,
  UpdateUserInput,
  PaginatedResponse,
} from '@/types/user';

export class UserService {
  /**
   * Get all users with pagination
   */
  static async getUsers(params?: {
    includeCollege?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<UserResponse>> {
    try {
      const res = await api.get('/users/all', { params });
      return res.data;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  /**
   * Get all users as array (for compatibility with existing code)
   */
  static async getAllUsers(params?: {
    includeCollege?: boolean;
  }): Promise<UserResponse[]> {
    try {
      const res = await api.get('/users/all', {
        params: {
          ...params,
          page: 1,
          limit: 1000, // Get all users
        },
      });
      return res.data.data || [];
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  /**
   * Get current user by Clerk ID
   */
  static async getCurrentUser(userId: string): Promise<UserResponse> {
    try {
      const res = await api.get(`/users/clerk/${userId}`);
      return res.data;
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch current user'
      );
    }
  }

  /**
   * Find or create user by Clerk ID
   */
  static async findOrCreateUser(clerkId: string): Promise<UserResponse> {
    try {
      if (!clerkId || typeof clerkId !== 'string') {
        throw new Error('Valid Clerk ID is required');
      }

      const res = await api.post('/users/find-or-create', { clerkId });
      return res.data;
    } catch (error: any) {
      console.error('Error finding or creating user:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to find or create user'
      );
    }
  }

  /**
   * Update user by ID
   */
  static async updateUser(
    userId: string,
    updates: UpdateUserInput
  ): Promise<UserResponse> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required');
      }

      const res = await api.patch(`/users/${userId}/update`, updates);
      return res.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<UserResponse> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required');
      }

      const res = await api.get(`/users/${userId}`);
      return res.data;
    } catch (error: any) {
      console.error('Error fetching user by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  /**
   * Delete user by ID
   */
  static async deleteUser(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required');
      }

      const res = await api.delete(`/users/${userId}/delete`);
      return res.data;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  /**
   * Get all super admins
   */
  static async getSuperAdmins(): Promise<UserResponse[]> {
    try {
      const res = await api.get('/users/superadmins');
      return res.data;
    } catch (error: any) {
      console.error('Error fetching super admins:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch super admins'
      );
    }
  }

  /**
   * Toggle user role
   */
  static async toggleUserRole(
    userId: string,
    role: UserType
  ): Promise<UserResponse> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required');
      }

      if (!Object.values(UserType).includes(role)) {
        throw new Error('Invalid user role');
      }

      const res = await api.patch(`/users/${userId}/toggle-role`, { role });
      return res.data;
    } catch (error: any) {
      console.error('Error toggling user role:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to toggle user role'
      );
    }
  }

  /**
   * Move user to college
   */
  static async moveUserToCollage(
    userId: string,
    collageId: string
  ): Promise<UserResponse> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required');
      }

      if (!collageId || typeof collageId !== 'string') {
        throw new Error('Valid college ID is required');
      }

      const res = await api.patch(`/users/${userId}/move-to-collage`, {
        collageId,
      });
      return res.data;
    } catch (error: any) {
      console.error('Error moving user to college:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to move user to college'
      );
    }
  }

  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserInput): Promise<UserResponse> {
    try {
      if (!userData.email || typeof userData.email !== 'string') {
        throw new Error('Valid email is required');
      }

      const res = await api.post('/users/create', userData);
      return res.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  }

  /**
   * Search users by query
   */
  static async searchUsers(
    query: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<UserResponse>> {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Valid search query is required');
      }

      const res = await api.get('/users/search', {
        params: {
          q: query,
          ...params,
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Error searching users:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to search users'
      );
    }
  }
}
