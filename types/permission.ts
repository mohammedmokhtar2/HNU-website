import { Action } from './enums';
// User type will be imported when needed

// Base Permission interface
export interface Permission {
  id: string;
  userId: string;
  action: Action; // e.g. VIEW, EDIT, DELETE
  resource: string; // e.g. "SECTION", "COLLAGE"
  title: string;
  user: any;
}

// Permission creation input type
export interface CreatePermissionInput {
  userId: string;
  action: Action;
  resource: string;
  title: string;
}

// Permission update input type
export interface UpdatePermissionInput {
  action?: Action;
  resource?: string;
  title?: string;
}

// Permission response type (for API responses)
export interface PermissionResponse {
  id: string;
  userId: string;
  action: Action;
  resource: string;
  title: string;
}

// Permission with relations response type
export interface PermissionWithRelationsResponse extends PermissionResponse {
  user: any;
}
