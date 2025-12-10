import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTracking,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';

export const POST = withApiTracking(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      type,
      config,
      createdById,
      description,
      fees,
      studentsCount,
      programsCount,
      facultyCount,
      establishedYear,
      universityId,
    } = body;

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: 'Name, slug, and type are required' },
        { status: 400 }
      );
    }

    const exists = await db.college.findUnique({
      where: { slug },
    });

    if (exists) {
      return NextResponse.json(
        { error: 'College with this slug already exists' },
        { status: 400 }
      );
    }

    const college = await db.college.create({
      data: {
        name,
        slug,
        type,
        description,
        config: config || {},
        fees: fees || null,
        studentsCount: studentsCount || null,
        programsCount: programsCount || null,
        facultyCount: facultyCount || null,
        establishedYear: establishedYear || null,
        createdById: createdById || null,
        universityId: universityId || null,
      },
    });

    return NextResponse.json(college);
  } catch (error) {
    console.error('Error creating college:', error);
    return NextResponse.json(
      { error: 'Failed to create college' },
      { status: 500 }
    );
  }
}, ApiTrackingPresets.crud('College'));
