import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { UserResponse, ApiErrorResponse } from '@/types/user';

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
    },
  });
}

async function handlePATCH(
  req: NextRequest,
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { collageId } = body;

    // Validate input
    if (!id || typeof id !== 'string') {
      const errorResponse: ApiErrorResponse = {
        error: 'Invalid input',
        message: 'User ID is required and must be a string',
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!collageId || typeof collageId !== 'string') {
      const errorResponse: ApiErrorResponse = {
        error: 'Invalid input',
        message: 'College ID is required and must be a string',
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
      include: { College: true },
    });

    if (!existingUser) {
      const errorResponse: ApiErrorResponse = {
        error: 'User not found',
        message: 'User with the provided ID does not exist',
        statusCode: 404,
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Check if college exists
    const existingCollege = await db.college.findUnique({
      where: { id: collageId },
    });

    if (!existingCollege) {
      const errorResponse: ApiErrorResponse = {
        error: 'College not found',
        message: 'College with the provided ID does not exist',
        statusCode: 404,
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Update user's college
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        collegeId: collageId,
      },
      include: {
        College: true,
      },
    });

    // Convert to response format
    const userResponse: UserResponse = {
      id: updatedUser.id,
      clerkId: updatedUser.clerkId || undefined,
      name: updatedUser.name || undefined,
      email: updatedUser.email,
      role: updatedUser.role as any,
      image: updatedUser.image || undefined,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error moving user to college:', error);
    const errorResponse: ApiErrorResponse = {
      error: 'Internal server error',
      message: 'Failed to move user to college',
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Apply tracking to all methods using CRUD preset
export const { PATCH } = withApiTrackingMethods(
  { PATCH: handlePATCH },
  ApiTrackingPresets.crud('User')
);
