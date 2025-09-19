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

    // Toggle published status and set publishedAt if publishing
    const updateData: any = {
      isPublished: !existingBlog.isPublished,
    };

    if (!existingBlog.isPublished) {
      // If publishing for the first time, set publishedAt
      updateData.publishedAt = new Date();
    }

    const updatedBlog = await db.blogs.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error toggling blog published status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle published status' },
      { status: 500 }
    );
  }
}
