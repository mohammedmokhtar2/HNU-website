import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  try {
    const { collegeId } = await params;

    const sections = await db.section.findMany({
      where: {
        collageId: collegeId,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        collage: true,
        University: true,
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching college sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch college sections' },
      { status: 500 }
    );
  }
}
