import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collageId = searchParams.get('collageId');

    // Build where clause
    const whereClause: any = {};
    if (collageId) {
      whereClause.collageId = collageId;
    }

    // Get total count
    const total = await db.program.count({ where: whereClause });

    // Get programs by college
    const programsByCollege = await db.program.groupBy({
      by: ['collageId'],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    // Get college names for the grouped results
    const collegeIds = programsByCollege
      .map(item => item.collageId)
      .filter((id): id is string => id !== null);

    const colleges = await db.college.findMany({
      where: {
        id: {
          in: collegeIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const byCollege = programsByCollege.map(item => {
      const college = colleges.find(c => c.id === item.collageId);
      return {
        collageId: item.collageId || 'unassigned',
        collageName: college?.name || 'Unassigned',
        count: item._count.id,
      };
    });

    return NextResponse.json({
      total,
      byCollege,
    });
  } catch (error) {
    console.error('Error fetching program stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program stats' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('Program')
);
