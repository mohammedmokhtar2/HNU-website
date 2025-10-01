import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const section = await db.pageSection.findUnique({
      where: {
        id: id,
      },
      include: {
        page: true,
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: 'Page section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error fetching page section:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { type, title, content, mediaUrl, order, pageId } = body;

    const section = await db.pageSection.update({
      where: {
        id: id,
      },
      data: {
        ...(type && { type }),
        ...(title && { title }),
        ...(content && { content }),
        ...(mediaUrl && { mediaUrl }),
        ...(order !== undefined && { order }),
        ...(pageId && { pageId }),
      },
      include: {
        page: true,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error updating page section:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await db.pageSection.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page section:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
