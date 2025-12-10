import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { UserType } from '@/types/enums';

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userRole = searchParams.get('role') || 'GUEST';
    const timeRange = searchParams.get('timeRange') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    console.log('🔄 Fetching dashboard data for role:', userRole);

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

    // Get basic counts - available to all roles
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
    ]);

    // Get user role distribution
    const userRoleDistribution = await safeQuery(
      () =>
        db.user.groupBy({
          by: ['role'],
          _count: { id: true },
        }),
      []
    );

    // Get college type distribution
    const collegeTypeDistribution = await safeQuery(
      () =>
        db.college.groupBy({
          by: ['type'],
          _count: { id: true },
        }),
      []
    );

    // Get recent activity (last 7 days) - available to all roles
    const recentActivity = await safeQuery(
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
    );

    // Get blog statistics
    const blogStatsDetailed = await safeQuery(
      () =>
        db.blogs.findMany({
          select: {
            id: true,
            isPublished: true,
            isFeatured: true,
            isEvent: true,
            createdAt: true,
            publishedAt: true,
          },
        }),
      []
    );

    // Get message statistics
    const messageStatsDetailed = await safeQuery(
      () =>
        db.messages.findMany({
          select: {
            id: true,
            messageConfig: true,
            createdAt: true,
          },
        }),
      []
    );

    // Calculate blog statistics
    const publishedBlogs = blogStatsDetailed.filter(
      (blog: any) => blog.isPublished
    ).length;
    const featuredBlogs = blogStatsDetailed.filter(
      (blog: any) => blog.isFeatured
    ).length;
    const eventBlogs = blogStatsDetailed.filter(
      (blog: any) => blog.isEvent
    ).length;
    const draftBlogs = blogStatsDetailed.filter(
      (blog: any) => !blog.isPublished
    ).length;

    // Calculate message statistics
    const totalMessages = messageStatsDetailed.length;
    const recentMessages = messageStatsDetailed.filter(
      (msg: any) => new Date(msg.createdAt) >= startDate
    ).length;

    // Get system health data
    const systemHealth = {
      apiStatus: 'online',
      databaseStatus: 'connected',
      emailServiceStatus: 'active',
      fileStorageStatus: 'available',
      lastHealthCheck: new Date().toISOString(),
    };

    // Role-based data filtering
    let roleBasedData = {};

    switch (userRole) {
      case UserType.OWNER:
        roleBasedData = {
          // Full access to all data
          canManageUsers: true,
          canManageColleges: true,
          canManagePrograms: true,
          canManageBlogs: true,
          canManageMessages: true,
          canViewAnalytics: true,
          canViewAuditLogs: true,
          canManageSystem: true,
          permissions: ['ALL'],
        };
        break;

      case UserType.SUPERADMIN:
        roleBasedData = {
          canManageUsers: false,
          canManageColleges: true,
          canManagePrograms: true,
          canManageBlogs: false,
          canManageMessages: true,
          canViewAnalytics: false,
          canViewAuditLogs: false,
          canManageSystem: false,
          permissions: [
            'COLLEGE_MANAGEMENT',
            'PROGRAM_MANAGEMENT',
            'MESSAGE_MANAGEMENT',
          ],
        };
        break;

      case UserType.ADMIN:
        roleBasedData = {
          canManageUsers: false,
          canManageColleges: true,
          canManagePrograms: true,
          canManageBlogs: false,
          canManageMessages: true,
          canViewAnalytics: false,
          canViewAuditLogs: false,
          canManageSystem: false,
          permissions: [
            'COLLEGE_MANAGEMENT',
            'PROGRAM_MANAGEMENT',
            'MESSAGE_MANAGEMENT',
          ],
        };
        break;

      case UserType.GUEST:
      default:
        roleBasedData = {
          canManageUsers: false,
          canManageColleges: false,
          canManagePrograms: false,
          canManageBlogs: false,
          canManageMessages: false,
          canViewAnalytics: false,
          canViewAuditLogs: false,
          canManageSystem: false,
          permissions: ['VIEW_ONLY'],
        };
        break;
    }

    // Prepare dashboard data
    const dashboardData = {
      // Basic statistics
      statistics: {
        totalUsers: userStats,
        totalUniversities: universityStats,
        totalColleges: collegeStats,
        totalPrograms: programStats,
        totalBlogs: blogStats,
        totalMessages: totalMessages,
        totalAuditLogs: auditStats,
        totalPermissions: permissionStats,
        totalStatistics: statisticStats,
      },

      // Detailed statistics
      detailedStats: {
        blogs: {
          total: blogStats,
          published: publishedBlogs,
          draft: draftBlogs,
          featured: featuredBlogs,
          events: eventBlogs,
        },
        messages: {
          total: totalMessages,
          recent: recentMessages,
        },
        users: {
          total: userStats,
          byRole: userRoleDistribution.reduce(
            (acc: any, item: any) => {
              acc[item.role] = item._count.id;
              return acc;
            },
            {} as Record<string, number>
          ),
        },
        colleges: {
          total: collegeStats,
          byType: collegeTypeDistribution.reduce(
            (acc: any, item: any) => {
              acc[item.type] = item._count.id;
              return acc;
            },
            {} as Record<string, number>
          ),
        },
      },

      // Recent activity
      recentActivity: recentActivity.map((activity: any) => ({
        id: activity.id,
        action: activity.action,
        entity: activity.entity,
        entityId: activity.entityId,
        userId: activity.userId,
        clerkId: activity.clerkId,
        isGuest: activity.isGuest,
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent,
        createdAt: activity.createdAt,
        clerkUser: activity.clerkUser,
      })),

      // System health
      systemHealth,

      // Role-based permissions and data
      roleBasedData,

      // Quick actions based on role
      quickActions: getQuickActionsForRole(userRole),

      // Metadata
      metadata: {
        generatedAt: new Date().toISOString(),
        timeRange: parseInt(timeRange),
        userRole,
        version: '1.0.0',
      },
    };

    console.log('✅ Dashboard data generated successfully');

    return NextResponse.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard data fetched successfully',
    });
  } catch (error) {
    console.error('❌ Dashboard API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper function to get quick actions based on role
function getQuickActionsForRole(role: string) {
  const allActions = [
    {
      id: 'university-config',
      title: 'University Config',
      description: 'Configure university settings and information',
      href: '/admin/dashboard/uni',
      icon: 'Building2',
      color: 'bg-blue-500',
      roles: [UserType.OWNER],
    },
    {
      id: 'college-studio',
      title: 'Collage Studio',
      description: 'Manage colleges and their content',
      href: '/admin/dashboard/collages',
      icon: 'School',
      color: 'bg-green-500',
      roles: [UserType.OWNER, UserType.SUPERADMIN, UserType.ADMIN],
    },
    {
      id: 'programs',
      title: 'Programs',
      description: 'Manage academic programs',
      href: '/admin/dashboard/programs',
      icon: 'GraduationCap',
      color: 'bg-purple-500',
      roles: [UserType.OWNER, UserType.SUPERADMIN, UserType.ADMIN],
    },
    {
      id: 'blogs',
      title: 'Blogs',
      description: 'Manage blog posts and articles',
      href: '/admin/system/blogs',
      icon: 'BookOpen',
      color: 'bg-orange-500',
      roles: [UserType.OWNER],
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Manage messages and notifications',
      href: '/admin/system/messages',
      icon: 'MessageSquare',
      color: 'bg-red-500',
      roles: [UserType.OWNER, UserType.SUPERADMIN, UserType.ADMIN],
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage admin users and permissions',
      href: '/admin/system/users',
      icon: 'Users2',
      color: 'bg-indigo-500',
      roles: [UserType.OWNER],
    },
    {
      id: 'system-analysis',
      title: 'System Analysis',
      description: 'View system analytics and insights',
      href: '/admin/system/analysis',
      icon: 'BarChart3',
      color: 'bg-teal-500',
      roles: [UserType.OWNER],
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      description: 'View system activity logs',
      href: '/admin/system/logs',
      icon: 'ClipboardList',
      color: 'bg-gray-500',
      roles: [UserType.OWNER],
    },
  ];

  return allActions.filter(action => action.roles.includes(role as UserType));
}

// Apply tracking to all methods using search preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.search('admin')
);
