import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

async function handleGET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const blog = await db.blogs.findUnique({
      where: { slug },
      include: {
        University: true,
        createdBy: true,
        collage: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('Blog')
);
