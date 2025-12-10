import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universityId = searchParams.get('universityId');
    const collegeId = searchParams.get('collegeId');

    const pages = await db.page.findMany({
      where: {
        ...(universityId && { universityId }),
        ...(collegeId && { collageId: collegeId }),
      },
      include: {
        collage: true,
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePOST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, config, isActive, collageId, universityId } = body;

    const page = await db.page.create({
      data: {
        title,
        slug,
        config: config || {},
        isActive: isActive ?? true,
        universityId,
        collageId,
      },
      include: {
        collage: true,
        sections: true,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET, POST } = withApiTrackingMethods(
  { GET: handleGET, POST: handlePOST },
  ApiTrackingPresets.crud('Page')
);
