import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';
import type { UpdatePermissionInput } from '@/types/permission';

// GET /api/permissions/[id] - Get permission by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const permission = await db.permission.findUnique({
      where: { id },
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

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ permission });
  } catch (error) {
    console.error('Error fetching permission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permission' },
      { status: 500 }
    );
  }
}

// PUT /api/permissions/[id] - Update permission
export const PUT = withAuditLog(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const body: UpdatePermissionInput = await request.json();

      const permission = await db.permission.update({
        where: { id },
        data: {
          action: body.action,
          resource: body.resource,
          title: body.title,
          description: body.description,
          isActive: body.isActive,
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
      console.error('Error updating permission:', error);
      return NextResponse.json(
        { error: 'Failed to update permission' },
        { status: 500 }
      );
    }
  },
  {
    action: 'UPDATE_PERMISSION',
    extract: async (
      _req: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;
      return {
        entity: 'Permission',
        entityId: id,
      };
    },
  }
);

// DELETE /api/permissions/[id] - Delete permission
export const DELETE = withAuditLog(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      await db.permission.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting permission:', error);
      return NextResponse.json(
        { error: 'Failed to delete permission' },
        { status: 500 }
      );
    }
  },
  {
    action: 'DELETE_PERMISSION',
    extract: async (
      _req: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;
      return {
        entity: 'Permission',
        entityId: id,
      };
    },
  }
);
