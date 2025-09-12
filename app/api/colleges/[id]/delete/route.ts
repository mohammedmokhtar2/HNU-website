import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export const DELETE = withAuditLog(
  async (req: Request, { params }: Params) => {
    try {
      const { id } = await params;

      // Check if college exists
      const existingCollege = await db.college.findUnique({
        where: { id },
      });

      if (!existingCollege) {
        return NextResponse.json(
          { error: 'College not found' },
          { status: 404 }
        );
      }

      // Delete the college
      await db.college.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: 'College deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting college:', error);
      return NextResponse.json(
        { error: 'Failed to delete college' },
        { status: 500 }
      );
    }
  },
  {
    action: 'DELETE_COLLEGE',
    extract: () => {
      return {
        entity: 'College',
      };
    },
  }
);
