import { NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';
import { UserType } from '@/types/enums';
import { UserResponse, ApiErrorResponse } from '@/types/user';

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

async function handleGET() {
  try {
    const superAdmins = await db.user.findMany({
      where: {
        role: UserType.SUPERADMIN,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Convert to response format
    const superAdminsResponse: UserResponse[] = superAdmins.map(user => ({
      id: user.id,
      clerkId: user.clerkId || undefined,
      name: user.name || undefined,
      email: user.email,
      role: user.role as any,
      image: user.image || undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    return NextResponse.json(superAdminsResponse);
  } catch (error) {
    console.error('Error fetching super admins:', error);
    const errorResponse: ApiErrorResponse = {
      error: 'Internal server error',
      message: 'Failed to fetch super admins',
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
