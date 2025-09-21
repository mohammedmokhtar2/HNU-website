import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    const section = await db.section.findUnique({
      where: { id },
      include: {
        collage: true,
        University: true,
      },
    });

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}

export const PUT = withAuditLog(
  async (request: NextRequest, { params }: RouteParams) => {
    try {
      const { id } = params;
      const body = await request.json();
      const { type, content, order, collageId, universityId } = body;

      if (!id) {
        return NextResponse.json(
          { error: 'Section ID is required' },
          { status: 400 }
        );
      }

      // Check if section exists
      const existingSection = await db.section.findUnique({
        where: { id },
      });

      if (!existingSection) {
        return NextResponse.json(
          { error: 'Section not found' },
          { status: 404 }
        );
      }

      // Validate that section belongs to either university or college
      if (universityId && collageId) {
        return NextResponse.json(
          { error: 'Section cannot belong to both university and college' },
          { status: 400 }
        );
      }

      const section = await db.section.update({
        where: { id },
        data: {
          ...(type && { type }),
          ...(content && { content }),
          ...(order !== undefined && { order }),
          ...(collageId !== undefined && { collageId }),
          ...(universityId !== undefined && { universityId }),
        },
        include: {
          collage: true,
          University: true,
        },
      });

      return NextResponse.json(section);
    } catch (error) {
      console.error('Error updating section:', error);
      return NextResponse.json(
        { error: 'Failed to update section' },
        { status: 500 }
      );
    }
  },
  {
    action: 'UPDATE_SECTION',
    extract: (request: NextRequest, { params }: RouteParams) => {
      return {
        entity: 'Section',
        entityId: params.id,
      };
    },
  }
);

export const DELETE = withAuditLog(
  async (request: NextRequest, { params }: RouteParams) => {
    try {
      const { id } = params;

      if (!id) {
        return NextResponse.json(
          { error: 'Section ID is required' },
          { status: 400 }
        );
      }

      // Check if section exists
      const existingSection = await db.section.findUnique({
        where: { id },
      });

      if (!existingSection) {
        return NextResponse.json(
          { error: 'Section not found' },
          { status: 404 }
        );
      }

      await db.section.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'Section deleted successfully' });
    } catch (error) {
      console.error('Error deleting section:', error);
      return NextResponse.json(
        { error: 'Failed to delete section' },
        { status: 500 }
      );
    }
  },
  {
    action: 'DELETE_SECTION',
    extract: (request: NextRequest, { params }: RouteParams) => {
      return {
        entity: 'Section',
        entityId: params.id,
      };
    },
  }
);
