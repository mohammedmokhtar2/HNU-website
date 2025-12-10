import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';
import { BlogQueryParams, CreateBlogInput } from '@/types/blog';

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const params: BlogQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      isPublished:
        searchParams.get('isPublished') === 'true'
          ? true
          : searchParams.get('isPublished') === 'false'
            ? false
            : undefined,
      isFeatured:
        searchParams.get('isFeatured') === 'true'
          ? true
          : searchParams.get('isFeatured') === 'false'
            ? false
            : undefined,
      universityId: searchParams.get('universityId') || undefined,
      collageId: searchParams.get('collageId') || undefined,
      createdById: searchParams.get('createdById') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      search: searchParams.get('search') || undefined,
      orderBy: (searchParams.get('orderBy') as any) || 'createdAt',
      orderDirection:
        (searchParams.get('orderDirection') as 'asc' | 'desc') || 'desc',
      isEvent:
        searchParams.get('isEvent') === 'true'
          ? true
          : searchParams.get('isEvent') === 'false'
            ? false
            : undefined,
    };

    // Build where clause
    const where: any = {};

    if (params.isPublished !== undefined) {
      where.isPublished = params.isPublished;
    }

    if (params.isFeatured !== undefined) {
      where.isFeatured = params.isFeatured;
    }

    if (params.universityId) {
      where.universityId = params.universityId;
    }

    if (params.collageId) {
      where.collageId = params.collageId;
    }

    if (params.createdById) {
      where.createdById = params.createdById;
    }

    if (params.isEvent !== undefined) {
      where.isEvent = params.isEvent;
    }

    if (params.tags && params.tags.length > 0) {
      where.tags = {
        hasSome: params.tags,
      };
    }

    if (params.search) {
      where.OR = [
        {
          title: {
            path: ['en'],
            string_contains: params.search,
          },
        },
        {
          title: {
            path: ['ar'],
            string_contains: params.search,
          },
        },
        {
          content: {
            path: ['en'],
            string_contains: params.search,
          },
        },
        {
          content: {
            path: ['ar'],
            string_contains: params.search,
          },
        },
        {
          tags: {
            hasSome: [params.search],
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (params.page! - 1) * params.limit!;

    // Get total count
    const total = await db.blogs.count({ where });

    // Get blogs with relations
    const blogs = await db.blogs.findMany({
      where,
      include: {
        University: true,
        createdBy: true,
        collage: true,
      },
      orderBy: {
        [params.orderBy!]: params.orderDirection!,
      },
      skip,
      take: params.limit,
    });

    const totalPages = Math.ceil(total / params.limit!);

    return NextResponse.json({
      data: blogs,
      pagination: {
        page: params.page!,
        limit: params.limit!,
        total,
        totalPages,
        hasNext: params.page! < totalPages,
        hasPrev: params.page! > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

async function handlePOST(req: NextRequest) {
  try {
    const body: CreateBlogInput = await req.json();

    // Validate required fields
    if (!body.title || !body.content || !body.slug) {
      return NextResponse.json(
        { error: 'Title, content, and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBlog = await db.blogs.findUnique({
      where: { slug: body.slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 409 }
      );
    }

    // Create the blog
    const blog = await db.blogs.create({
      data: {
        title: body.title,
        content: body.content,
        image: body.image || [],
        tags: body.tags || [],
        isFeatured: body.isFeatured || false,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
        slug: body.slug,
        publishedAt: body.publishedAt,
        scheduledAt: body.scheduledAt,
        order: body.order || 0,
        universityId: body.universityId,
        createdById: body.createdById,
        collageId: body.collageId,
        isEvent: body.isEvent || false,
        eventConfig: body.eventConfig
          ? JSON.parse(JSON.stringify(body.eventConfig))
          : null,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET, POST } = withApiTrackingMethods(
  { GET: handleGET, POST: handlePOST },
  ApiTrackingPresets.crud('Blog')
);
