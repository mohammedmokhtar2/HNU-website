import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';

async function handleGET(req: NextRequest) {
  try {
    const statistics = await db.statistic.findMany({
      include: {
        collage: true,
      },
    });

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

async function handlePOST(req: NextRequest) {
  try {
    const body = await req.json();
    const { label, collageId } = body;

    if (!label) {
      return NextResponse.json({ error: 'Label is required' }, { status: 400 });
    }

    const statistic = await db.statistic.create({
      data: {
        label,
        collageId,
      },
    });

    return NextResponse.json(statistic);
  } catch (error) {
    console.error('Error creating statistic:', error);
    return NextResponse.json(
      { error: 'Failed to create statistic' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { GET, POST } = withApiTrackingMethods(
  { GET: handleGET, POST: handlePOST },
  ApiTrackingPresets.crud('Statistic')
);
