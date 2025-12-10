import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const orderBy = searchParams.get('orderBy') || 'order';
    const orderDirection =
      (searchParams.get('orderDirection') as 'asc' | 'desc') || 'asc';
    const universityId = searchParams.get('universityId') || undefined;
    const collageId = searchParams.get('collageId') || undefined;
    const createdById = searchParams.get('createdById') || undefined;
    const tags =
      searchParams.get('tags')?.split(',').filter(Boolean) || undefined;
    const search = searchParams.get('search') || undefined;

    // Build where clause for featured blogs
    const where: any = {
      isFeatured: true,
    };

    if (universityId) {
      where.universityId = universityId;
    }

    if (collageId) {
      where.collageId = collageId;
    }

    if (createdById) {
      where.createdById = createdById;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            path: ['en'],
            string_contains: search,
          },
        },
        {
          title: {
            path: ['ar'],
            string_contains: search,
          },
        },
        {
          content: {
            path: ['en'],
            string_contains: search,
          },
        },
        {
          content: {
            path: ['ar'],
            string_contains: search,
          },
        },
        {
          tags: {
            hasSome: [search],
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await db.blogs.count({ where });

    // Get featured blogs with relations
    const blogs = await db.blogs.findMany({
      where,
      include: {
        University: true,
        createdBy: true,
        collage: true,
      },
      orderBy: {
        [orderBy]: orderDirection,
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured blogs' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('Blog')
);
