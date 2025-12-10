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

async function handleGet(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const college = await db.college.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        statistics: true,
        programs: true,
        University: true,
      },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error('Error fetching college:', error);
    return NextResponse.json(
      { error: 'Failed to fetch college' },
      { status: 500 }
    );
  }
}

async function handlePatch(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, type, config, universityId } = body;

    const existingCollege = await db.college.findUnique({
      where: { id },
    });

    if (!existingCollege) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // If slug is being changed, check if new slug is already taken
    if (slug && slug !== existingCollege.slug) {
      const slugExists = await db.college.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'College with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const college = await db.college.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        slug: slug !== undefined ? slug : undefined,
        type: type !== undefined ? type : undefined,
        config: config !== undefined ? config : undefined,
        universityId: universityId !== undefined ? universityId : undefined,
      },
    });

    return NextResponse.json(college);
  } catch (error) {
    console.error('Error updating college:', error);
    return NextResponse.json(
      { error: 'Failed to update college' },
      { status: 500 }
    );
  }
}

async function handleDelete(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // Check if college exists
    const existingCollege = await db.college.findUnique({
      where: { id },
    });

    if (!existingCollege) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Delete the college
    await db.college.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error('Error deleting college:', error);
    return NextResponse.json(
      { error: 'Failed to delete college' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { GET, PATCH, DELETE } = withApiTrackingMethods(
  {
    GET: handleGet,
    PATCH: handlePatch,
    DELETE: handleDelete,
  },
  ApiTrackingPresets.crud('College')
);
