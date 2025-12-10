import { College } from '@prisma/client';

export interface ProgramConfig {
  duration?: string;
  credits?: number;
  degree?: string;
  images?: string[];
  videos?: string[];
  pdfs?: string[]; // for the لوايح بتاعت كل قسم
  links?: {
    title: string;
    href: string;
  }[];
  [key: string]: any; // Add index signature for JSON compatibility
}

// Base Program type from Prisma
export interface Program {
  id: string;
  name: Record<string, any>; // JSON field for multilingual names
  description?: Record<string, any>; // JSON field for multilingual descriptions
  config?: ProgramConfig; // JSON field for additional configuration
  collageId?: string | null;
  collage?: College | null;
  createdAt: Date;
  updatedAt: Date;
}

// Program with relations
export interface ProgramWithRelations extends Program {
  collage?: College | null;
}

// Input types for creating programs
export interface CreateProgramInput {
  name: Record<string, any>;
  description?: Record<string, any>;
  config?: ProgramConfig;
  collageId?: string | null;
}

// Input types for updating programs
export interface UpdateProgramInput {
  name?: Record<string, any>;
  description?: Record<string, any>;
  config?: ProgramConfig;
  collageId?: string | null;
}

// Response types
export type ProgramResponse = Program;

export type ProgramWithRelationsResponse = ProgramWithRelations;

// Query parameters for filtering programs
export interface ProgramQueryParams {
  page?: number;
  limit?: number;
  collageId?: string;
  search?: string;
  orderBy?: 'createdAt' | 'updatedAt' | 'name';
  orderDirection?: 'asc' | 'desc';
}

// Paginated response for programs
export interface PaginatedProgramResponse {
  data: ProgramResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Program statistics
export interface ProgramStats {
  total: number;
  byCollege: Array<{
    collageId: string;
    collageName: string;
    count: number;
  }>;
}
