import { CollegeType } from './enums';
import { Page } from './page';
import { Section } from './section';
import { Statistic } from './statistic';
import { University } from './university';
import { User } from './user';
// User, Section, Statistic, and University types will be imported when needed

// Base College interface
export interface College {
  id: string;
  slug: string;
  name: Record<string, any>;
  config?: CollegeConfig; // JSON config for logo and social media links
  type: CollegeType;
  User?: User[]; // Will be properly typed when imported
  sections?: Section[]; // Will be properly typed when imported
  statistics?: Statistic[]; // Will be properly typed when imported
  createdBy?: User; // Will be properly typed when imported
  createdById?: string;
  universityId?: string;
  University?: University; // Will be properly typed when imported
  Page?: Page[]; // Will be properly typed when imported
  createdAt: Date;
  updatedAt: Date;
}

// College creation input type
export interface CreateCollegeInput {
  slug: string;
  name: Record<string, any>;
  config?: CollegeConfig;
  type: CollegeType;
  createdById?: string;
  universityId?: string;
}

// College update input type
export interface UpdateCollegeInput {
  slug?: string;
  name?: Record<string, any>;
  config?: CollegeConfig;
  type?: CollegeType;
  createdById?: string;
  universityId?: string;
}

// College response type (for API responses)
export interface CollegeResponse {
  id: string;
  slug: string;
  name: Record<string, any>;
  config?: CollegeConfig;
  type: CollegeType;
  createdById?: string;
  universityId?: string;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// College with relations response type
export interface CollegeWithRelationsResponse extends CollegeResponse {
  User?: User[]; // Will be properly typed when imported
  sections?: Section[]; // Will be properly typed when imported
  statistics?: Statistic[]; // Will be properly typed when imported
  createdBy?: User; // Will be properly typed when imported
  University?: University; // Will be properly typed when imported
  Page?: Page[]; // Will be properly typed when imported
}

export interface CollegeConfig {
  logoUrl?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}
