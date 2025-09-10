// Section and College types will be imported when needed

import { College } from "./college";
import { Section } from "./section";

// Base University interface
export interface University {
  id: string;
  name: Record<string, any>;
  slug: string;
  sections?: Section[];
  colleges?: College[];
  config?: Record<string, any>; // JSON config for logo and social media links
  createdAt: Date;
  updatedAt: Date;
}

// University creation input type
export interface CreateUniversityInput {
  name: Record<string, any>;
  slug: string;
  config?: Record<string, any>;
}

// University update input type
export interface UpdateUniversityInput {
  name?: Record<string, any>;
  slug?: string;
  config?: Record<string, any>;
}

// University response type (for API responses)
export interface UniversityResponse {
  id: string;
  name: Record<string, any>;
  slug: string;
  config?: Record<string, any>;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// University with relations response type
export interface UniversityWithRelationsResponse extends UniversityResponse {
  sections?: any[]; // Will be properly typed when imported
  colleges?: any[]; // Will be properly typed when imported
}
