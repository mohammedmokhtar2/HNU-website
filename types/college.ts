import { CollegeType } from './enums';
// User, Section, Statistic, and University types will be imported when needed

// Base College interface
export interface College {
  id: string;
  slug: string;
  name: Record<string, any>;
  config?: Record<string, any>; // JSON config for logo and social media links
  type: CollegeType;
  User?: any[]; // Will be properly typed when imported
  sections?: any[]; // Will be properly typed when imported
  statistics?: any[]; // Will be properly typed when imported
  universityId?: string;
  University?: any; // Will be properly typed when imported
  createdAt: Date;
  updatedAt: Date;
}

// College creation input type
export interface CreateCollegeInput {
  slug: string;
  name: Record<string, any>;
  config?: Record<string, any>;
  type: CollegeType;
  universityId?: string;
}

// College update input type
export interface UpdateCollegeInput {
  slug?: string;
  name?: Record<string, any>;
  config?: Record<string, any>;
  type?: CollegeType;
  universityId?: string;
}

// College response type (for API responses)
export interface CollegeResponse {
  id: string;
  slug: string;
  name: Record<string, any>;
  config?: Record<string, any>;
  type: CollegeType;
  universityId?: string;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// College with relations response type
export interface CollegeWithRelationsResponse extends CollegeResponse {
  User?: any[]; // Will be properly typed when imported
  sections?: any[]; // Will be properly typed when imported
  statistics?: any[]; // Will be properly typed when imported
  University?: any; // Will be properly typed when imported
}
