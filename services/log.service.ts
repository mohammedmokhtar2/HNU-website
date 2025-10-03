import { api } from '@/lib/axios';

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: any;
  userId?: string;
  clerkId?: string;
  sessionId?: string;
  isGuest: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  clerkUser?: {
    id: string;
    name?: string;
    email: string;
    role: string;
    imageUrl?: string;
  };
}

export interface LogQueryParams {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  userId?: string;
  clerkId?: string;
  sessionId?: string;
  isGuest?: boolean;
  startDate?: string;
  endDate?: string;
  query?: string;
}

export interface LogStats {
  totalLogs: number;
  logsByAction: Record<string, number>;
  logsByEntity: Record<string, number>;
  guestLogs: number;
  authenticatedLogs: number;
  userStats: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    count: number;
  }>;
  dailyStats: Array<{ date: string; count: number }>;
}

export interface PaginatedLogResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalCount: number;
  };
}

export class LogService {
  /**
   * Get audit logs with pagination and filtering
   */
  static async getLogs(
    params: LogQueryParams = {}
  ): Promise<PaginatedLogResponse> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await api.get(
        `/user-actions/logs?${searchParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch logs');
    }
  }

  /**
   * Search logs with text query
   */
  static async searchLogs(
    params: LogQueryParams & { query: string }
  ): Promise<PaginatedLogResponse> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await api.get(
        `/user-actions/logs/search?${searchParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error searching logs:', error);
      throw new Error(error.response?.data?.error || 'Failed to search logs');
    }
  }

  /**
   * Get log statistics
   */
  static async getLogStats(
    params: LogQueryParams = {}
  ): Promise<{ stats: LogStats }> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await api.get(
        `/user-actions/logs/stats?${searchParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching log stats:', error);
      throw new Error(
        error.response?.data?.error || 'Failed to fetch log statistics'
      );
    }
  }

  /**
   * Get a single log by ID
   */
  static async getLogById(id: string): Promise<AuditLog> {
    try {
      const response = await api.get(`/user-actions/logs/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching log by ID:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch log');
    }
  }

  /**
   * Create a new audit log
   */
  static async createLog(data: {
    action: string;
    entity?: string;
    entityId?: string;
    metadata?: any;
  }): Promise<AuditLog> {
    try {
      const response = await api.post('/user-actions/logs', data);
      return response.data.auditLog;
    } catch (error: any) {
      console.error('Error creating log:', error);
      throw new Error(error.response?.data?.error || 'Failed to create log');
    }
  }

  /**
   * Delete logs - handles both IDs and filters
   */
  static async deleteLogs(
    data: string[] | LogQueryParams
  ): Promise<{ deletedCount: number }> {
    try {
      let requestData;

      if (Array.isArray(data)) {
        // Delete by IDs
        requestData = { logIds: data };
      } else {
        // Delete by filters
        requestData = { filters: data };
      }

      const response = await api.delete('/user-actions/logs', {
        data: requestData,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error deleting logs:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete logs');
    }
  }

  /**
   * Delete all logs (admin only)
   */
  static async deleteAllLogs(): Promise<{ deletedCount: number }> {
    try {
      const response = await api.delete('/user-actions/logs', {
        data: { deleteAll: true },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error deleting all logs:', error);
      throw new Error(
        error.response?.data?.error || 'Failed to delete all logs'
      );
    }
  }

  /**
   * Export logs to CSV
   */
  static async exportLogs(params: LogQueryParams = {}): Promise<Blob> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await api.get(
        `/user-actions/logs/export?${searchParams.toString()}`,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error exporting logs:', error);
      throw new Error(error.response?.data?.error || 'Failed to export logs');
    }
  }

  /**
   * Get available actions for filtering
   */
  static async getAvailableActions(): Promise<string[]> {
    try {
      const response = await api.get('/user-actions/logs/actions');
      return response.data.actions;
    } catch (error: any) {
      console.error('Error fetching available actions:', error);
      throw new Error(
        error.response?.data?.error || 'Failed to fetch available actions'
      );
    }
  }

  /**
   * Get available entities for filtering
   */
  static async getAvailableEntities(): Promise<string[]> {
    try {
      const response = await api.get('/user-actions/logs/entities');
      return response.data.entities;
    } catch (error: any) {
      console.error('Error fetching available entities:', error);
      throw new Error(
        error.response?.data?.error || 'Failed to fetch available entities'
      );
    }
  }

  /**
   * Track a user action (for client-side tracking)
   */
  static async trackAction(action: string, metadata: any = {}): Promise<void> {
    try {
      await api.post('/user-actions/track', {
        action,
        metadata,
      });
    } catch (error: any) {
      console.error('Error tracking action:', error);
      // Don't throw error for tracking failures to avoid breaking user experience
    }
  }
}
