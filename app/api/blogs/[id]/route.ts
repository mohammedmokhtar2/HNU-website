import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';
import { UpdateBlogInput } from '@/types/blog';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

async function handleGET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const blog = await db.blogs.findUnique({
      where: { id },
      include: {
        University: true,
        createdBy: true,
        collage: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

async function handlePATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateBlogInput = await request.json();

    // Check if blog exists
    const existingBlog = await db.blogs.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // If slug is being updated, check if it's unique
    if (body.slug && body.slug !== existingBlog.slug) {
      const slugExists = await db.blogs.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A blog with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update the blog
    const updatedBlog = await db.blogs.update({
      where: { id },
      data: {
        ...body,
        universityId:
          body.universityId === null ? undefined : body.universityId,
        collageId: body.collageId === null ? undefined : body.collageId,
        publishedAt: body.publishedAt === null ? undefined : body.publishedAt,
        scheduledAt: body.scheduledAt === null ? undefined : body.scheduledAt,
        eventConfig:
          body.eventConfig === null
            ? undefined
            : JSON.parse(JSON.stringify(body.eventConfig)),
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

async function handleDELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if blog exists
    const existingBlog = await db.blogs.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Delete the blog
    await db.blogs.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET, PATCH, DELETE } = withApiTrackingMethods(
  { GET: handleGET, PATCH: handlePATCH, DELETE: handleDELETE },
  ApiTrackingPresets.crud('Blog')
);
