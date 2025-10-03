import { UniversityConfig } from '@/types/university';
import { format } from 'date-fns';

export interface MessageReplyData {
  subject: string;
  body: string;
  originalMessage: {
    subject: string;
    from: string;
    date: Date;
    body: string;
  };
  universityConfig?: UniversityConfig;
  baseUrl?: string;
}

/**
 * Generates a comprehensive HTML email template for message replies
 * Includes university branding, logo, and professional styling
 */
export function generateMessageReplyHTML(data: MessageReplyData): string {
  const {
    subject,
    body,
    originalMessage,
    universityConfig,
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hnu.edu.eg',
  } = data;

  // Safely format the date
  const formatDate = (date: Date): string => {
    try {
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.warn('Invalid date provided, using fallback:', error);
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const logoUrl = universityConfig?.logo
    ? universityConfig.logo.startsWith('http')
      ? universityConfig.logo
      : `${baseUrl}${universityConfig.logo}`
    : `${baseUrl}/logo-hnu-web2.png`;

  const universityName =
    universityConfig?.socialMedia?.name || 'HNU Official Website';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reply from ${universityName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .logo {
            max-width: 120px;
            height: auto;
            margin-bottom: 15px;
            border-radius: 8px;
        }
        
        .university-name {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .header-subtitle {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px 20px;
        }
        
        .reply-section {
            background-color: #f8f9fa;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .reply-title {
            color: #1e3a8a;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .reply-title::before {
            content: "📧";
            margin-right: 8px;
        }
        
        .reply-message {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            white-space: pre-wrap;
            line-height: 1.7;
            font-size: 15px;
        }
        
        .original-message {
            background-color: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }
        
        .original-title {
            color: #475569;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .original-title::before {
            content: "📋";
            margin-right: 8px;
        }
        
        .original-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        
        .detail-label {
            font-weight: 600;
            color: #64748b;
            margin-bottom: 4px;
        }
        
        .detail-value {
            color: #334155;
        }
        
        .original-body {
            background-color: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
        }
        
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        
        .social-links {
            margin-top: 15px;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 8px;
            color: #3b82f6;
            text-decoration: none;
            font-size: 12px;
        }
        
        .social-link:hover {
            text-decoration: underline;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e5e7eb, transparent);
            margin: 20px 0;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                box-shadow: none;
            }
            
            .content {
                padding: 20px 15px;
            }
            
            .original-details {
                grid-template-columns: 1fr;
            }
            
            .header {
                padding: 20px 15px;
            }
            
            .university-name {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header with Logo -->
        <div class="header">
            <img src="${logoUrl}" alt="${universityName} Logo" class="logo">
            <div class="university-name">${universityName}</div>
            <div class="header-subtitle">Official Communication</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <!-- Reply Section -->
            <div class="reply-section">
                <div class="reply-title">Reply to Your Message</div>
                <div class="reply-message">${body}</div>
            </div>
            
            <div class="divider"></div>
            
            <!-- Original Message Reference -->
            <div class="original-message">
                <div class="original-title">Original Message Details</div>
                
                <div class="original-details">
                    <div class="detail-item">
                        <div class="detail-label">Subject:</div>
                        <div class="detail-value">${originalMessage.subject || 'No Subject'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">From:</div>
                        <div class="detail-value">${originalMessage.from || 'Unknown'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date:</div>
                        <div class="detail-value">${formatDate(originalMessage.date)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">Replied</div>
                    </div>
                </div>
                
                <div class="original-body">${originalMessage.body || 'No content available'}</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">
                This message was sent from the ${universityName} contact system.
                <br>
                Please do not reply directly to this email.
            </div>
            
            ${
              universityConfig?.socialMedia
                ? `
            <div class="social-links">
                ${Object.entries(universityConfig.socialMedia)
                  .filter(([key]) => key !== 'name')
                  .map(
                    ([platform, url]) =>
                      `<a href="${url}" class="social-link" target="_blank">${platform.charAt(0).toUpperCase() + platform.slice(1)}</a>`
                  )
                  .join('')}
            </div>
            `
                : ''
            }
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generates a plain text version of the message reply
 * Useful as a fallback for email clients that don't support HTML
 */
export function generateMessageReplyText(data: MessageReplyData): string {
  const { subject, body, originalMessage, universityConfig } = data;
  const universityName =
    universityConfig?.socialMedia?.name || 'HNU Official Website';

  // Safely format the date
  const formatDate = (date: Date): string => {
    try {
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.warn('Invalid date provided, using fallback:', error);
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  return `
${universityName} - Official Communication

REPLY TO YOUR MESSAGE
====================

${body}

ORIGINAL MESSAGE DETAILS
========================

Subject: ${originalMessage.subject || 'No Subject'}
From: ${originalMessage.from || 'Unknown'}
Date: ${formatDate(originalMessage.date)}
Status: Replied

Original Message:
${originalMessage.body || 'No content available'}

---
This message was sent from the ${universityName} contact system.
Please do not reply directly to this email.
`;
}

/**
 * Email Template Service for processing different email templates
 * Provides a unified interface for template processing
 */
export class EmailTemplateService {
  /**
   * Process a template with the given data
   * @param templateType - The type of template to process
   * @param data - The data to use for template processing
   * @returns Processed template with HTML and text versions
   */
  static processTemplate(
    templateType: string,
    data: any
  ): { htmlBody: string; textBody: string } | null {
    try {
      switch (templateType) {
        case 'contact-form-reply':
          // Convert the old template data format to our new format
          const messageReplyData: MessageReplyData = {
            subject: data.replyMessage || '',
            body: data.replyMessage || '',
            originalMessage: {
              subject: data.originalSubject || 'No Subject',
              from: data.originalFrom || 'Unknown',
              date: data.originalDate
                ? new Date(data.originalDate)
                : new Date(),
              body: data.originalMessage || 'No content available',
            },
            universityConfig: data.universityConfig,
            baseUrl: data.baseUrl,
          };

          return {
            htmlBody: generateMessageReplyHTML(messageReplyData),
            textBody: generateMessageReplyText(messageReplyData),
          };

        default:
          console.warn(`Unknown template type: ${templateType}`);
          return null;
      }
    } catch (error) {
      console.error(`Error processing template ${templateType}:`, error);
      return null;
    }
  }

  /**
   * Get available template types
   * @returns Array of available template types
   */
  static getAvailableTemplates(): string[] {
    return ['contact-form-reply'];
  }
}
