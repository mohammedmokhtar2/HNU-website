import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

async function handleGET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    const section = await db.section.findUnique({
      where: { id },
      include: {
        collage: true,
        University: true,
      },
    });

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}

async function handlePUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { type, content, order, collageId, universityId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingSection = await db.section.findUnique({
      where: { id },
    });

    if (!existingSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    // Validate that section belongs to either university or college
    if (universityId && collageId) {
      return NextResponse.json(
        { error: 'Section cannot belong to both university and college' },
        { status: 400 }
      );
    }

    const section = await db.section.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(content && { content }),
        ...(order !== undefined && { order }),
        ...(collageId !== undefined && { collageId }),
        ...(universityId !== undefined && { universityId }),
      },
      include: {
        collage: true,
        University: true,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

async function handlePATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { type, content, order, collageId, universityId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingSection = await db.section.findUnique({
      where: { id },
    });

    if (!existingSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    // Validate that section belongs to either university or college
    if (universityId && collageId) {
      return NextResponse.json(
        { error: 'Section cannot belong to both university and college' },
        { status: 400 }
      );
    }

    const section = await db.section.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(content && { content }),
        ...(order !== undefined && { order }),
        ...(collageId !== undefined && { collageId }),
        ...(universityId !== undefined && { universityId }),
      },
      include: {
        collage: true,
        University: true,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

async function handleDELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingSection = await db.section.findUnique({
      where: { id },
    });

    if (!existingSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    await db.section.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { GET, PUT, PATCH, DELETE } = withApiTrackingMethods(
  { GET: handleGET, PUT: handlePUT, PATCH: handlePATCH, DELETE: handleDELETE },
  ApiTrackingPresets.crud('Section')
);
