import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export const PUT = withAuditLog(
  async (req: Request, { params }: Params) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const {
        name,
        slug,
        type,
        config,
        universityId,
        description,
        fees,
        studentsCount,
        programsCount,
        facultyCount,
        establishedYear,
      } = body;

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
          description: description !== undefined ? description : undefined,
          fees: fees !== undefined ? fees : undefined,
          studentsCount:
            studentsCount !== undefined ? studentsCount : undefined,
          programsCount:
            programsCount !== undefined ? programsCount : undefined,
          facultyCount: facultyCount !== undefined ? facultyCount : undefined,
          establishedYear:
            establishedYear !== undefined ? establishedYear : undefined,
          // universityId: universityId !== undefined ? universityId : undefined,
        },
        include: {
          sections: {
            orderBy: {
              order: 'asc',
            },
          },
          statistics: true,
          University: true,
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
