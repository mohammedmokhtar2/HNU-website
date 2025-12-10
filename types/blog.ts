import { User, University, College } from '@prisma/client';
import { EventConfig } from './event';

// Base Blog type from Prisma
export interface Blog {
  id: string;
  title: Record<string, any>; // JSON field for multilingual titles
  content: Record<string, any>; // JSON field for multilingual content
  image: string[];
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  slug: string;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  order: number;
  universityId: string | null;
  createdById: string | null;
  collageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isEvent: boolean;
  eventConfig: EventConfig | null;
}

// Blog with relations
export interface BlogWithRelations extends Blog {
  University?: University | null;
  createdBy?: User | null;
  collage?: College | null;
}

// Input types for creating blogs
export interface CreateBlogInput {
  title: Record<string, any>;
  content: Record<string, any>;
  image?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  slug: string;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  order?: number;
  universityId?: string | null;
  createdById?: string | null;
  collageId?: string | null;
  isEvent?: boolean;
  eventConfig?: EventConfig | null;
}

// Input types for updating blogs
export interface UpdateBlogInput {
  title?: Record<string, any>;
  content?: Record<string, any>;
  image?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  slug?: string;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  order?: number;
  universityId?: string | null;
  createdById?: string | null;
  collageId?: string | null;
  isEvent?: boolean;
  eventConfig?: EventConfig | null;
}

// Response types
export type BlogResponse = Blog;

export type BlogWithRelationsResponse = BlogWithRelations;

// Query parameters for filtering blogs
export interface BlogQueryParams {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  isEvent?: boolean;
  universityId?: string;
  collageId?: string;
  createdById?: string;
  tags?: string[];
  search?: string;
  orderBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'order';
  orderDirection?: 'asc' | 'desc';
}

// Paginated response for blogs
export interface PaginatedBlogResponse {
  data: BlogResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Blog statistics
export interface BlogStats {
  total: number;
  published: number;
  draft: number;
  featured: number;
  events: number;
  byUniversity: Array<{
    universityId: string;
    universityName: string;
    count: number;
  }>;
  byCollege: Array<{
    collageId: string;
    collageName: string;
    count: number;
  }>;
  byTags: Array<{
    tag: string;
    count: number;
  }>;
  byEventType: Array<{
    eventType: string;
    count: number;
  }>;
}
