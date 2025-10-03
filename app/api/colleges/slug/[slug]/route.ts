import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

async function handleGET(req: NextRequest, { params }: Params) {
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
        programs: true,
        University: true,
      },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error('Error fetching college by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch college' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('College')
);
