import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { CreateProgramInput, ProgramQueryParams } from '@/types/program';

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const collageId = searchParams.get('collageId');
    const search = searchParams.get('search');
    const orderBy = searchParams.get('orderBy') || 'createdAt';
    const orderDirection = searchParams.get('orderDirection') || 'desc';

    // Build where clause based on query parameters
    const whereClause: any = {};

    if (collageId) {
      whereClause.collageId = collageId;
    }

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
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

async function handlePOST(req: NextRequest) {
  try {
    const body: CreateProgramInput = await req.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Program name is required' },
        { status: 400 }
      );
    }

    // Check if collage exists if collageId is provided
    if (body.collageId) {
      const collage = await db.college.findUnique({
        where: { id: body.collageId },
      });

      if (!collage) {
        return NextResponse.json(
          { error: 'College not found' },
          { status: 404 }
        );
      }
    }

    const program = await db.program.create({
      data: {
        name: body.name,
        description: body.description,
        config: body.config,
        collageId: body.collageId,
      },
      include: {
        collage: true,
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { GET, POST } = withApiTrackingMethods(
  { GET: handleGET, POST: handlePOST },
  ApiTrackingPresets.crud('Program')
);
