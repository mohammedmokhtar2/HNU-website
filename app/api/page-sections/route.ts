import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get('pageId');

    const whereClause: any = {};
    if (pageId) {
      whereClause.pageId = pageId;
    }

    const sections = await db.pageSection.findMany({
      where: whereClause,
      include: {
        page: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching page sections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePOST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, title, content, mediaUrl, order, pageId } = body;

    const section = await db.pageSection.create({
      data: {
        type,
        title,
        content,
        mediaUrl,
        order,
        pageId,
      },
      include: {
        page: true,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error('Error creating page section:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { sections } = body;

    // Bulk update for reordering
    if (sections && Array.isArray(sections)) {
      const updatePromises = sections.map(
        ({ id, order }: { id: string; order: number }) =>
          db.pageSection.update({
            where: { id },
            data: { order },
          })
      );

      await Promise.all(updatePromises);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating page sections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET, POST, PATCH } = withApiTrackingMethods(
  { GET: handleGET, POST: handlePOST, PATCH: handlePATCH },
  ApiTrackingPresets.crud('PageSection')
);
