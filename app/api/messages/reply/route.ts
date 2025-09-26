import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NodeMailerService } from '@/services/nodemailer.service';
import { EmailTemplateService } from '@/lib/email-templates';
import { getSocketIO } from '@/lib/socket';
import { z } from 'zod';

// Validation schema for reply request
const ReplyRequestSchema = z.object({
  messageId: z.string().min(1, 'Message ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required'),
  htmlBody: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = ReplyRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${validationResult.error.issues.map(e => e.message).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const {
      messageId,
      subject,
      body: replyBody,
      htmlBody,
    } = validationResult.data;

    // Initialize NodeMailer if not already initialized
    if (!NodeMailerService.getConfigStatus().initialized) {
      const user = process.env.NODEMAILER_USER;
      const pass = process.env.NODEMAILER_PASS;

      if (!user || !pass) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Email configuration is missing. Please check NODEMAILER_USER and NODEMAILER_PASS environment variables.',
          },
          { status: 500 }
        );
      }

      const nodemailerConfig = {
        host: process.env.NODEMAILER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.NODEMAILER_PORT || '587'),
        secure: process.env.NODEMAILER_SECURE === 'true',
        auth: {
          user: user,
          pass: pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };

      NodeMailerService.initialize(nodemailerConfig);
    }

    // Get the original message
    const originalMessage = await db.messages.findUnique({
      where: { id: messageId },
    });

    if (!originalMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Original message not found',
        },
        { status: 404 }
      );
    }

    const originalConfig = originalMessage.messageConfig as any;

    // Verify this is a contact form message
    if (originalConfig?.metadata?.source !== 'contact_form') {
      return NextResponse.json(
        {
          success: false,
          error:
            'This message is not from a contact form and cannot be replied to',
        },
        { status: 400 }
      );
    }

    // Extract original message data
    const originalFrom = originalConfig.from;
    const originalSubject = originalConfig.subject;
    const originalMessageBody = originalConfig.body;
    const originalDate = originalMessage.createdAt.toISOString();

    // Prepare template data
    const templateData = {
      replyMessage: replyBody,
      originalSubject: originalSubject || 'No Subject',
      originalFrom: originalFrom || 'Unknown',
      originalDate: new Date(originalDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      originalMessage: originalMessageBody || 'No message content',
    };

    // Process the reply template
    const processedTemplate = EmailTemplateService.processTemplate(
      'contact-form-reply',
      templateData
    );

    if (!processedTemplate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process email template',
        },
        { status: 500 }
      );
    }

    // Create reply message config
    const replyMessageConfig = {
      from: process.env.NODEMAILER_FROM_EMAIL || process.env.NODEMAILER_USER,
      to: originalFrom,
      subject: subject,
      body: replyBody,
      htmlBody: htmlBody || processedTemplate.htmlBody,
      status: 'PENDING',
      type: 'EMAIL',
      priority: 'NORMAL',
      retryCount: 0,
      maxRetries: 3,
      metadata: {
        source: 'admin_reply',
        originalMessageId: messageId,
        adminReply: true,
        timestamp: new Date().toISOString(),
      },
    };

    // Send the email using NodeMailer
    try {
      const emailResult = await NodeMailerService.sendEmail(
        replyMessageConfig as any
      );

      // Create a new message record for the reply
      const replyMessage = await db.messages.create({
        data: {
          messageConfig: replyMessageConfig as any,
        },
      });

      // Update the original message status to indicate it has been replied to
      await db.messages.update({
        where: { id: messageId },
        data: {
          messageConfig: {
            ...originalConfig,
            status: 'READ',
            repliedAt: new Date().toISOString(),
            replyMessageId: replyMessage.id,
          },
        },
      });

      // Emit socket event for real-time updates
      try {
        const io = getSocketIO();
        if (io) {
          io.to('admin').emit('message-replied', {
            originalMessageId: messageId,
            replyMessageId: replyMessage.id,
            originalFrom: originalFrom,
            replySubject: subject,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (socketError) {
        console.error('Socket emission error:', socketError);
        // Don't fail the request if socket emission fails
      }

      return NextResponse.json({
        success: true,
        data: {
          replyMessageId: replyMessage.id,
          emailResult: {
            messageId: emailResult.messageId,
            accepted: emailResult.accepted,
            rejected: emailResult.rejected,
          },
        },
        message: 'Reply sent successfully',
      });
    } catch (emailError) {
      console.error('Error sending reply email:', emailError);

      // Still create the message record even if email fails
      const replyMessage = await db.messages.create({
        data: {
          messageConfig: {
            ...replyMessageConfig,
            status: 'FAILED',
            error:
              emailError instanceof Error
                ? emailError.message
                : 'Unknown error',
          } as any,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email, but reply was recorded',
          data: {
            replyMessageId: replyMessage.id,
            emailError:
              emailError instanceof Error
                ? emailError.message
                : 'Unknown error',
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing reply:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process reply',
      },
      { status: 500 }
    );
  }
}

// Get reply history for a message
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message ID is required',
        },
        { status: 400 }
      );
    }

    // Get all replies for this message
    const replies = await db.messages.findMany({
      where: {
        messageConfig: {
          path: ['metadata', 'originalMessageId'],
          equals: messageId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: replies,
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch replies',
      },
      { status: 500 }
    );
  }
}
