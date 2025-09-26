export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  description: string;
}

export interface EmailTemplateData {
  [key: string]: string | number | Date;
}

export class EmailTemplateService {
  private static templates: Map<string, EmailTemplate> = new Map();

  // Initialize default templates
  static initializeTemplates(): void {
    // Contact Form Reply Template
    this.templates.set('contact-form-reply', {
      id: 'contact-form-reply',
      name: 'Contact Form Reply',
      subject: 'Re: {{originalSubject}} - HNU Official Website',
      htmlBody: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reply from HNU Official Website</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
              font-size: 14px;
            }
            .content {
              padding: 30px;
            }
            .message-box {
              background-color: #f8f9fa;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 0 4px 4px 0;
            }
            .message-box h3 {
              margin: 0 0 15px 0;
              color: #333;
              font-size: 18px;
            }
            .message-content {
              white-space: pre-wrap;
              line-height: 1.6;
              color: #555;
            }
            .original-message {
              background-color: #f1f3f4;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
              font-size: 12px;
              color: #666;
            }
            .original-message h4 {
              margin: 0 0 10px 0;
              color: #333;
              font-size: 14px;
            }
            .original-message p {
              margin: 5px 0;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #666;
            }
            .footer p {
              margin: 5px 0;
            }
            .logo {
              width: 60px;
              height: 60px;
              background-color: rgba(255, 255, 255, 0.2);
              border-radius: 50%;
              margin: 0 auto 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              font-weight: bold;
            }
            @media (max-width: 600px) {
              body {
                padding: 10px;
              }
              .header, .content, .footer {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">HNU</div>
              <h1>Reply from HNU Official Website</h1>
              <p>Thank you for contacting us. Here is our response to your inquiry.</p>
            </div>
            
            <div class="content">
              <div class="message-box">
                <h3>Our Response:</h3>
                <div class="message-content">{{replyMessage}}</div>
              </div>
              
              <div class="original-message">
                <h4>Your Original Message:</h4>
                <p><strong>Subject:</strong> {{originalSubject}}</p>
                <p><strong>From:</strong> {{originalFrom}}</p>
                <p><strong>Date:</strong> {{originalDate}}</p>
                <p><strong>Message:</strong></p>
                <div style="white-space: pre-wrap; margin-top: 5px;">{{originalMessage}}</div>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>HNU Official Website</strong></p>
              <p>This is an automated response. Please do not reply to this email.</p>
              <p>For further assistance, please visit our website or contact us directly.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textBody: `
Reply from HNU Official Website

Our Response:
{{replyMessage}}

---
Your Original Message:
Subject: {{originalSubject}}
From: {{originalFrom}}
Date: {{originalDate}}
Message: {{originalMessage}}

---
HNU Official Website
This is an automated response. Please do not reply to this email.
For further assistance, please visit our website or contact us directly.
      `,
      variables: [
        'replyMessage',
        'originalSubject',
        'originalFrom',
        'originalDate',
        'originalMessage',
      ],
      description: 'Template for replying to contact form submissions',
    });

    // Contact Form Confirmation Template
    this.templates.set('contact-form-confirmation', {
      id: 'contact-form-confirmation',
      name: 'Contact Form Confirmation',
      subject: 'Thank you for contacting HNU - {{subject}}',
      htmlBody: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for contacting HNU</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .checkmark {
              width: 60px;
              height: 60px;
              background-color: rgba(255, 255, 255, 0.2);
              border-radius: 50%;
              margin: 0 auto 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 30px;
            }
            .content {
              padding: 30px;
            }
            .message-summary {
              background-color: #f8f9fa;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              padding: 20px;
              margin: 20px 0;
            }
            .message-summary h3 {
              margin: 0 0 15px 0;
              color: #333;
            }
            .message-summary p {
              margin: 5px 0;
              color: #666;
            }
            .next-steps {
              background-color: #e7f3ff;
              border-left: 4px solid #007bff;
              padding: 20px;
              margin: 20px 0;
              border-radius: 0 4px 4px 0;
            }
            .next-steps h3 {
              margin: 0 0 15px 0;
              color: #007bff;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="checkmark">✓</div>
              <h1>Message Received!</h1>
              <p>Thank you for contacting HNU Official Website</p>
            </div>
            
            <div class="content">
              <p>Dear {{name}},</p>
              
              <p>We have successfully received your message and will get back to you as soon as possible.</p>
              
              <div class="message-summary">
                <h3>Message Summary:</h3>
                <p><strong>Subject:</strong> {{subject}}</p>
                <p><strong>Email:</strong> {{email}}</p>
                <p><strong>Date:</strong> {{date}}</p>
                <p><strong>Message:</strong></p>
                <div style="white-space: pre-wrap; margin-top: 10px; padding: 10px; background-color: #fff; border-radius: 4px;">{{message}}</div>
              </div>
              
              <div class="next-steps">
                <h3>What happens next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Our team will review your message</li>
                  <li>We'll respond within 24-48 hours</li>
                  <li>You'll receive a reply at {{email}}</li>
                </ul>
              </div>
              
              <p>If you have any urgent inquiries, please don't hesitate to contact us directly.</p>
              
              <p>Best regards,<br>HNU Official Website Team</p>
            </div>
            
            <div class="footer">
              <p><strong>HNU Official Website</strong></p>
              <p>This is an automated confirmation. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textBody: `
Thank you for contacting HNU Official Website!

Dear {{name}},

We have successfully received your message and will get back to you as soon as possible.

Message Summary:
Subject: {{subject}}
Email: {{email}}
Date: {{date}}
Message: {{message}}

What happens next?
- Our team will review your message
- We'll respond within 24-48 hours
- You'll receive a reply at {{email}}

If you have any urgent inquiries, please don't hesitate to contact us directly.

Best regards,
HNU Official Website Team

---
This is an automated confirmation. Please do not reply to this email.
      `,
      variables: ['name', 'email', 'subject', 'message', 'date'],
      description:
        'Confirmation email sent to users after submitting contact form',
    });

    // System Notification Template
    this.templates.set('system-notification', {
      id: 'system-notification',
      name: 'System Notification',
      subject: '{{subject}} - HNU System',
      htmlBody: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{{subject}}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
            }
            .notification-box {
              background-color: #f8f9fa;
              border-left: 4px solid #6c757d;
              padding: 20px;
              margin: 20px 0;
              border-radius: 0 4px 4px 0;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>{{subject}}</h1>
            </div>
            
            <div class="content">
              <div class="notification-box">
                {{message}}
              </div>
              
              <p>This is an automated system notification from HNU Official Website.</p>
            </div>
            
            <div class="footer">
              <p><strong>HNU Official Website</strong></p>
              <p>System Notification - {{date}}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textBody: `
{{subject}}

{{message}}

This is an automated system notification from HNU Official Website.

---
HNU Official Website
System Notification - {{date}}
      `,
      variables: ['subject', 'message', 'date'],
      description: 'Template for system notifications',
    });
  }

  // Get template by ID
  static getTemplate(templateId: string): EmailTemplate | undefined {
    return this.templates.get(templateId);
  }

  // Get all templates
  static getAllTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values());
  }

  // Process template with data
  static processTemplate(
    templateId: string,
    data: EmailTemplateData
  ): { subject: string; htmlBody: string; textBody: string } | null {
    const template = this.getTemplate(templateId);
    if (!template) {
      return null;
    }

    let subject = template.subject;
    let htmlBody = template.htmlBody;
    let textBody = template.textBody;

    // Replace variables in all parts
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const stringValue = typeof value === 'string' ? value : String(value);

      subject = subject.replace(new RegExp(placeholder, 'g'), stringValue);
      htmlBody = htmlBody.replace(new RegExp(placeholder, 'g'), stringValue);
      textBody = textBody.replace(new RegExp(placeholder, 'g'), stringValue);
    });

    return { subject, htmlBody, textBody };
  }

  // Add custom template
  static addTemplate(template: EmailTemplate): void {
    this.templates.set(template.id, template);
  }

  // Remove template
  static removeTemplate(templateId: string): boolean {
    return this.templates.delete(templateId);
  }

  // Validate template data
  static validateTemplateData(
    templateId: string,
    data: EmailTemplateData
  ): { valid: boolean; missingVariables: string[] } {
    const template = this.getTemplate(templateId);
    if (!template) {
      return { valid: false, missingVariables: [] };
    }

    const missingVariables: string[] = [];

    template.variables.forEach(variable => {
      if (
        !(variable in data) ||
        data[variable] === undefined ||
        data[variable] === ''
      ) {
        missingVariables.push(variable);
      }
    });

    return {
      valid: missingVariables.length === 0,
      missingVariables,
    };
  }

  // Get template variables
  static getTemplateVariables(templateId: string): string[] {
    const template = this.getTemplate(templateId);
    return template ? template.variables : [];
  }
}

// Initialize templates when module is imported
EmailTemplateService.initializeTemplates();
