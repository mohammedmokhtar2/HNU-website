import { Action } from './enums';

// Base Permission interface
export interface Permission {
  id: string;
  userId: string;
  action: Action;
  resource: string; // e.g., "SECTION", "COLLAGE"
  title: string;
  description?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  user?: any; // Will be properly typed when imported
}

// Permission creation input type
export interface CreatePermissionInput {
  userId: string;
  action: Action;
  resource: string;
  title: string;
  description?: string;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

// Permission update input type
export interface UpdatePermissionInput {
  action?: Action;
  resource?: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

// Permission response type (for API responses)
export interface PermissionResponse {
  id: string;
  userId: string;
  action: Action;
  resource: string;
  title: string;
  description?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// Permission with relations response type
export interface PermissionWithRelationsResponse extends PermissionResponse {
  user?: any; // Will be properly typed when imported
}
