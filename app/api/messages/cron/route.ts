import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';
import { NodeMailerService } from '@/services/nodemailer.service';
import { MessageStatus } from '@/types/message';

async function handlePOST(req: NextRequest) {
  try {
    // Verify this is a cron job request (you might want to add authentication)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const now = new Date();
    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Initialize NodeMailer if not already done
    if (!NodeMailerService.getConfigStatus().initialized) {
      const nodemailerConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
        tls: {
          rejectUnauthorized: false,
        },
      };

      NodeMailerService.initialize(nodemailerConfig);
    }

    // Get scheduled messages that are ready to be sent
    const scheduledMessages = await db.messages.findMany({
      where: {
        messageConfig: {
          path: ['status'],
          equals: MessageStatus.SCHEDULED,
        },
      },
    });

    // Process each scheduled message
    for (const message of scheduledMessages) {
      if (!message.messageConfig) continue;

      const messageConfig = message.messageConfig as any;
      const scheduledAt = new Date(messageConfig.scheduledAt);

      // Check if it's time to send this message
      if (scheduledAt <= now) {
        results.processed++;

        try {
          // Send the email
          const emailResult = await NodeMailerService.sendEmail(messageConfig);

          // Update message status
          await db.messages.update({
            where: { id: message.id },
            data: {
              messageConfig: {
                ...messageConfig,
                status:
                  emailResult.accepted.length > 0
                    ? MessageStatus.SENT
                    : MessageStatus.FAILED,
                scheduledAt: undefined, // Remove scheduled time
              },
            },
          });

          if (emailResult.accepted.length > 0) {
            results.sent++;
          } else {
            results.failed++;
            results.errors.push(
              `Message ${message.id}: ${emailResult.response}`
            );
          }
        } catch (error) {
          results.failed++;
          results.errors.push(
            `Message ${message.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );

          // Update message status to failed
          await db.messages.update({
            where: { id: message.id },
            data: {
              messageConfig: {
                ...messageConfig,
                status: MessageStatus.FAILED,
                scheduledAt: undefined,
                retryCount: (messageConfig.retryCount || 0) + 1,
              },
            },
          });
        }
      }
    }

    // Process pending messages (retry failed messages)
    const pendingMessages = await db.messages.findMany({
      where: {
        messageConfig: {
          path: ['status'],
          equals: MessageStatus.PENDING,
        },
      },
    });

    for (const message of pendingMessages) {
      if (!message.messageConfig) continue;

      const messageConfig = message.messageConfig as any;
      const retryCount = messageConfig.retryCount || 0;
      const maxRetries = messageConfig.maxRetries || 3;

      // Only retry if we haven't exceeded max retries
      if (retryCount < maxRetries) {
        results.processed++;

        try {
          // Send the email
          const emailResult = await NodeMailerService.sendEmail(messageConfig);

          // Update message status
          await db.messages.update({
            where: { id: message.id },
            data: {
              messageConfig: {
                ...messageConfig,
                status:
                  emailResult.accepted.length > 0
                    ? MessageStatus.SENT
                    : MessageStatus.FAILED,
                retryCount: retryCount + 1,
              },
            },
          });

          if (emailResult.accepted.length > 0) {
            results.sent++;
          } else {
            results.failed++;
            results.errors.push(
              `Message ${message.id}: ${emailResult.response}`
            );
          }
        } catch (error) {
          results.failed++;
          results.errors.push(
            `Message ${message.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );

          // Update message status
          await db.messages.update({
            where: { id: message.id },
            data: {
              messageConfig: {
                ...messageConfig,
                status: MessageStatus.FAILED,
                retryCount: retryCount + 1,
              },
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Cron job completed. Processed: ${results.processed}, Sent: ${results.sent}, Failed: ${results.failed}`,
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Cron job failed',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check cron job status
async function handleGET(req: NextRequest) {
  try {
    const now = new Date();

    // Count scheduled messages
    const scheduledCount = await db.messages.count({
      where: {
        messageConfig: {
          path: ['status'],
          equals: MessageStatus.SCHEDULED,
        },
      },
    });

    // Count pending messages
    const pendingCount = await db.messages.count({
      where: {
        messageConfig: {
          path: ['status'],
          equals: MessageStatus.PENDING,
        },
      },
    });

    // Count failed messages
    const failedCount = await db.messages.count({
      where: {
        messageConfig: {
          path: ['status'],
          equals: MessageStatus.FAILED,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        scheduled: scheduledCount,
        pending: pendingCount,
        failed: failedCount,
        timestamp: now.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error checking cron job status:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to check cron job status',
      },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using crud preset
export const { POST, GET } = withApiTrackingMethods(
  { POST: handlePOST, GET: handleGET },
  ApiTrackingPresets.crud('Message')
);
