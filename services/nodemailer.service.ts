import nodemailer from 'nodemailer';
import {
  MessageConfig,
  NodeMailerConfig,
  EmailSendResult,
} from '@/types/message';

export class NodeMailerService {
  private static transporter: nodemailer.Transporter | null = null;
  private static config: NodeMailerConfig | null = null;

  // Initialize the transporter with configuration
  static initialize(config: NodeMailerConfig): void {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure, // true for 465, false for other ports
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
      tls: config.tls || {
        rejectUnauthorized: false,
      },
    });

    // Verify connection configuration
    this.transporter?.verify((error, success) => {
      if (error) {
        console.error('NodeMailer configuration error:', error);
      } else {
        console.log('NodeMailer server is ready to take our messages');
      }
    });
  }

  // Get transporter instance
  static getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      throw new Error('NodeMailer not initialized. Call initialize() first.');
    }
    return this.transporter;
  }

  // Send email from message config
  static async sendEmail(
    messageConfig: MessageConfig
  ): Promise<EmailSendResult> {
    try {
      const transporter = this.getTransporter();

      // Prepare email options
      const mailOptions: nodemailer.SendMailOptions = {
        from: messageConfig.from || this.config?.auth.user,
        to: Array.isArray(messageConfig.to)
          ? messageConfig.to.join(', ')
          : messageConfig.to,
        cc: messageConfig.cc?.join(', '),
        bcc: messageConfig.bcc?.join(', '),
        subject: messageConfig.subject,
        text: messageConfig.body,
        html: messageConfig.htmlBody || messageConfig.body,
      };

      // Add attachments if any
      if (messageConfig.attachments && messageConfig.attachments.length > 0) {
        mailOptions.attachments = messageConfig.attachments.map(attachment => ({
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType,
          encoding: 'base64',
        }));
      }

      // Send email
      const result = await transporter.sendMail(mailOptions);

      return {
        messageId: result.messageId,
        accepted: result.accepted || [],
        rejected: result.rejected || [],
        pending: [],
        response: result.response || 'Email sent successfully',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(
        `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Send bulk emails
  static async sendBulkEmails(
    messageConfigs: MessageConfig[]
  ): Promise<EmailSendResult[]> {
    const results: EmailSendResult[] = [];

    for (const config of messageConfigs) {
      try {
        const result = await this.sendEmail(config);
        results.push(result);
      } catch (error) {
        results.push({
          messageId: '',
          accepted: [],
          rejected: Array.isArray(config.to) ? config.to : [config.to],
          pending: [],
          response: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  // Send email with template
  static async sendTemplateEmail(
    template: string,
    templateData: Record<string, any>,
    messageConfig: Partial<MessageConfig>
  ): Promise<EmailSendResult> {
    try {
      // Simple template replacement (you can use more sophisticated templating libraries)
      let processedSubject = messageConfig.subject || '';
      let processedBody = messageConfig.body || '';
      let processedHtmlBody = messageConfig.htmlBody || '';

      // Replace template variables
      Object.entries(templateData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        processedSubject = processedSubject.replace(
          new RegExp(placeholder, 'g'),
          String(value)
        );
        processedBody = processedBody.replace(
          new RegExp(placeholder, 'g'),
          String(value)
        );
        processedHtmlBody = processedHtmlBody.replace(
          new RegExp(placeholder, 'g'),
          String(value)
        );
      });

      const fullMessageConfig: MessageConfig = {
        ...messageConfig,
        subject: processedSubject,
        body: processedBody,
        htmlBody: processedHtmlBody,
      } as MessageConfig;

      return await this.sendEmail(fullMessageConfig);
    } catch (error) {
      console.error('Error sending template email:', error);
      throw new Error(
        `Failed to send template email: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Test email configuration
  static async testConnection(): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      await transporter.verify();
      return true;
    } catch (error) {
      console.error('NodeMailer connection test failed:', error);
      return false;
    }
  }

  // Send test email
  static async sendTestEmail(to: string): Promise<EmailSendResult> {
    const testConfig: MessageConfig = {
      to,
      subject: 'Test Email from HNU Official Website',
      body: 'This is a test email to verify NodeMailer configuration.',
      htmlBody:
        '<p>This is a test email to verify NodeMailer configuration.</p>',
      type: 'EMAIL' as any,
      status: 'PENDING' as any,
      priority: 'NORMAL' as any,
      retryCount: 0,
      maxRetries: 3,
    };

    return await this.sendEmail(testConfig);
  }

  // Get configuration status
  static getConfigStatus(): {
    initialized: boolean;
    config: NodeMailerConfig | null;
  } {
    return {
      initialized: this.transporter !== null,
      config: this.config,
    };
  }

  // Close transporter connection
  static async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      this.transporter = null;
      this.config = null;
    }
  }
}
