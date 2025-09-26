# Contact Form to Admin Reply Flow Documentation

This document describes the complete flow from contact form submission to admin reply functionality in the HNU Official Website.

## Overview

The system implements a complete contact form workflow that allows:
1. Users to submit contact forms on the website
2. Admins to view and manage messages in the admin panel
3. Admins to reply to contact form messages
4. Automatic email delivery of replies to users

## Architecture

### Components

1. **ContactUsSection** - Frontend contact form component
2. **MessageViewModal** - Admin interface for viewing and replying to messages
3. **MessageService** - Service layer for message operations
4. **NodeMailerService** - Email delivery service
5. **EmailTemplateService** - HTML email template management
6. **MessageContext** - React context for state management

### API Endpoints

- `POST /api/messages` - Create new message (contact form submission)
- `GET /api/messages` - Retrieve messages with filtering and pagination
- `POST /api/messages/reply` - Send admin reply to contact form message
- `GET /api/messages/reply` - Get reply history for a message
- `GET /api/messages/stats` - Get message statistics

## Flow Description

### 1. Contact Form Submission

**Location**: `components/sections/ContactUsSection.tsx`

**Process**:
1. User fills out contact form with name, email, subject, and message
2. Form validates input and shows loading state
3. Creates `MessageConfig` object with email details
4. Calls `MessageService.createMessage()` to submit to API
5. API creates message record in database
6. Socket event emitted for real-time admin notification
7. Success/error feedback shown to user

**Key Features**:
- Rate limiting (5 submissions per 15 minutes per IP)
- Real-time validation
- Responsive design
- Multilingual support
- Error handling with retry information

### 2. Admin Message Management

**Location**: `app/[locale]/(admin)/admin/system/messages/page.tsx`

**Process**:
1. Admin views messages list with filtering and search
2. Real-time updates via socket connection
3. Message statistics dashboard
4. Bulk operations (mark as read, delete, etc.)
5. Individual message actions (send, retry, schedule)

**Key Features**:
- Real-time message notifications
- Advanced filtering (status, type, priority, date range)
- Pagination and search
- Socket connection status indicator
- Auto-refresh every 30 seconds

### 3. Message Viewing and Replying

**Location**: `components/admin/MessageViewModal.tsx`

**Process**:
1. Admin clicks on message subject to open modal
2. Modal displays complete message details
3. Auto-marks message as read when opened
4. Admin can compose reply with subject and message
5. Reply uses email template system
6. Sends email via NodeMailer service
7. Creates reply message record
8. Updates original message status

**Key Features**:
- Complete message details display
- Rich text reply composition
- Email template integration
- Auto-status updates
- Error handling and feedback

### 4. Email Delivery

**Location**: `services/nodemailer.service.ts` + `lib/email-templates.ts`

**Process**:
1. Reply data processed through email template system
2. Template variables replaced with actual data
3. HTML and text versions generated
4. Email sent via NodeMailer SMTP
5. Delivery status tracked
6. Error handling for failed deliveries

**Key Features**:
- Professional HTML email templates
- Template variable system
- Fallback to text version
- Delivery confirmation
- Error logging and retry logic

## Database Schema

### Messages Table

```sql
model messages {
  id            String   @id @default(cuid())
  messageConfig Json?    -- Contains all message details
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### MessageConfig Structure

```typescript
interface MessageConfig {
  from: string;
  to: string | string[];
  subject: string;
  body: string;
  htmlBody?: string;
  status: MessageStatus;
  type: MessageType;
  priority: MessagePriority;
  retryCount: number;
  maxRetries: number;
  metadata?: {
    source: string;
    sectionId?: string;
    userAgent?: string;
    timestamp: string;
    originalMessageId?: string; // For replies
    adminReply?: boolean;
  };
}
```

## Email Templates

### Available Templates

1. **contact-form-reply** - Reply to contact form submissions
2. **contact-form-confirmation** - Confirmation email to users
3. **system-notification** - System notifications

### Template Variables

**Contact Form Reply**:
- `replyMessage` - Admin's reply text
- `originalSubject` - Original message subject
- `originalFrom` - Original sender email
- `originalDate` - Original message date
- `originalMessage` - Original message content

**Contact Form Confirmation**:
- `name` - User's name
- `email` - User's email
- `subject` - Message subject
- `message` - Message content
- `date` - Submission date

## Real-time Features

### Socket Events

- `new-message` - New message received
- `new-contact-message` - New contact form submission
- `message-replied` - Admin replied to message

### Live Updates

- Message count updates
- New message notifications
- Connection status indicator
- Auto-refresh functionality

## Error Handling

### Contact Form Errors

- Rate limiting exceeded
- Validation errors
- Network errors
- Server errors

### Admin Panel Errors

- Message loading failures
- Reply sending failures
- Socket connection issues
- Permission errors

### Email Delivery Errors

- SMTP configuration issues
- Invalid email addresses
- Template processing errors
- Network timeouts

## Security Features

### Rate Limiting

- 5 contact form submissions per 15 minutes per IP
- Configurable limits
- Retry-after headers
- Client-side feedback

### Input Validation

- Server-side validation using Zod schemas
- Client-side validation
- XSS protection
- SQL injection prevention

### Authentication

- Admin authentication required for message management
- Role-based permissions
- Session management

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NodeMailer
NODEMAILER_HOST="smtp.gmail.com"
NODEMAILER_PORT=587
NODEMAILER_USER="your-email@gmail.com"
NODEMAILER_PASS="your-app-password"
NODEMAILER_FROM_EMAIL="noreply@hnu.edu"

# Socket
SOCKET_PORT=3001
SOCKET_CORS_ORIGIN="http://localhost:3000"
```

### Rate Limiting Configuration

```typescript
const contactFormRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many contact form submissions',
});
```

## Testing

### Test Script

Run the complete flow test:

```bash
node test-contact-reply-flow.js
```

### Test Coverage

- Contact form submission
- Message retrieval
- Admin reply functionality
- Email delivery
- Reply history tracking
- Message statistics

## Deployment Considerations

### Production Setup

1. Configure SMTP server (Gmail, SendGrid, etc.)
2. Set up proper CORS for socket connections
3. Configure rate limiting appropriately
4. Set up monitoring and logging
5. Configure backup and recovery

### Performance Optimization

- Database indexing on message queries
- Socket connection pooling
- Email template caching
- CDN for static assets

### Monitoring

- Message delivery rates
- Error rates and types
- Response times
- Socket connection health
- Email bounce rates

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP configuration
   - Verify email credentials
   - Check firewall settings

2. **Socket connection issues**
   - Verify CORS configuration
   - Check port availability
   - Monitor connection limits

3. **Rate limiting too strict**
   - Adjust rate limit configuration
   - Consider IP whitelisting
   - Monitor legitimate usage patterns

4. **Message not appearing**
   - Check database connection
   - Verify socket events
   - Check admin permissions

### Debug Mode

Enable debug logging:

```env
DEBUG=messages:*
NODE_ENV=development
```

## Future Enhancements

### Planned Features

1. **Email Templates Editor** - Admin interface for editing templates
2. **Message Categories** - Organize messages by type/category
3. **Auto-responses** - Automatic replies for common questions
4. **Message Analytics** - Detailed reporting and analytics
5. **Multi-language Support** - Templates in multiple languages
6. **File Attachments** - Support for file uploads in contact forms
7. **Message Threading** - Better conversation management
8. **Mobile App Integration** - Push notifications for admins

### Technical Improvements

1. **Caching Layer** - Redis for message caching
2. **Queue System** - Background job processing
3. **Microservices** - Separate email service
4. **API Versioning** - Backward compatibility
5. **GraphQL** - More efficient data fetching
6. **Webhooks** - External system integration

## Support

For technical support or questions about this system:

- Check the troubleshooting section above
- Review error logs
- Test with the provided test script
- Contact the development team

---

*Last updated: [Current Date]*
*Version: 1.0.0*
