import { NextRequest, NextResponse } from 'next/server';
import { NodeMailerService } from '@/services/nodemailer.service';

export async function GET(request: NextRequest) {
  try {
    // Get email configuration status
    const configStatus = NodeMailerService.getConfigStatus();

    // Get environment variables (mask sensitive data)
    const emailConfig = {
      host: process.env.NODEMAILER_HOST || 'Not configured',
      port: process.env.NODEMAILER_PORT || 'Not configured',
      secure: process.env.NODEMAILER_SECURE || 'Not configured',
      user: process.env.NODEMAILER_USER
        ? `${process.env.NODEMAILER_USER.substring(0, 3)}***@${process.env.NODEMAILER_USER.split('@')[1]}`
        : 'Not configured',
      fromEmail: process.env.NODEMAILER_FROM_EMAIL || 'Not configured',
      initialized: configStatus.initialized,
      hasPassword: !!process.env.NODEMAILER_PASS,
    };

    return NextResponse.json({
      success: true,
      data: emailConfig,
    });
  } catch (error) {
    console.error('Error fetching email configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch email configuration',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'test-connection') {
      // Test email connection
      const isConnected = await NodeMailerService.testConnection();

      return NextResponse.json({
        success: true,
        data: {
          connected: isConnected,
          message: isConnected
            ? 'Email connection successful'
            : 'Email connection failed',
        },
      });
    }

    if (action === 'send-test-email') {
      const { testEmail } = body;

      if (!testEmail) {
        return NextResponse.json(
          {
            success: false,
            error: 'Test email address is required',
          },
          { status: 400 }
        );
      }

      try {
        const result = await NodeMailerService.sendTestEmail(testEmail);

        return NextResponse.json({
          success: true,
          data: {
            messageId: result.messageId,
            accepted: result.accepted,
            rejected: result.rejected,
            message: 'Test email sent successfully',
          },
        });
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to send test email',
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing email configuration request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
      },
      { status: 500 }
    );
  }
}
