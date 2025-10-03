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
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Validate search query
    if (!query || query.trim().length === 0) {
      const errorResponse: ApiErrorResponse = {
        error: 'Invalid search query',
        message: 'Search query is required and cannot be empty',
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      const errorResponse: ApiErrorResponse = {
        error: 'Invalid pagination parameters',
        message: 'Page must be >= 1, limit must be between 1 and 100',
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Search users by name or email
    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          College: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.user.count({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
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
    console.error('Error searching users:', error);
    const errorResponse: ApiErrorResponse = {
      error: 'Internal server error',
      message: 'Failed to search users',
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Apply tracking to all methods using search preset
export const { OPTIONS, GET } = withApiTrackingMethods(
  { OPTIONS: handleOPTIONS, GET: handleGET },
  ApiTrackingPresets.search('users')
);
