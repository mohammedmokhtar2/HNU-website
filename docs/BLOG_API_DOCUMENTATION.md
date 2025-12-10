# Blog API Documentation

This document describes the complete Blog API implementation for the HNU Official Website.

## Overview

The Blog API provides comprehensive CRUD operations for managing blog posts with support for:
- Multilingual content (JSON fields for title and content)
- Image galleries
- Tagging system
- Featured content management
- Publishing workflow (draft/published)
- SEO-friendly slugs
- Content ordering
- University and College associations
- Author tracking

## Database Model

The `Blogs` model includes:
- **Content**: Multilingual title and content (JSON)
- **Media**: Image arrays for galleries
- **Organization**: Tags, featured status, publishing status
- **SEO**: Unique slugs for URLs
- **Scheduling**: Published and scheduled dates
- **Ordering**: Custom order for featured content
- **Relationships**: University, College, and Author associations

## API Endpoints

### Core CRUD Operations

#### 1. Get All Blogs
```
GET /api/blogs
```
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `isPublished` (boolean): Filter by published status
- `isFeatured` (boolean): Filter by featured status
- `universityId` (string): Filter by university
- `collageId` (string): Filter by college
- `createdById` (string): Filter by author
- `tags` (string): Comma-separated tags
- `search` (string): Search in title, content, and tags
- `orderBy` (string): Sort field (createdAt, updatedAt, publishedAt, order)
- `orderDirection` (string): Sort direction (asc, desc)

#### 2. Get Blog by ID
```
GET /api/blogs/[id]
```

#### 3. Get Blog by Slug
```
GET /api/blogs/slug/[slug]
```

#### 4. Create Blog
```
POST /api/blogs
```
**Body:** `CreateBlogInput`

#### 5. Update Blog
```
PATCH /api/blogs/[id]
```
**Body:** `UpdateBlogInput`

#### 6. Delete Blog
```
DELETE /api/blogs/[id]
```

### Specialized Endpoints

#### Published Blogs
```
GET /api/blogs/published
```
Returns only published blogs with same query parameters as main endpoint.

#### Featured Blogs
```
GET /api/blogs/featured
```
Returns only featured blogs, ordered by custom order field.

#### University Blogs
```
GET /api/blogs/university/[universityId]
```
Returns blogs associated with a specific university.

#### College Blogs
```
GET /api/blogs/college/[collageId]
```
Returns blogs associated with a specific college.

#### Author Blogs
```
GET /api/blogs/author/[createdById]
```
Returns blogs created by a specific author.

#### Search Blogs
```
GET /api/blogs/search?q=[query]
```
Searches blogs by title, content, and tags.

#### Blogs by Tags
```
GET /api/blogs/tags?tags=[tag1,tag2]
```
Returns blogs that have any of the specified tags.

### Management Endpoints

#### Toggle Featured Status
```
PATCH /api/blogs/[id]/toggle-featured
```

#### Toggle Published Status
```
PATCH /api/blogs/[id]/toggle-published
```

#### Blog Statistics
```
GET /api/blogs/stats
```
Returns comprehensive statistics including:
- Total, published, draft, and featured counts
- Statistics by university
- Statistics by college
- Most used tags

#### Reorder Blogs
```
PATCH /api/blogs/reorder
```
**Body:** `{ blogIds: string[] }`
Updates the order field for featured content management.

## Service Layer

The `BlogService` class provides a clean interface for all API operations:

```typescript
import { BlogService } from '@/services/blog.service';

// Get all blogs
const blogs = await BlogService.getBlogs({ page: 1, limit: 10 });

// Create a new blog
const newBlog = await BlogService.createBlog({
  title: { en: "Hello World", ar: "مرحبا بالعالم" },
  content: { en: "Content...", ar: "المحتوى..." },
  slug: "hello-world",
  tags: ["news", "announcement"]
});

// Search blogs
const searchResults = await BlogService.searchBlogs("university news");
```

## Type Definitions

All types are exported from `@/types/blog`:

- `Blog`: Base blog model
- `BlogWithRelations`: Blog with University, College, and Author relations
- `CreateBlogInput`: Input for creating blogs
- `UpdateBlogInput`: Input for updating blogs
- `BlogQueryParams`: Query parameters for filtering
- `PaginatedBlogResponse`: Paginated response structure
- `BlogStats`: Statistics response

## Features

### Multilingual Support
- Title and content stored as JSON objects
- Support for multiple languages (en, ar, etc.)
- Search works across all language fields

### Content Management
- Draft/Published workflow
- Featured content with custom ordering
- Scheduled publishing
- Image galleries

### SEO & Navigation
- Unique slugs for clean URLs
- Search functionality
- Tag-based organization

### Analytics
- Comprehensive statistics
- Content performance tracking
- Author and organization metrics

## Usage Examples

### Creating a Blog Post
```typescript
const blogData: CreateBlogInput = {
  title: {
    en: "New University Program",
    ar: "برنامج جامعي جديد"
  },
  content: {
    en: "We are excited to announce...",
    ar: "نحن متحمسون للإعلان..."
  },
  slug: "new-university-program",
  tags: ["announcement", "programs"],
  isPublished: true,
  isFeatured: false,
  universityId: "univ-123",
  collageId: "col-456"
};

const blog = await BlogService.createBlog(blogData);
```

### Searching and Filtering
```typescript
// Search published blogs
const results = await BlogService.getPublishedBlogs({
  search: "research",
  universityId: "univ-123",
  page: 1,
  limit: 5
});

// Get featured blogs
const featured = await BlogService.getFeaturedBlogs({
  orderBy: "order",
  orderDirection: "asc"
});
```

This implementation provides a complete, production-ready blog management system with all the features needed for a university website.
