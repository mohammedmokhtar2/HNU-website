import { PageSectionType } from './enums';
import { College } from './college';

// Base Page interface
export interface Page {
  id: string;
  title: Record<string, any>; // JSON for multilingual titles
  slug: string;
  config?: Record<string, any>; // JSON for page configuration
  createdAt: Date;
  updatedAt: Date;
  universityId?: string;
  collageId?: string;
  collage?: College; // Will be properly typed when imported
  isActive?: boolean; // Added for UI management
  order?: number; // Added for ordering
}

// Page creation input type
export interface CreatePageInput {
  title: Record<string, any>;
  slug: string;
  config?: Record<string, any>;
  isActive?: boolean;
  collageId?: string;
  universityId?: string;
}

// Page update input type
export interface UpdatePageInput {
  title?: Record<string, any>;
  slug?: string;
  config?: Record<string, any>;
  isActive?: boolean;
  collageId?: string;
  universityId?: string;
  order?: number;
}

// Page response type (for API responses)
export interface PageResponse {
  id: string;
  type: PageSectionType;
  title: Record<string, any>;
  content: Record<string, any>;
  config?: Record<string, any>;
  isActive: boolean;
  slug: string;
  collageId?: string;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// Page with relations response type
export interface PageWithRelationsResponse extends PageResponse {
  collage?: College; // Will be properly typed when imported
}
