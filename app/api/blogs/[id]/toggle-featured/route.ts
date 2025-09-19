import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check if blog exists
    const existingBlog = await db.blogs.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Toggle featured status
    const updatedBlog = await db.blogs.update({
      where: { id },
      data: {
        isFeatured: !existingBlog.isFeatured,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error toggling blog featured status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle featured status' },
      { status: 500 }
    );
  }
}
