import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
