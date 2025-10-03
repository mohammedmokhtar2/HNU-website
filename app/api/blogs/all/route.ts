import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { NextRequest, NextResponse } from 'next/server';

async function handleGET(req: NextRequest) {
  const blogs = await db.blogs.findMany();
  return NextResponse.json(blogs);
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('Blog')
);
