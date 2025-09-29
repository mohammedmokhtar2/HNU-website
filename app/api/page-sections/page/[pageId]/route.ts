import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const sections = await db.pageSection.findMany({
      where: {
        pageId: params.pageId,
      },
      include: {
        page: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching page sections by page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
