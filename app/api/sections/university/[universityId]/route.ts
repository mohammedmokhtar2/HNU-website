import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ universityId: string }> }
) {
  try {
    const { universityId } = await params;

    const sections = await db.section.findMany({
      where: {
        universityId: universityId,
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
    console.error('Error fetching university sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university sections' },
      { status: 500 }
    );
  }
}
