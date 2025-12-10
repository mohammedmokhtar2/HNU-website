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
    const body = await req.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message ID is required',
        },
        { status: 400 }
      );
    }

    // Get message from database
    const message = await db.messages.findUnique({
      where: { id: messageId },
    });

    if (!message || !message.messageConfig) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message not found or invalid configuration',
        },
        { status: 404 }
      );
    }

    const messageConfig = message.messageConfig as any;

    // Check if message is already sent or read
    if (
      messageConfig.status === MessageStatus.SENT ||
      messageConfig.status === MessageStatus.READ
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message has already been sent',
        },
        { status: 400 }
      );
    }

    // Initialize NodeMailer if not already done
    if (!NodeMailerService.getConfigStatus().initialized) {
      // You should get these from environment variables
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

    // Send email
    const emailResult = await NodeMailerService.sendEmail(messageConfig);

    // Update message status in database
    const updatedMessage = await db.messages.update({
      where: { id: messageId },
      data: {
        messageConfig: {
          ...messageConfig,
          status:
            emailResult.accepted.length > 0
              ? MessageStatus.SENT
              : MessageStatus.FAILED,
          retryCount: (messageConfig.retryCount || 0) + 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: updatedMessage,
        emailResult,
      },
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);

    // Update message status to failed
    try {
      const body = await req.json();
      const { messageId } = body;

      if (messageId) {
        const message = await db.messages.findUnique({
          where: { id: messageId },
        });

        if (message && message.messageConfig) {
          const messageConfig = message.messageConfig as any;
          await db.messages.update({
            where: { id: messageId },
            data: {
              messageConfig: {
                ...messageConfig,
                status: MessageStatus.FAILED,
                retryCount: (messageConfig.retryCount || 0) + 1,
              },
            },
          });
        }
      }
    } catch (updateError) {
      console.error('Error updating message status:', updateError);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      },
      { status: 500 }
    );
  }
}

// Apply tracking to all methods using formSubmission preset
export const { POST } = withApiTrackingMethods(
  { POST: handlePOST },
  ApiTrackingPresets.formSubmission('messages')
);
