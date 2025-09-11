import { api } from '@/lib/axios';
import type {
  Permission,
  CreatePermissionInput,
  UpdatePermissionInput,
  PermissionTemplate,
  CreatePermissionTemplateInput,
  UpdatePermissionTemplateInput,
} from '@/types/permission';
import { Action } from '@/types/enums';

export class PermissionService {
  // Permission CRUD operations
  static async getPermissions(userId?: string): Promise<Permission[]> {
    const params = userId ? { userId } : {};
    const response = await api.get('/permissions', { params });
    return response.data.permissions || [];
  }

  static async getPermissionById(id: string): Promise<Permission> {
    const response = await api.get(`/permissions/${id}`);
    return response.data.permission;
  }

  static async createPermission(
    data: CreatePermissionInput
  ): Promise<Permission> {
    const response = await api.post('/permissions', data);
    return response.data.permission;
  }

  static async updatePermission(
    id: string,
    data: UpdatePermissionInput
  ): Promise<Permission> {
    const response = await api.put(`/permissions/${id}`, data);
    return response.data.permission;
  }

  static async deletePermission(id: string): Promise<void> {
    await api.delete(`/permissions/${id}`);
  }

  static async togglePermission(
    id: string,
    isActive: boolean
  ): Promise<Permission> {
    const response = await api.patch(`/permissions/${id}/toggle`, { isActive });
    return response.data.permission;
  }

  // Permission Template CRUD operations
  static async getPermissionTemplates(): Promise<PermissionTemplate[]> {
    const response = await api.get('/permission-templates');
    return response.data.templates || [];
  }

  static async getPermissionTemplateById(
    id: string
  ): Promise<PermissionTemplate> {
    const response = await api.get(`/permission-templates/${id}`);
    return response.data.template;
  }

  static async createPermissionTemplate(
    data: CreatePermissionTemplateInput
  ): Promise<PermissionTemplate> {
    const response = await api.post('/permission-templates', data);
    return response.data.template;
  }

  static async updatePermissionTemplate(
    id: string,
    data: UpdatePermissionTemplateInput
  ): Promise<PermissionTemplate> {
    const response = await api.put(`/permission-templates/${id}`, data);
    return response.data.template;
  }

  static async deletePermissionTemplate(id: string): Promise<void> {
    await api.delete(`/permission-templates/${id}`);
  }

  // Bulk operations
  static async assignPermissionsToUser(
    userId: string,
    permissions: CreatePermissionInput[]
  ): Promise<Permission[]> {
    const response = await api.post('/permissions/bulk-assign', {
      userId,
      permissions,
    });
    return response.data.permissions;
  }

  static async removeAllPermissionsFromUser(userId: string): Promise<void> {
    await api.delete(`/permissions/user/${userId}`);
  }

  static async copyPermissionsFromUser(
    fromUserId: string,
    toUserId: string
  ): Promise<Permission[]> {
    const response = await api.post('/permissions/copy', {
      fromUserId,
      toUserId,
    });
    return response.data.permissions;
  }

  // Permission analysis
  static async getPermissionAnalysis(userId: string): Promise<{
    totalPermissions: number;
    activePermissions: number;
    inactivePermissions: number;
    permissionsByResource: Record<string, number>;
    permissionsByAction: Record<string, number>;
  }> {
    const response = await api.get(`/permissions/analysis/${userId}`);
    return response.data.analysis;
  }

  // Auto-generate permissions from templates
  static async generatePermissionsFromTemplate(
    userId: string,
    templateId: string
  ): Promise<Permission[]> {
    const response = await api.post('/permissions/generate-from-template', {
      userId,
      templateId,
    });
    return response.data.permissions;
  }

  // Get available resources and actions
  static async getAvailableResources(): Promise<{
    resources: string[];
    actions: Action[];
    categories: string[];
  }> {
    const response = await api.get('/permissions/available');
    return response.data;
  }

  // Search permissions
  static async searchPermissions(
    query: string,
    filters?: {
      userId?: string;
      resource?: string;
      action?: Action;
      isActive?: boolean;
    }
  ): Promise<Permission[]> {
    const response = await api.get('/permissions/search', {
      params: { query, ...filters },
    });
    return response.data.permissions || [];
  }
}
