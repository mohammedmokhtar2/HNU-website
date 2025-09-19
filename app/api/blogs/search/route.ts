import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const orderBy = searchParams.get('orderBy') || 'createdAt';
    const orderDirection =
      (searchParams.get('orderDirection') as 'asc' | 'desc') || 'desc';
    const isPublished =
      searchParams.get('isPublished') === 'true'
        ? true
        : searchParams.get('isPublished') === 'false'
          ? false
          : undefined;
    const isFeatured =
      searchParams.get('isFeatured') === 'true'
        ? true
        : searchParams.get('isFeatured') === 'false'
          ? false
          : undefined;
    const universityId = searchParams.get('universityId') || undefined;
    const collageId = searchParams.get('collageId') || undefined;
    const createdById = searchParams.get('createdById') || undefined;
    const tags =
      searchParams.get('tags')?.split(',').filter(Boolean) || undefined;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = {
      OR: [
        {
          title: {
            path: ['en'],
            string_contains: query,
          },
        },
        {
          title: {
            path: ['ar'],
            string_contains: query,
          },
        },
        {
          content: {
            path: ['en'],
            string_contains: query,
          },
        },
        {
          content: {
            path: ['ar'],
            string_contains: query,
          },
        },
        {
          tags: {
            hasSome: [query],
          },
        },
      ],
    };

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

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

    // Calculate pagination
    const skip = (page - 1) * limit;

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
    console.error('Error searching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to search blogs' },
      { status: 500 }
    );
  }
}
