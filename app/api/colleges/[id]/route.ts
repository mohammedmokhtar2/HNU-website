import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const college = await db.college.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        statistics: true,
        programs: true,
        University: true,
      },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error('Error fetching college:', error);
    return NextResponse.json(
      { error: 'Failed to fetch college' },
      { status: 500 }
    );
  }
}

export const PATCH = withAuditLog(
  async (req: Request, { params }: Params) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const { name, slug, type, config, universityId } = body;

      const existingCollege = await db.college.findUnique({
        where: { id },
      });

      if (!existingCollege) {
        return NextResponse.json(
          { error: 'College not found' },
          { status: 404 }
        );
      }

      // If slug is being changed, check if new slug is already taken
      if (slug && slug !== existingCollege.slug) {
        const slugExists = await db.college.findUnique({
          where: { slug },
        });

        if (slugExists) {
          return NextResponse.json(
            { error: 'College with this slug already exists' },
            { status: 400 }
          );
        }
      }

      const college = await db.college.update({
        where: { id },
        data: {
          name: name !== undefined ? name : undefined,
          slug: slug !== undefined ? slug : undefined,
          type: type !== undefined ? type : undefined,
          config: config !== undefined ? config : undefined,
          universityId: universityId !== undefined ? universityId : undefined,
        },
      });

      return NextResponse.json(college);
    } catch (error) {
      console.error('Error updating college:', error);
      return NextResponse.json(
        { error: 'Failed to update college' },
        { status: 500 }
      );
    }
  },
  {
    action: 'UPDATE_COLLEGE',
    extract: () => {
      return {
        entity: 'College',
      };
    },
  }
);

export const DELETE = withAuditLog(
  async (req: Request, { params }: Params) => {
    try {
      const { id } = await params;

      // Check if college exists
      const existingCollege = await db.college.findUnique({
        where: { id },
      });

      if (!existingCollege) {
        return NextResponse.json(
          { error: 'College not found' },
          { status: 404 }
        );
      }

      // Delete the college
      await db.college.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'College deleted successfully' });
    } catch (error) {
      console.error('Error deleting college:', error);
      return NextResponse.json(
        { error: 'Failed to delete college' },
        { status: 500 }
      );
    }
  },
  {
    action: 'DELETE_COLLEGE',
    extract: () => {
      return {
        entity: 'College',
      };
    },
  }
);
