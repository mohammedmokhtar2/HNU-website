import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { UserType } from '@/types/enums';
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

export async function POST(request: NextRequest) {
  try {
    const clerk = await clerkClient();
    const body = await request.json();
    const { clerkId } = body;

    // Validate input
    if (!clerkId || typeof clerkId !== 'string') {
      const errorResponse: ApiErrorResponse = {
        error: 'Invalid input',
        message: 'Clerk ID is required and must be a string',
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // First, try to find existing user
    let user = await db.user.findUnique({
      where: { clerkId: clerkId },
    });

    // If user doesn't exist, create them
    if (!user) {
      try {
        // Get user data from Clerk
        const clerkUser = await clerk.users.getUser(clerkId);

        // Validate Clerk user data
        if (!clerkUser.emailAddresses?.[0]?.emailAddress) {
          const errorResponse: ApiErrorResponse = {
            error: 'Invalid Clerk user',
            message: 'User email is required but not found in Clerk',
            statusCode: 400,
          };
          return NextResponse.json(errorResponse, { status: 400 });
        }

        // Create user in database with default role
        user = await db.user.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: clerkUser.fullName || null,
            image: clerkUser.imageUrl || null,
            role: UserType.GUEST, // Default role for new users
          },
          include: {
            auditLogs: true,
            permissions: true,
            College: true,
          },
        });

        console.log(`Created new user: ${user.id} for Clerk ID: ${clerkId}`);
      } catch (clerkError) {
        console.error('Error fetching user from Clerk:', clerkError);
        const errorResponse: ApiErrorResponse = {
          error: 'Clerk integration error',
          message: 'Failed to fetch user data from Clerk',
          statusCode: 500,
        };
        return NextResponse.json(errorResponse, { status: 500 });
      }
    }

    // Convert to response format
    const userResponse: UserResponse = {
      id: user.id,
      clerkId: user.clerkId || undefined,
      name: user.name || undefined,
      email: user.email,
      role: user.role as UserType,
      image: user.image || undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error in find-or-create user:', error);
    const errorResponse: ApiErrorResponse = {
      error: 'Internal server error',
      message: 'Failed to find or create user',
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
