import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { handleCORS, addCORSHeaders } from '@/lib/cors';

// GET /api/logs - Get all audit logs with pagination and filtering
export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (entity) where.entity = { contains: entity, mode: 'insensitive' };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Get total count for pagination
    const totalCount = await db.auditLog.count({ where });

    // Get logs with user information
    const logs = await db.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const response = NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

    return addCORSHeaders(response);
  } catch (error) {
    console.error('Error fetching logs:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
    return addCORSHeaders(response);
  }
}

// DELETE /api/logs - Delete logs (bulk deletion)
export async function DELETE(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  try {
    const body = await request.json();
    const { logIds, filters } = body;

    let deletedCount = 0;

    if (logIds && logIds.length > 0) {
      // Delete specific logs by IDs
      if (logIds.length > 100) {
        return NextResponse.json(
          { error: 'Cannot delete more than 100 logs at once' },
          { status: 400 }
        );
      }

      const result = await db.auditLog.deleteMany({
        where: {
          id: { in: logIds },
        },
      });
      deletedCount = result.count;
    } else if (filters) {
      // Delete logs based on filters
      const where: any = {};

      if (filters.userId) where.userId = filters.userId;
      if (filters.action)
        where.action = { contains: filters.action, mode: 'insensitive' };
      if (filters.entity)
        where.entity = { contains: filters.entity, mode: 'insensitive' };

      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate)
          where.createdAt.gte = new Date(filters.startDate);
        if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
      }

      // First count how many would be deleted
      const countToDelete = await db.auditLog.count({ where });

      if (countToDelete > 100) {
        return NextResponse.json(
          {
            error:
              'Cannot delete more than 100 logs at once. Please refine your filters.',
          },
          { status: 400 }
        );
      }

      const result = await db.auditLog.deleteMany({ where });
      deletedCount = result.count;
    } else {
      return NextResponse.json(
        { error: 'Either logIds or filters must be provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Successfully deleted ${deletedCount} logs`,
      deletedCount,
    });
  } catch (error) {
    console.error('Error deleting logs:', error);
    return NextResponse.json(
      { error: 'Failed to delete logs' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  // If not a preflight request, return a simple response
  return new NextResponse(null, { status: 200 });
}
