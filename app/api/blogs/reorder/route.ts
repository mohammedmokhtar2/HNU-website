import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

async function handlePATCH(req: NextRequest) {
  try {
    const body = await req.json();
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

// Apply tracking to all methods using crud preset
export const { PATCH } = withApiTrackingMethods(
  { PATCH: handlePATCH },
  ApiTrackingPresets.crud('Blog')
);
