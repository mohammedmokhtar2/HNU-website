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
    const section = await db.pageSection.findUnique({
      where: {
        id: id,
      },
      include: {
        page: true,
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: 'Page section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error fetching page section:', error);
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
    const { type, title, content, mediaUrl, order, pageId } = body;

    const section = await db.pageSection.update({
      where: {
        id: id,
      },
      data: {
        ...(type && { type }),
        ...(title && { title }),
        ...(content && { content }),
        ...(mediaUrl && { mediaUrl }),
        ...(order !== undefined && { order }),
        ...(pageId && { pageId }),
      },
      include: {
        page: true,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error updating page section:', error);
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
    await db.pageSection.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page section:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET, PATCH, DELETE } = withApiTrackingMethods(
  { GET: handleGET, PATCH: handlePATCH, DELETE: handleDELETE },
  ApiTrackingPresets.crud('PageSection')
);
