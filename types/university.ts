// Section and College types will be imported when needed

import { College } from './college';
import { Section } from './section';

// Base University interface
export interface University {
  id: string;
  name: Record<string, any>;
  slug: string;
  sections?: Section[];
  colleges?: College[];
  config?: UniversityConfig; // JSON config for logo and social media links
  createdAt: Date;
  updatedAt: Date;
}

export interface UniversityConfig {
  logo: string;
  socialMedia: {
    [key: string]: string;
  };
  menuBuilder?: {
    menuItems: {
      title: string;
      href: string;
      submenu?: {
        title: string;
        href: string;
      }[];
    }[];
  };
}

// University creation input type
export interface CreateUniversityInput {
  name: Record<string, any>;
  slug: string;
  config?: UniversityConfig;
}

// University update input type
export interface UpdateUniversityInput {
  name?: Record<string, any>;
  slug?: string;
  config?: UniversityConfig;
}

// University response type (for API responses)
export interface UniversityResponse {
  id: string;
  name: Record<string, any>;
  slug: string;
  config?: UniversityConfig;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// University with relations response type
export interface UniversityWithRelationsResponse extends UniversityResponse {
  sections?: Section[]; // Will be properly typed when imported
  colleges?: College[]; // Will be properly typed when imported
}
