import { UserType } from './enums';

// Base User interface
export interface User {
  id: string;
  clerkId?: string;
  name?: string;
  email: string;
  role: UserType;
  image?: string;
  auditLogs?: any[];
  permissions?: any[];
  College?: any[];
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
}

// User update input type
export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserType;
  image?: string;
}

// User response type (for API responses)
export interface UserResponse {
  id: string;
  clerkId?: string;
  name?: string;
  email: string;
  role: UserType;
  image?: string;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// User with relations response type
export interface UserWithRelationsResponse extends UserResponse {
  auditLogs?: any[];
  permissions?: any[];
  College?: any[];
}  updatedAt: Date;


// User creation input type
export interface CreateUserInput {
  clerkId?: string;
  name?: string;
  email: string;
  role?: UserType;
  image?: string;
}

// User update input type
export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserType;
  image?: string;
}

// User response type (for API responses)
export interface UserResponse {
  id: string;
  clerkId?: string;
  name?: string;
  email: string;
  role: UserType;
  image?: string;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// User with relations response type
export interface UserWithRelationsResponse extends UserResponse {
  auditLogs?: any[];
  permissions?: any[];
  College?: any[];
}
