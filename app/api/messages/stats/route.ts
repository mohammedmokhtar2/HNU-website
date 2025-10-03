import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';
import { MessageStatus, MessageType, MessagePriority } from '@/types/message';

async function handleGET(req: NextRequest) {
  try {
    // Get total count
    const total = await db.messages.count();

    // Get counts by status
    const statusCounts = await Promise.all([
      db.messages.count({
        where: {
          messageConfig: {
            path: ['status'],
            equals: MessageStatus.PENDING,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['status'],
            equals: MessageStatus.SENT,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['status'],
            equals: MessageStatus.DELIVERED,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['status'],
            equals: MessageStatus.READ,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['status'],
            equals: MessageStatus.FAILED,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['status'],
            equals: MessageStatus.SCHEDULED,
          },
        },
      }),
    ]);

    // Get counts by type
    const typeCounts = await Promise.all([
      db.messages.count({
        where: {
          messageConfig: {
            path: ['type'],
            equals: MessageType.EMAIL,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['type'],
            equals: MessageType.SMS,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['type'],
            equals: MessageType.PUSH_NOTIFICATION,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['type'],
            equals: MessageType.SYSTEM_NOTIFICATION,
          },
        },
      }),
    ]);

    // Get counts by priority
    const priorityCounts = await Promise.all([
      db.messages.count({
        where: {
          messageConfig: {
            path: ['priority'],
            equals: MessagePriority.LOW,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['priority'],
            equals: MessagePriority.NORMAL,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['priority'],
            equals: MessagePriority.HIGH,
          },
        },
      }),
      db.messages.count({
        where: {
          messageConfig: {
            path: ['priority'],
            equals: MessagePriority.URGENT,
          },
        },
      }),
    ]);

    // Get recent activity counts
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentActivity = await Promise.all([
      db.messages.count({
        where: {
          createdAt: {
            gte: last24Hours,
          },
        },
      }),
      db.messages.count({
        where: {
          createdAt: {
            gte: last7Days,
          },
        },
      }),
      db.messages.count({
        where: {
          createdAt: {
            gte: last30Days,
          },
        },
      }),
    ]);

    const stats = {
      total,
      pending: statusCounts[0],
      sent: statusCounts[1],
      delivered: statusCounts[2],
      read: statusCounts[3],
      failed: statusCounts[4],
      scheduled: statusCounts[5],
      byType: {
        [MessageType.EMAIL]: typeCounts[0],
        [MessageType.SMS]: typeCounts[1],
        [MessageType.PUSH_NOTIFICATION]: typeCounts[2],
        [MessageType.SYSTEM_NOTIFICATION]: typeCounts[3],
      },
      byPriority: {
        [MessagePriority.LOW]: priorityCounts[0],
        [MessagePriority.NORMAL]: priorityCounts[1],
        [MessagePriority.HIGH]: priorityCounts[2],
        [MessagePriority.URGENT]: priorityCounts[3],
      },
      recentActivity: {
        last24Hours: recentActivity[0],
        last7Days: recentActivity[1],
        last30Days: recentActivity[2],
      },
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch message stats',
      },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { GET } = withApiTrackingMethods(
  { GET: handleGET },
  ApiTrackingPresets.crud('Message')
);
