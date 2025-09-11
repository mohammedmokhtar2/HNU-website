import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = params;

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

export const PATCH = withAuditLog(
  async (req: Request, { params }: Params) => {
    try {
      const { id } = params;
      const body = await req.json();
      const { type, title, content, mediaUrl, order, collageId, universityId } =
        body;

      const existingSection = await db.section.findUnique({
        where: { id },
      });

      if (!existingSection) {
        return NextResponse.json(
          { error: 'Section not found' },
          { status: 404 }
        );
      }

      const section = await db.section.update({
        where: { id },
        data: {
          type: type !== undefined ? type : undefined,
          title: title !== undefined ? title : undefined,
          content: content !== undefined ? content : undefined,
          mediaUrl: mediaUrl !== undefined ? mediaUrl : undefined,
          order: order !== undefined ? order : undefined,
          collageId: collageId !== undefined ? collageId : undefined,
          universityId: universityId !== undefined ? universityId : undefined,
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
    extract: req => {
      // Extract the id from the URL
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      const id = pathParts[pathParts.length - 1];

      return {
        entity: 'Section',
        entityId: id,
      };
    },
  }
);

export const DELETE = withAuditLog(
  async (req: Request, { params }: Params) => {
    try {
      const { id } = params;

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

      // Delete the section
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
    extract: req => {
      // Extract the id from the URL
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      const id = pathParts[pathParts.length - 1];

      return {
        entity: 'Section',
        entityId: id,
      };
    },
  }
);
