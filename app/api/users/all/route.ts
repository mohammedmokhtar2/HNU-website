import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';
import {
  UserResponse,
  ApiErrorResponse,
  PaginatedResponse,
} from '@/types/user';

// Handle CORS preflight requests
async function handleOPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
    },
  });
}

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeCollege = searchParams.get('includeCollege') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 1000) {
      const errorResponse: ApiErrorResponse = {
        error: 'Invalid pagination parameters',
        message: 'Page must be >= 1, limit must be between 1 and 1000',
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        include: {
          ...(includeCollege && {
            College: true,
          }),
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.user.count(),
    ]);

    // Convert to response format
    const usersResponse: UserResponse[] = users.map(user => ({
      id: user.id,
      clerkId: user.clerkId || undefined,
      name: user.name || undefined,
      email: user.email,
      role: user.role as any,
      image: user.image || undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    const response: PaginatedResponse<UserResponse> = {
      data: usersResponse,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching all users:', error);
    const errorResponse: ApiErrorResponse = {
      error: 'Internal server error',
      message: 'Failed to fetch users',
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Apply tracking to all methods using crud preset
export const { OPTIONS, GET } = withApiTrackingMethods(
  { OPTIONS: handleOPTIONS, GET: handleGET },
  ApiTrackingPresets.crud('User')
);
