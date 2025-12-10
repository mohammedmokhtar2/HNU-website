import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const page = await db.page.findUnique({
      where: {
        id: id,
      },
      include: {
        collage: true,
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, slug, config, isActive, collageId, universityId, order } =
      body;

    const page = await db.page.update({
      where: {
        id: id,
      },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(config && { config }),
        ...(isActive !== undefined && { isActive }),
        ...(collageId !== undefined && { collageId }),
        ...(universityId && { universityId }),
        ...(order !== undefined && { order }),
      },
      include: {
        collage: true,
        sections: true,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleDELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await db.page.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET, PATCH, DELETE } = withApiTrackingMethods(
  { GET: handleGET, PATCH: handlePATCH, DELETE: handleDELETE },
  ApiTrackingPresets.crud('Page')
);
