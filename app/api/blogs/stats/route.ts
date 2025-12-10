import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';

async function handleGET(req: NextRequest) {
  try {
    // Get total counts
    const total = await db.blogs.count();
    const published = await db.blogs.count({ where: { isPublished: true } });
    const draft = await db.blogs.count({ where: { isPublished: false } });
    const featured = await db.blogs.count({ where: { isFeatured: true } });

    // Get blogs by university
    const blogsByUniversity = await db.blogs.groupBy({
      by: ['universityId'],
      _count: {
        id: true,
      },
      where: {
        universityId: {
          not: null,
        },
      },
    });

    const universityStats = await Promise.all(
      blogsByUniversity.map(async stat => {
        const university = await db.university.findUnique({
          where: { id: stat.universityId! },
          select: { name: true },
        });
        return {
          universityId: stat.universityId!,
          universityName: university?.name || 'Unknown University',
          count: stat._count.id,
        };
      })
    );

    // Get blogs by college
    const blogsByCollege = await db.blogs.groupBy({
      by: ['collageId'],
      _count: {
        id: true,
      },
      where: {
        collageId: {
          not: null,
        },
      },
    });

    const collegeStats = await Promise.all(
      blogsByCollege.map(async stat => {
        const college = await db.college.findUnique({
          where: { id: stat.collageId! },
          select: { name: true },
        });
        return {
          collageId: stat.collageId!,
          collageName: college?.name || 'Unknown College',
          count: stat._count.id,
        };
      })
    );

    // Get all tags and count their usage
    const allBlogs = await db.blogs.findMany({
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    allBlogs.forEach(blog => {
      blog.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const tagStats = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    const stats = {
      total,
      published,
      draft,
      featured,
      byUniversity: universityStats,
      byCollege: collegeStats,
      byTags: tagStats,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching blog statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog statistics' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('Blog')
);
