import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { UpdateProgramInput } from '@/types/program';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

async function handleGET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const program = await db.program.findUnique({
      where: { id },
      include: {
        collage: true,
      },
    });

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

async function handlePUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateProgramInput = await req.json();

    // Check if program exists
    const existingProgram = await db.program.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    // Check if collage exists if collageId is provided
    if (body.collageId) {
      const collage = await db.college.findUnique({
        where: { id: body.collageId },
      });

      if (!collage) {
        return NextResponse.json(
          { error: 'College not found' },
          { status: 404 }
        );
      }
    }

    const program = await db.program.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        config: body.config,
        collageId: body.collageId,
      },
      include: {
        collage: true,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

async function handleDELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if program exists
    const existingProgram = await db.program.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    await db.program.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Program deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Failed to delete program' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using CRUD preset
export const { GET, PUT, DELETE } = withApiTrackingMethods(
  { GET: handleGET, PUT: handlePUT, DELETE: handleDELETE },
  ApiTrackingPresets.crud('Program')
);
