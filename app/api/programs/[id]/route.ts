import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';
import { UpdateProgramInput } from '@/types/program';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

export const PUT = withAuditLog(
  async (request: NextRequest, { params }: RouteParams) => {
    try {
      const { id } = await params;
      const body: UpdateProgramInput = await request.json();

      // Check if program exists
      const existingProgram = await db.program.findUnique({
        where: { id },
      });

      if (!existingProgram) {
        return NextResponse.json(
          { error: 'Program not found' },
          { status: 404 }
        );
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
  },
  {
    action: 'UPDATE_PROGRAM',
    extract: () => {
      return {
        entity: 'Program',
      };
    },
  }
);

export const DELETE = withAuditLog(
  async (request: NextRequest, { params }: RouteParams) => {
    try {
      const { id } = await params;

      // Check if program exists
      const existingProgram = await db.program.findUnique({
        where: { id },
      });

      if (!existingProgram) {
        return NextResponse.json(
          { error: 'Program not found' },
          { status: 404 }
        );
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
  },
  {
    action: 'DELETE_PROGRAM',
    extract: () => {
      return {
        entity: 'Program',
      };
    },
  }
);
