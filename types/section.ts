import { SectionType } from './enums';
// College and University types will be imported when needed

// Base Section interface
export interface Section {
  id: string;
  type: SectionType;
  title?: Record<string, any>; // JSON for multilingual titles
  content?: Record<string, any>; // JSON for flexible content (paragraphs, numbers, etc.)
  mediaUrl?: string; // Image or video URL
  order: number; // Section order on the page
  collageId?: string; // If section belongs to a specific college
  collage?: any; // Will be properly typed when imported
  universityId?: string;
  University?: any; // Will be properly typed when imported
  createdAt: Date;
  updatedAt: Date;
}

// Section creation input type
export interface CreateSectionInput {
  type: SectionType;
  title?: Record<string, any>;
  content?: Record<string, any>;
  mediaUrl?: string;
  order: number;
  collageId?: string;
  universityId?: string;
}

// Section update input type
export interface UpdateSectionInput {
  type?: SectionType;
  title?: Record<string, any>;
  content?: Record<string, any>;
  mediaUrl?: string;
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
  mediaUrl?: string;
  order: number;
  collageId?: string;
  universityId?: string;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// Section with relations response type
export interface SectionWithRelationsResponse extends SectionResponse {
  collage?: any; // Will be properly typed when imported
  University?: any; // Will be properly typed when imported
}
