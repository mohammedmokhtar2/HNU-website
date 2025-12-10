import { AuditLog } from './audit';
import { College } from './college';
import { UserType } from './enums';
import { Permission } from './permission';

// Base User interface
export interface User {
  id: string;
  clerkId?: string;
  name?: string;
  email: string;
  role: UserType;
  image?: string;
  auditLogs?: AuditLog[];
  permissions?: Permission[];
  College?: College;
  collegeId?: string;
  collegesCreated?: College[];
  createdAt: Date;
  updatedAt: Date;
}

// User creation input type
export interface CreateUserInput {
  clerkId?: string;
  name?: string;
  email: string;
  role?: UserType;
  image?: string;
  collegeId?: string;
}

// User update input type
export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserType;
  image?: string;
  collegeId?: string;
}

// User response type (for API responses)
export interface UserResponse {
  id: string;
  clerkId?: string;
  name?: string;
  email: string;
  role: UserType;
  image?: string;
  collegeId?: string;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// User with relations response type
export interface UserWithRelationsResponse extends UserResponse {
  auditLogs?: AuditLog[];
  permissions?: Permission[];
  College?: College;
  collegesCreated?: College[];
}

// API Error response type
export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

// Pagination response type
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
