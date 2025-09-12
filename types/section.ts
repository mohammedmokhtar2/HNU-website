import { College } from './college';
import { SectionType } from './enums';
import { University } from './university';
// College and University types will be imported when needed

// Base Section interface
export interface Section {
  id: string;
  type: SectionType;
  title?: Record<string, any>; // JSON for multilingual titles
  content?: Record<string, any>; // JSON for flexible content (paragraphs, numbers, etc.)
  mediaUrl?: Record<string, any>; // JSON for image or video URL
  order: number; // Section order on the page
  collageId?: string; // If section belongs to a specific college
  collage?: College; // Will be properly typed when imported
  universityId?: string;
  University?: University; // Will be properly typed when imported
  createdAt: Date;
  updatedAt: Date;
}

// Section creation input type
export interface CreateSectionInput {
  type: SectionType;
  title?: Record<string, any>;
  content?: Record<string, any>;
  mediaUrl?: Record<string, any>;
  order: number;
  collageId?: string;
  universityId?: string;
}

// Section update input type
export interface UpdateSectionInput {
  type?: SectionType;
  title?: Record<string, any>;
  content?: Record<string, any>;
  mediaUrl?: Record<string, any>;
  order?: number;
  collageId?: string;
  universityId?: string;
}

// Section response type (for API responses)
export interface SectionResponse {
  id: string;
  type: SectionType;
  title?: Record<string, any>;
  content?: Record<string, any>;
  mediaUrl?: Record<string, any>;
  order: number;
  collageId?: string;
  universityId?: string;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// Section with relations response type
export interface SectionWithRelationsResponse extends SectionResponse {
  collage?: College; // Will be properly typed when imported
  University?: University; // Will be properly typed when imported
}
