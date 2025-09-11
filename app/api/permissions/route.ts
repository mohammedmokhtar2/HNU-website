import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { handleCORS, addCORSHeaders } from '@/lib/cors';
import { autoWrapRouteHandlers } from '@/lib/middleware/autoWrapRoutes';
import type { CreatePermissionInput } from '@/types/permission';

// GET /api/permissions - Get all permissions with optional filters
async function getPermissions(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const resource = searchParams.get('resource');
    const action = searchParams.get('action');
    const isActive = searchParams.get('isActive');

    const where: any = {};

    if (userId) where.userId = userId;
    if (resource) where.resource = resource;
    if (action) where.action = action;
    if (isActive !== null) where.isActive = isActive === 'true';

    const permissions = await db.permission.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const response = NextResponse.json({ permissions });
    return addCORSHeaders(response);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
    return addCORSHeaders(response);
  }
}

// POST /api/permissions - Create a new permission
async function createPermission(request: NextRequest) {
  try {
    const body: CreatePermissionInput = await request.json();

    // Validate required fields
    if (!body.userId || !body.action || !body.resource || !body.title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if permission already exists
    const existingPermission = await db.permission.findFirst({
      where: {
        userId: body.userId,
        action: body.action,
        resource: body.resource,
      },
    });

    if (existingPermission) {
      return NextResponse.json(
        { error: 'Permission already exists' },
        { status: 409 }
      );
    }

    const permission = await db.permission.create({
      data: {
        userId: body.userId,
        action: body.action,
        resource: body.resource,
        title: body.title,
        description: body.description,
        isActive: body.isActive ?? true,
        metadata: body.metadata,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ permission });
  } catch (error) {
    console.error('Error creating permission:', error);
    return NextResponse.json(
      { error: 'Failed to create permission' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
async function handleOptions(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  // If not a preflight request, return a simple response
  return new NextResponse(null, { status: 200 });
}

// Export with automatic audit logging - NO MANUAL WRAPPING NEEDED!
export const { GET, POST, OPTIONS } = autoWrapRouteHandlers({
  GET: getPermissions,
  POST: createPermission,
  OPTIONS: handleOptions,
});
