import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

async function handleGET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    const university = await db.university.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        colleges: true,
      },
    });

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(university);
  } catch (error) {
    console.error('Error fetching university by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('University')
);
