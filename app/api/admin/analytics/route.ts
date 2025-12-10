import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { NextRequest, NextResponse } from 'next/server';

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Helper function to safely execute queries
    const safeQuery = async (
      queryFn: () => Promise<any>,
      defaultValue: any = 0
    ) => {
      try {
        return await queryFn();
      } catch (error) {
        console.warn('Query failed:', error);
        return defaultValue;
      }
    };

    // Get basic analytics data with error handling
    const [
      userStats,
      universityStats,
      collegeStats,
      programStats,
      blogStats,
      messageStats,
      auditStats,
      permissionStats,
      statisticStats,
      recentActivity,
      collegeTypeDistribution,
      userRoleDistribution,
      pageSectionTypeDistribution,
      actionDistribution,
      blogTagDistribution,
      messageData,
      messageTrends,
    ] = await Promise.all([
      // Basic counts
      safeQuery(() => db.user.count()),
      safeQuery(() => db.university.count()),
      safeQuery(() => db.college.count()),
      safeQuery(() => db.program.count()),
      safeQuery(() => db.blogs.count()),
      safeQuery(() => db.messages.count()),
      safeQuery(() => db.auditLog.count()),
      safeQuery(() => db.permission.count()),
      safeQuery(() => db.statistic.count()),

      // Recent activity (last 7 days)
      safeQuery(
        () =>
          db.auditLog.findMany({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
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
          }),
        []
      ),

      // Distribution data
      safeQuery(
        () =>
          db.college.groupBy({
            by: ['type'],
            _count: { id: true },
          }),
        []
      ),

      safeQuery(
        () =>
          db.user.groupBy({
            by: ['role'],
            _count: { id: true },
          }),
        []
      ),

      safeQuery(
        () =>
          db.pageSection.groupBy({
            by: ['type'],
            _count: { id: true },
          }),
        []
      ),

      safeQuery(
        () =>
          db.auditLog.groupBy({
            by: ['action'],
            _count: { id: true },
          }),
        []
      ),

      safeQuery(
        () =>
          db.blogs.findMany({
            select: {
              tags: true,
            },
          }),
        []
      ),

      // Message analytics data
      safeQuery(
        () =>
          db.messages.findMany({
            select: {
              id: true,
              messageConfig: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          }),
        []
      ),

      // Message trends (daily for last 30 days)
      safeQuery(
        () =>
          db.messages.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            where: {
              createdAt: {
                gte: startDate,
              },
            },
          }),
        []
      ),
    ]);

    // Calculate growth rate (simplified)
    const growthRate = userStats > 0 ? userStats / 100 : 0;

    // Calculate health metrics
    const healthMetrics = {
      dataIntegrity: 0, // Simplified for now
      totalRecords:
        userStats +
        universityStats +
        collegeStats +
        programStats +
        blogStats +
        messageStats +
        auditStats +
        permissionStats +
        statisticStats,
      recentActivity: recentActivity.length,
    };

    const healthScore = Math.max(0, 100 - healthMetrics.dataIntegrity * 10);

    // Process blog tags distribution
    const blogTagsMap = new Map<string, number>();
    blogTagDistribution.forEach((blog: any) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach((tag: string) => {
          blogTagsMap.set(tag, (blogTagsMap.get(tag) || 0) + 1);
        });
      }
    });
    const blogTagsDistribution = Array.from(blogTagsMap.entries()).map(
      ([tag, count]) => ({
        tag,
        count,
      })
    );

    // Calculate engagement metrics
    const userEngagementRate =
      userStats > 0
        ? Math.min(100, Math.round((recentActivity.length / userStats) * 100))
        : 0;
    const collegeEngagementRate =
      collegeStats > 0
        ? Math.min(100, Math.round((programStats / collegeStats) * 100))
        : 0;
    const programEngagementRate =
      programStats > 0
        ? Math.min(100, Math.round((collegeStats / programStats) * 100))
        : 0;
    const blogPublishingRate =
      blogStats > 0
        ? Math.min(
            100,
            Math.round((blogStats / Math.max(1, collegeStats)) * 100)
          )
        : 0;

    // Process message analytics
    const messageAnalytics = {
      totalMessages: messageStats,
      recentMessages: messageData.slice(0, 10),

      // Message status distribution
      statusDistribution: (() => {
        const statusMap = new Map<string, number>();
        messageData.forEach((msg: any) => {
          const config = msg.messageConfig as any;
          const status = config?.status || 'Unknown';
          statusMap.set(status, (statusMap.get(status) || 0) + 1);
        });
        return Array.from(statusMap.entries()).map(([status, count]) => ({
          status,
          count,
        }));
      })(),

      // Message priority distribution
      priorityDistribution: (() => {
        const priorityMap = new Map<string, number>();
        messageData.forEach((msg: any) => {
          const config = msg.messageConfig as any;
          const priority = config?.priority || 'Normal';
          priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);
        });
        return Array.from(priorityMap.entries()).map(([priority, count]) => ({
          priority,
          count,
        }));
      })(),

      // Message type distribution
      typeDistribution: (() => {
        const typeMap = new Map<string, number>();
        messageData.forEach((msg: any) => {
          const config = msg.messageConfig as any;
          const type = config?.type || 'Email';
          typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });
        return Array.from(typeMap.entries()).map(([type, count]) => ({
          type,
          count,
        }));
      })(),

      // Daily message trends
      dailyTrends: messageTrends.map((trend: any) => ({
        date: trend.createdAt,
        count: trend._count.id,
      })),

      // Hourly distribution (mock data for now)
      hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: Math.floor(Math.random() * 5), // Mock data
      })),

      // Message performance metrics
      performanceMetrics: {
        averageResponseTime: '2.5s',
        deliveryRate: 98.5,
        openRate: 45.2,
        clickRate: 12.8,
        bounceRate: 1.5,
      },

      // Top senders (mock data)
      topSenders: [
        { email: 'admin@hnu.edu', count: 3 },
        { email: 'system@hnu.edu', count: 2 },
        { email: 'noreply@hnu.edu', count: 1 },
      ],
    };

    const analytics = {
      overview: {
        totalUsers: userStats,
        totalUniversities: universityStats,
        totalColleges: collegeStats,
        totalPrograms: programStats,
        totalSections: 0, // Not available yet
        totalPages: 0, // Not available yet
        totalPageSections: 0, // Not available yet
        totalBlogs: blogStats,
        totalMessages: messageStats,
        totalAuditLogs: auditStats,
        totalPermissions: permissionStats,
        totalStatistics: statisticStats,
        growthRate: Math.round(growthRate * 100) / 100,
        healthScore: Math.round(healthScore * 100) / 100,
        dataIntegrity: healthMetrics.dataIntegrity,
        totalRecords: healthMetrics.totalRecords,
        recentActivity: healthMetrics.recentActivity,
      },
      engagement: {
        totalUsers: userStats,
        activeUsers: Math.max(1, Math.round(userStats * 0.8)), // Estimate 80% active
        userEngagementRate: userEngagementRate,
        totalColleges: collegeStats,
        collegesWithPrograms: Math.min(collegeStats, programStats),
        collegeEngagementRate: collegeEngagementRate,
        totalPrograms: programStats,
        programsWithColleges: Math.min(programStats, collegeStats),
        programEngagementRate: programEngagementRate,
        totalBlogs: blogStats,
        publishedBlogs: blogStats, // Assuming all blogs are published
        blogPublishingRate: blogPublishingRate,
      },
      systemHealth: {
        healthScore: Math.round(healthScore * 100) / 100,
        dataIntegrity: healthMetrics.dataIntegrity,
        totalRecords: healthMetrics.totalRecords,
        recentActivity: healthMetrics.recentActivity,
        systemUptime: 99.9, // Mock uptime
        performanceMetrics: {
          responseTime: '120ms',
          throughput: '1000 req/min',
          errorRate: '0.1%',
        },
      },
      distributions: {
        collegeTypes: collegeTypeDistribution.map((item: any) => ({
          type: item.type,
          count: item._count.id,
        })),
        userRoles: userRoleDistribution.map((item: any) => ({
          role: item.role,
          count: item._count.id,
        })),
        sectionTypes: [], // Not available yet
        pageSectionTypes: pageSectionTypeDistribution.map((item: any) => ({
          type: item.type,
          count: item._count.id,
        })),
        actions: actionDistribution.map((item: any) => ({
          action: item.action,
          count: item._count.id,
        })),
        blogTags: blogTagsDistribution,
      },
      topPerformers: {
        collegesByPrograms: [],
        collegesBySections: [],
        collegesByUsers: [],
        universitiesByColleges: [],
        universitiesByBlogs: [],
        universitiesBySections: [],
      },
      recentActivity: {
        users: [],
        colleges: [],
        blogs: [],
        programs: [],
        messages: [],
        auditLogs: recentActivity.map((log: any) => ({
          id: log.id,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
          createdAt: log.createdAt.toISOString(),
          user: log.user
            ? {
                id: log.user.id,
                name: log.user.name,
                email: log.user.email,
                role: log.user.role,
              }
            : null,
        })),
        systemActivity: [],
      },
      trends: {
        blogPublishing: [],
        userRegistration: [],
        collegeCreation: [],
        programCreation: [],
        messageTrends: messageAnalytics.dailyTrends,
        auditTrends: [],
      },
      messageAnalytics: messageAnalytics,
      timeRange: parseInt(timeRange),
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using search preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.search('admin')
);
