import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{
    collageId: string;
  }>;
}

async function handleGET(request: NextRequest, { params }: RouteParams) {
  try {
    const { collageId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const orderBy = searchParams.get('orderBy') || 'createdAt';
    const orderDirection = searchParams.get('orderDirection') || 'desc';

    // Check if college exists
    const college = await db.college.findUnique({
      where: { id: collageId },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Build where clause
    const whereClause: any = {
      collageId: collageId,
    };

    if (search) {
      whereClause.OR = [
        {
          name: {
            path: ['en'],
            string_contains: search,
          },
        },
        {
          name: {
            path: ['ar'],
            string_contains: search,
          },
        },
        {
          description: {
            path: ['en'],
            string_contains: search,
          },
        },
        {
          description: {
            path: ['ar'],
            string_contains: search,
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await db.program.count({ where: whereClause });

    // Fetch programs with pagination
    const programs = await db.program.findMany({
      where: whereClause,
      orderBy: { [orderBy]: orderDirection },
      skip,
      take: limit,
      include: {
        collage: true,
      },
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      data: programs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.error('Error fetching college programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch college programs' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('Program')
);
