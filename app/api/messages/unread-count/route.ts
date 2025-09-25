import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { MessageStatus, MessageType, MessagePriority } from '@/types/message';

export async function GET(request: NextRequest) {
  try {
    // Get unread messages count (messages with status PENDING or SENT)
    const unreadCount = await db.messages.count({
      where: {
        OR: [
          {
            messageConfig: {
              path: ['status'],
              equals: MessageStatus.PENDING,
            },
          },
          {
            messageConfig: {
              path: ['status'],
              equals: MessageStatus.SENT,
            },
          },
        ],
      },
    });

    // Get unread counts by type
    const unreadByType = await Promise.all([
      db.messages.count({
        where: {
          AND: [
            {
              messageConfig: {
                path: ['type'],
                equals: MessageType.EMAIL,
              },
            },
            {
              OR: [
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.PENDING,
                  },
                },
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.SENT,
                  },
                },
              ],
            },
          ],
        },
      }),
      db.messages.count({
        where: {
          AND: [
            {
              messageConfig: {
                path: ['type'],
                equals: MessageType.SMS,
              },
            },
            {
              OR: [
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.PENDING,
                  },
                },
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.SENT,
                  },
                },
              ],
            },
          ],
        },
      }),
      db.messages.count({
        where: {
          AND: [
            {
              messageConfig: {
                path: ['type'],
                equals: MessageType.PUSH_NOTIFICATION,
              },
            },
            {
              OR: [
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.PENDING,
                  },
                },
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.SENT,
                  },
                },
              ],
            },
          ],
        },
      }),
      db.messages.count({
        where: {
          AND: [
            {
              messageConfig: {
                path: ['type'],
                equals: MessageType.SYSTEM_NOTIFICATION,
              },
            },
            {
              OR: [
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.PENDING,
                  },
                },
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.SENT,
                  },
                },
              ],
            },
          ],
        },
      }),
    ]);

    // Get unread counts by priority
    const unreadByPriority = await Promise.all([
      db.messages.count({
        where: {
          AND: [
            {
              messageConfig: {
                path: ['priority'],
                equals: MessagePriority.LOW,
              },
            },
            {
              OR: [
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.PENDING,
                  },
                },
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.SENT,
                  },
                },
              ],
            },
          ],
        },
      }),
      db.messages.count({
        where: {
          AND: [
            {
              messageConfig: {
                path: ['priority'],
                equals: MessagePriority.NORMAL,
              },
            },
            {
              OR: [
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.PENDING,
                  },
                },
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.SENT,
                  },
                },
              ],
            },
          ],
        },
      }),
      db.messages.count({
        where: {
          AND: [
            {
              messageConfig: {
                path: ['priority'],
                equals: MessagePriority.HIGH,
              },
            },
            {
              OR: [
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.PENDING,
                  },
                },
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.SENT,
                  },
                },
              ],
            },
          ],
        },
      }),
      db.messages.count({
        where: {
          AND: [
            {
              messageConfig: {
                path: ['priority'],
                equals: MessagePriority.URGENT,
              },
            },
            {
              OR: [
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.PENDING,
                  },
                },
                {
                  messageConfig: {
                    path: ['status'],
                    equals: MessageStatus.SENT,
                  },
                },
              ],
            },
          ],
        },
      }),
    ]);

    const unreadCounts = {
      total: unreadCount,
      byType: {
        [MessageType.EMAIL]: unreadByType[0],
        [MessageType.SMS]: unreadByType[1],
        [MessageType.PUSH_NOTIFICATION]: unreadByType[2],
        [MessageType.SYSTEM_NOTIFICATION]: unreadByType[3],
      },
      byPriority: {
        [MessagePriority.LOW]: unreadByPriority[0],
        [MessagePriority.NORMAL]: unreadByPriority[1],
        [MessagePriority.HIGH]: unreadByPriority[2],
        [MessagePriority.URGENT]: unreadByPriority[3],
      },
    };

    return NextResponse.json({
      success: true,
      data: unreadCounts,
    });
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch unread messages count',
      },
      { status: 500 }
    );
  }
}
