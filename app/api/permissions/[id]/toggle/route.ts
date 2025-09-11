import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

// PATCH /api/permissions/[id]/toggle - Toggle permission active status
export const PATCH = withAuditLog(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const body = await request.json();
      const { isActive } = body;

      const permission = await db.permission.update({
        where: { id: params.id },
        data: { isActive },
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
      console.error('Error toggling permission:', error);
      return NextResponse.json(
        { error: 'Failed to toggle permission' },
        { status: 500 }
      );
    }
  },
  {
    action: 'TOGGLE_PERMISSION',
    extract: () => ({
      entity: 'Permission',
    }),
  }
);
