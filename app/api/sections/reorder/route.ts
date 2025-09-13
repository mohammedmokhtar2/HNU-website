import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

export const PATCH = withAuditLog(
  async (req: Request) => {
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
  },
  {
    action: 'REORDER_SECTIONS',
    extract: () => {
      return {
        entity: 'Section',
      };
    },
  }
);
