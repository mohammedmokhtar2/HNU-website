import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

async function handleDELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // Check if college exists
    const existingCollege = await db.college.findUnique({
      where: { id },
    });

    if (!existingCollege) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Delete the college
    await db.college.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'College deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting college:', error);
    return NextResponse.json(
      { error: 'Failed to delete college' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { DELETE } = withApiTrackingMethods(
  { DELETE: handleDELETE },
  ApiTrackingPresets.crud('College')
);
