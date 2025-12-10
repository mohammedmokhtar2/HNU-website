import { NextRequest, NextResponse } from 'next/server';
import { withApiTrackingMethods, ApiTrackingPresets } from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';
import { handleCORS, addCORSHeaders } from '@/lib/cors';

// GET /api/logs/stats - Get log statistics and analytics
async function handleGET(req: NextRequest) {

  // Handle CORS preflight
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const where =
      Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    // Get basic statistics
    const totalLogs = await db.auditLog.count({ where });

    // Get logs by action
    const logsByAction = await db.auditLog.groupBy({
      by: ['action'],
      where,
      _count: {
        action: true,
      },
      orderBy: {
        _count: {
          action: 'desc',
        },
      },
      take: 10,
    });

    // Get logs by entity
    const logsByEntity = await db.auditLog.groupBy({
      by: ['entity'],
      where,
      _count: {
        entity: true,
      },
      orderBy: {
        _count: {
          entity: 'desc',
        },
      },
      take: 10,
    });

    // Get logs by user
    const logsByUser = await db.auditLog.groupBy({
      by: ['userId'],
      where: {
        ...where,
        userId: { not: null },
      },
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: 'desc',
        },
      },
      take: 10,
    });

    // Get user details for top users
    const topUserIds = logsByUser
      .map(log => log.userId)
      .filter((id): id is string => id !== null);
    const topUsers = await db.user.findMany({
      where: {
        id: { in: topUserIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Create user stats with names
    const userStats = logsByUser.map(log => {
      const user = topUsers.find(u => u.id === log.userId);
      return {
        userId: log.userId,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'Unknown',
        userRole: user?.role || 'Unknown',
        count: log._count.userId,
      };
    });

    // Get logs by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logsByDay = await db.auditLog.groupBy({
      by: ['createdAt'],
      where: {
        ...where,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Format daily stats
    const dailyStats = logsByDay.map(log => ({
      date: log.createdAt.toISOString().split('T')[0],
      count: log._count.id,
    }));

    // Get recent activity (last 10 logs)
    const recentLogs = await db.auditLog.findMany({
      where,
      include: {
        clerkUser: {
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
      take: 10,
    });

    const response = NextResponse.json({
      totalLogs,
      logsByAction,
      logsByEntity,
      userStats,
      dailyStats,
      recentLogs,
    });

    return addCORSHeaders(response);
  } catch (error) {
    console.error('Error fetching log stats:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch log statistics' },
      { status: 500 }
    );
    return addCORSHeaders(response);
  }
}

// Handle OPTIONS requests for CORS preflight
async function handleOPTIONS(req: NextRequest) {

  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  // If not a preflight request, return a simple response
  return new NextResponse(null, { status: 200 });
}

// Apply tracking to all methods using crud preset
export const { GET, OPTIONS } = withApiTrackingMethods(
  { GET: handleGET, OPTIONS: handleOPTIONS },
  ApiTrackingPresets.crud('Log')
);