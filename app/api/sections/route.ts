import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { SectionType } from '@/types/enums';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universityId = searchParams.get('universityId');
    const collegeId = searchParams.get('collegeId');
    const type = searchParams.get('type');

    // Build where clause based on query parameters
    const whereClause: any = {};

    if (universityId) {
      whereClause.universityId = universityId;
    }

    if (collegeId) {
      whereClause.collageId = collegeId;
    }

    if (type) {
      whereClause.type = type;
    }

    const sections = await db.section.findMany({
      where: whereClause,
      orderBy: [
        { universityId: 'asc' },
        { collageId: 'asc' },
        { order: 'asc' },
      ],
      include: {
        collage: true,
        University: true,
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, content, order, collageId, universityId } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
        { status: 400 }
      );
    }

    // Validate that type is a valid SectionType
    if (!Object.values(SectionType).includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid section type: ${type}. Valid types are: ${Object.values(SectionType).join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate that section belongs to either university or college
    if (!universityId && !collageId) {
      return NextResponse.json(
        { error: 'Section must belong to either a university or a college' },
        { status: 400 }
      );
    }

    const section = await db.section.create({
      data: {
        type,
        content,
        order: order || 0,
        collageId,
        universityId,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}
