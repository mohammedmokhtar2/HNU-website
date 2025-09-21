import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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
