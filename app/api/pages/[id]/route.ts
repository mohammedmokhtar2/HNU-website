import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await db.page.findUnique({
      where: {
        id: params.id,
      },
      include: {
        collage: true,
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, slug, config, isActive, collageId, universityId, order } =
      body;

    const page = await db.page.update({
      where: {
        id: params.id,
      },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(config && { config }),
        ...(isActive !== undefined && { isActive }),
        ...(collageId !== undefined && { collageId }),
        ...(universityId && { universityId }),
        ...(order !== undefined && { order }),
      },
      include: {
        collage: true,
        sections: true,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.page.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
