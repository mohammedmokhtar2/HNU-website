import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params;
  try {
    const sections = await db.pageSection.findMany({
      where: {
        pageId: pageId,
      },
      include: {
        page: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching page sections by page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('PageSection')
);
