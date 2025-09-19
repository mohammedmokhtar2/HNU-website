import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogIds } = body;

    if (!blogIds || !Array.isArray(blogIds) || blogIds.length === 0) {
      return NextResponse.json(
        { error: 'Valid blog IDs array is required' },
        { status: 400 }
      );
    }

    // Update the order for each blog
    const updatePromises = blogIds.map((blogId: string, index: number) =>
      db.blogs.update({
        where: { id: blogId },
        data: { order: index },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Blogs reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering blogs:', error);
    return NextResponse.json(
      { error: 'Failed to reorder blogs' },
      { status: 500 }
    );
  }
}
