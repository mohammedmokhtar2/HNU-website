// User type will be imported when needed

// Base AuditLog interface
export interface AuditLog {
  id: string;
  action: string; // e.g., "CREATE_COLLEGE", "DELETE_USER"
  entity: string; // e.g., "College", "User", "FormSection"
  entityId?: string; // optional reference to the entity's ID
  metadata?: Record<string, any>; // any extra data to store (e.g., fields changed)
  user?: any;
  userId?: string;
  createdAt: Date;
}

// AuditLog creation input type
export interface CreateAuditLogInput {
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
  userId?: string;
}

// AuditLog response type (for API responses)
export interface AuditLogResponse {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
  userId?: string;
  createdAt: string; // ISO string for JSON serialization
}

// AuditLog with relations response type
export interface AuditLogWithRelationsResponse extends AuditLogResponse {
  user?: any;
}
