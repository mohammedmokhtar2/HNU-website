import { PageType } from './enums';
import { College } from './college';

// Base Page interface
export interface Page {
  id: string;
  type: PageType;
  title: Record<string, any>; // JSON for multilingual titles
  content: Record<string, any>; // JSON for page content
  config?: Record<string, any>; // JSON for page configuration
  isActive: boolean;
  slug: string;
  collageId?: string;
  collage?: College; // Will be properly typed when imported
  createdAt: Date;
  updatedAt: Date;
}

// Page creation input type
export interface CreatePageInput {
  type: PageType;
  title: Record<string, any>;
  content: Record<string, any>;
  config?: Record<string, any>;
  isActive?: boolean;
  slug: string;
  collageId?: string;
}

// Page update input type
export interface UpdatePageInput {
  type?: PageType;
  title?: Record<string, any>;
  content?: Record<string, any>;
  config?: Record<string, any>;
  isActive?: boolean;
  slug?: string;
  collageId?: string;
}

// Page response type (for API responses)
export interface PageResponse {
  id: string;
  type: PageType;
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
