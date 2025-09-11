import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = params;

    const statistic = await db.statistic.findUnique({
      where: { id },
      include: {
        collage: true,
      },
    });

    if (!statistic) {
      return NextResponse.json(
        { error: 'Statistic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(statistic);
  } catch (error) {
    console.error('Error fetching statistic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistic' },
      { status: 500 }
    );
  }
}

export const PATCH = withAuditLog(
  async (req: Request, { params }: Params) => {
    try {
      const { id } = params;
      const body = await req.json();
      const { label, collageId } = body;

      const existingStatistic = await db.statistic.findUnique({
        where: { id },
      });

      if (!existingStatistic) {
        return NextResponse.json(
          { error: 'Statistic not found' },
          { status: 404 }
        );
      }

      const statistic = await db.statistic.update({
        where: { id },
        data: {
          label: label !== undefined ? label : undefined,
          collageId: collageId !== undefined ? collageId : undefined,
        },
      });

      return NextResponse.json(statistic);
    } catch (error) {
      console.error('Error updating statistic:', error);
      return NextResponse.json(
        { error: 'Failed to update statistic' },
        { status: 500 }
      );
    }
  },
  {
    action: 'UPDATE_STATISTIC',
    extract: () => {
      return {
        entity: 'Statistic',
      };
    },
  }
);

export const DELETE = withAuditLog(
  async (req: Request, { params }: Params) => {
    try {
      const { id } = params;

      // Check if statistic exists
      const existingStatistic = await db.statistic.findUnique({
        where: { id },
      });

      if (!existingStatistic) {
        return NextResponse.json(
          { error: 'Statistic not found' },
          { status: 404 }
        );
      }

      // Delete the statistic
      await db.statistic.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'Statistic deleted successfully' });
    } catch (error) {
      console.error('Error deleting statistic:', error);
      return NextResponse.json(
        { error: 'Failed to delete statistic' },
        { status: 500 }
      );
    }
  },
  {
    action: 'DELETE_STATISTIC',
    extract: () => {
      return {
        entity: 'Statistic',
      };
    },
  }
);
