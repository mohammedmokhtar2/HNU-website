import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export const GET = withAuditLog(
  async (req: Request, { params }: Params) => {
    try {
      const { slug } = await params;

      const college = await db.college.findUnique({
        where: { slug },
        include: {
          sections: {
            orderBy: {
              order: 'asc',
            },
          },
          statistics: true,
          University: true,
        },
      });

      if (!college) {
        return NextResponse.json(
          { error: 'College not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(college);
    } catch (error) {
      console.error('Error fetching college by slug:', error);
      return NextResponse.json(
        { error: 'Failed to fetch college' },
        { status: 500 }
      );
    }
  },
  {
    action: 'GET_COLLEGE_BY_SLUG',
    extract: () => {
      return {
        entity: 'College',
      };
    },
  }
);
