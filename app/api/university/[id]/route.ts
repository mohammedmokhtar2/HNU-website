import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

async function handleGET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const university = await db.university.findUnique({
      where: { id },
      include: {
        sections: true,
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
    console.error('Error fetching university:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university' },
      { status: 500 }
    );
  }
}

async function handlePATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, config } = body;

    const existingUniversity = await db.university.findUnique({
      where: { id },
    });

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check if new slug is already taken
    if (slug && slug !== existingUniversity.slug) {
      const slugExists = await db.university.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'University with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const university = await db.university.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        slug: slug !== undefined ? slug : undefined,
        config: config !== undefined ? config : undefined,
      },
    });

    return NextResponse.json(university);
  } catch (error) {
    console.error('Error updating university:', error);
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    );
  }
}

async function handleDELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // Check if university exists
    const existingUniversity = await db.university.findUnique({
      where: { id },
    });

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Delete the university
    await db.university.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'University deleted successfully' });
  } catch (error) {
    console.error('Error deleting university:', error);
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { GET, PATCH, DELETE } = withApiTrackingMethods(
  { GET: handleGET, PATCH: handlePATCH, DELETE: handleDELETE },
  ApiTrackingPresets.crud('University')
);
