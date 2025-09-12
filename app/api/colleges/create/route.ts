import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';
import { NextResponse } from 'next/server';

export const POST = withAuditLog(
  async (req: Request) => {
    try {
      const body = await req.json();
      const { name, slug, type, config, createdById } = body;

      if (!name || !slug || !type) {
        return NextResponse.json(
          { error: 'Name, slug, and type are required' },
          { status: 400 }
        );
      }

      const exists = await db.college.findUnique({
        where: { slug },
      });

      if (exists) {
        return NextResponse.json(
          { error: 'College with this slug already exists' },
          { status: 400 }
        );
      }

      const college = await db.college.create({
        data: {
          name,
          slug,
          type,
          config: config || {},
          createdById: createdById || null,
          // universityId: universityId || null,
        },
      });

      return NextResponse.json(college);
    } catch (error) {
      console.error('Error creating college:', error);
      return NextResponse.json(
        { error: 'Failed to create college' },
        { status: 500 }
      );
    }
  },
  {
    action: 'CREATE_COLLEGE',
    extract: () => {
      return {
        entity: 'College',
      };
    },
  }
);
