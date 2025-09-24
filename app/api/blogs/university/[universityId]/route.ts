import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{
    universityId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { universityId } = await params;
    const { searchParams } = new URL(request.url);

    // Parse query parameters
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
    const tags =
      searchParams.get('tags')?.split(',').filter(Boolean) || undefined;
    const search = searchParams.get('search') || undefined;
    const isEvent =
      searchParams.get('isEvent') === 'true'
        ? true
        : searchParams.get('isEvent') === 'false'
          ? false
          : undefined;

    // Build where clause
    const where: any = {
      universityId,
    };

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (isEvent !== undefined) {
      where.isEvent = isEvent;
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
    console.error('Error fetching blogs by university:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs by university' },
      { status: 500 }
    );
  }
}
