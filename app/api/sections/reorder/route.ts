import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';

async function handlePATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { sections } = body;

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Sections array is required' },
        { status: 400 }
      );
    }

    // Update each section's order
    const updatePromises = sections.map(
      (section: { id: string; order: number }) =>
        db.section.update({
          where: { id: section.id },
          data: { order: section.order },
        })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering sections:', error);
    return NextResponse.json(
      { error: 'Failed to reorder sections' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { PATCH } = withApiTrackingMethods(
  { PATCH: handlePATCH },
  ApiTrackingPresets.crud('Section')
);
