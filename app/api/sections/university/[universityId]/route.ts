import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ universityId: string }> }
) {
  try {
    const { universityId } = await params;

    const sections = await db.section.findMany({
      where: {
        universityId: universityId,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        collage: true,
        University: true,
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching university sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university sections' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('Section')
);
