import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';

async function handleGET() {
  try {
    const universities = await db.university.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sections: true,
        colleges: true,
      },
    });

    return NextResponse.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}

async function handlePOST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, config } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const exists = await db.university.findUnique({
      where: { slug },
    });

    if (exists) {
      return NextResponse.json(
        { error: 'University with this slug already exists' },
        { status: 400 }
      );
    }

    const university = await db.university.create({
      data: {
        name,
        slug,
        config: config || {},
      },
    });

    return NextResponse.json(university);
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { GET, POST } = withApiTrackingMethods(
  { GET: handleGET, POST: handlePOST },
  ApiTrackingPresets.crud('University')
);
