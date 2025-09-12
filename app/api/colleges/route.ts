import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const createdById = searchParams.get('createdById');
    const assignedToUserId = searchParams.get('assignedToUserId');

    // Build where clause based on query parameters
    const whereClause: any = {};

    if (type) {
      whereClause.type = type;
    }

    if (createdById) {
      whereClause.createdById = createdById;
    }

    if (assignedToUserId) {
      whereClause.User = {
        some: {
          id: assignedToUserId,
        },
      };
    }

    const colleges = await db.college.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        sections: true,
        statistics: true,
        University: true,
        User: true, // Include users assigned to this college
      },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 }
    );
  }
}
