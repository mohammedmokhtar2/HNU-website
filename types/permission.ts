import { Action } from './enums';

// Base Permission interface
export interface Permission {
  id: string;
  userId: string;
  resource: string;
  action: Action;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// Permission creation input type
export interface CreatePermissionInput {
  userId: string;
  resource: string;
  action: Action;
  title: string;
  description?: string;
  isActive?: boolean;
  metadata?: any;
}

// Permission update input type
export interface UpdatePermissionInput {
  resource?: string;
  action?: Action;
  title?: string;
  description?: string;
  isActive?: boolean;
  metadata?: any;
}

// Permission Template interface
export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  resource: string;
  actions: Action[];
  category?: string;
  icon?: string;
  path?: string;
  order: number;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// Permission Template creation input type
export interface CreatePermissionTemplateInput {
  name: string;
  description: string;
  resource: string;
  actions: Action[];
  category?: string;
  icon?: string;
  path?: string;
  order?: number;
}

// Permission Template update input type
export interface UpdatePermissionTemplateInput {
  name?: string;
  description?: string;
  resource?: string;
  actions?: Action[];
  category?: string;
  icon?: string;
  path?: string;
  order?: number;
}

// Permission analysis response type
export interface PermissionAnalysis {
  totalPermissions: number;
  activePermissions: number;
  inactivePermissions: number;
  permissionsByResource: Record<string, number>;
  permissionsByAction: Record<string, number>;
}

// Available resources response type
export interface AvailableResources {
  resources: string[];
  actions: Action[];
  categories: string[];
}

// Permission response type (for API responses)
export interface PermissionResponse {
  id: string;
  userId: string;
  resource: string;
  action: Action;
  title: string;
  description?: string;
  isActive: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

// Permission with relations response type
export interface PermissionWithRelationsResponse extends PermissionResponse {
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}
