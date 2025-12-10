# Message System Documentation

## Overview

The HNU Official Website includes a comprehensive message management system that handles email communications, notifications, and message tracking. This system is built with TypeScript, Next.js, Prisma, and NodeMailer.

## Features

### Core Functionality
- **Message Creation**: Create messages with rich configuration options
- **Email Sending**: Integrated NodeMailer service for reliable email delivery
- **Message Status Tracking**: Track message status (Pending, Sent, Delivered, Read, Failed, Scheduled)
- **Priority Management**: Support for different message priorities (Low, Normal, High, Urgent)
- **Scheduling**: Schedule messages for future delivery
- **Retry Logic**: Automatic retry for failed messages
- **Bulk Operations**: Bulk update and delete operations
- **Real-time Notifications**: Live unread message counts in admin interface

### Admin Panel Features
- **Message Management**: Full CRUD operations for messages
- **Dashboard**: Statistics and analytics for message performance
- **Filtering & Search**: Advanced filtering by status, type, priority, and date range
- **Bulk Actions**: Select and perform actions on multiple messages
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Notification Center**: Dedicated message notifications in admin header

## Architecture

### Database Schema

The message system uses a single `messages` table with a flexible JSON configuration:

```sql
model messages {
  id            String   @id @default(cuid())
  messageConfig Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("messages")
}
```

### Message Configuration

The `messageConfig` JSON field contains all message details:

```typescript
interface MessageConfig {
  from?: string;                    // Sender email
  to: string | string[];           // Recipient(s)
  cc?: string[];                   // CC recipients
  bcc?: string[];                  // BCC recipients
  subject: string;                 // Email subject
  body: string;                     // Plain text body
  htmlBody?: string;               // HTML body
  attachments?: Attachment[];      // File attachments
  status: MessageStatus;           // Current status
  type: MessageType;               // Message type
  priority: MessagePriority;       // Priority level
  scheduledAt?: string;            // Scheduled delivery time
  retryCount: number;              // Number of retry attempts
  maxRetries: number;              // Maximum retry attempts
  metadata?: Record<string, any>;   // Additional metadata
  templateId?: string;             // Email template ID
  templateData?: Record<string, any>; // Template variables
}
```

### API Endpoints

#### Messages CRUD
- `GET /api/messages` - List messages with filtering and pagination
- `POST /api/messages` - Create new message
- `GET /api/messages/[id]` - Get specific message
- `PUT /api/messages/[id]` - Update message
- `DELETE /api/messages/[id]` - Delete message

#### Message Operations
- `POST /api/messages/send` - Send specific message
- `POST /api/messages/cron` - Process scheduled and pending messages
- `GET /api/messages/stats` - Get message statistics
- `GET /api/messages/unread-count` - Get unread message count

## Setup and Configuration

### Environment Variables

Add these environment variables to your `.env.local`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# Cron Job Security (optional)
CRON_SECRET=your-secret-key

# Database
DATABASE_URL=your-database-url
```

### Dependencies

The message system requires these additional packages:

```bash
npm install nodemailer @types/nodemailer
```

### Database Migration

Run the Prisma migration to create the messages table:

```bash
npm run db:push
```

## Usage

### Creating Messages

```typescript
import { MessageService } from '@/services/message.service';

const message = await MessageService.createMessage({
  messageConfig: {
    to: 'user@example.com',
    subject: 'Welcome to HNU',
    body: 'Welcome to Helwan National University!',
    htmlBody: '<h1>Welcome to HNU!</h1><p>Welcome to Helwan National University!</p>',
    type: 'EMAIL',
    priority: 'NORMAL',
  },
});
```

### Sending Messages

```typescript
// Send immediately
const result = await MessageService.sendMessage(messageId);

// Schedule for later
const scheduled = await MessageService.scheduleMessage(
  messageId, 
  '2024-12-25T10:00:00Z'
);
```

### Using the Message Context

```typescript
import { useMessage } from '@/contexts/MessageContext';

function MyComponent() {
  const {
    messages,
    loading,
    createMessage,
    sendMessage,
    markAsRead,
    unreadCount,
  } = useMessage();

  // Use message functions...
}
```

### Admin Panel Integration

The message system is fully integrated into the admin panel:

1. **Navigation**: Messages appear in the System section with unread count badge
2. **Header Notifications**: Real-time message notifications in the admin header
3. **Management Page**: Full message management interface at `/admin/system/messages`

## Cron Job Setup

### Manual Execution

```bash
# Run message processing
npm run cron:messages

# Check status
npm run cron:messages:status
```

### Automated Scheduling

Set up a cron job to run every minute:

```bash
# Add to crontab
* * * * * cd /path/to/project && npm run cron:messages
```

Or use a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'message-cron',
    script: 'scripts/message-cron.js',
    cron_restart: '* * * * *',
    autorestart: false,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
```

## Message Types

### Email Messages
- Standard email communication
- Support for HTML and plain text
- File attachments
- CC and BCC recipients

### SMS Messages
- Text message notifications
- Character limit handling
- Delivery status tracking

### Push Notifications
- Mobile app notifications
- Real-time delivery
- Click tracking

### System Notifications
- Internal system alerts
- Admin notifications
- Audit trail messages

## Status Flow

```
PENDING → SENT → DELIVERED → READ
    ↓
  FAILED → RETRY → SENT (if retry successful)
    ↓
SCHEDULED → PENDING (when scheduled time arrives)
```

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **SMTP Errors**: Detailed error logging and status updates
- **Validation Errors**: Input validation with clear error messages
- **Database Errors**: Transaction rollback and error recovery

## Performance Considerations

### Optimization Features
- **Pagination**: Efficient data loading with configurable page sizes
- **Caching**: React Query caching for improved performance
- **Real-time Updates**: Optimized polling intervals
- **Bulk Operations**: Efficient batch processing

### Monitoring
- **Message Statistics**: Track delivery rates and performance
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time monitoring

## Security

### Authentication
- **Admin Access**: Role-based access control
- **API Security**: Protected endpoints with authentication
- **Cron Security**: Optional secret key for cron job authentication

### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection**: Prisma ORM protection
- **XSS Prevention**: Sanitized HTML content

## Troubleshooting

### Common Issues

1. **SMTP Connection Failed**
   - Check SMTP credentials
   - Verify network connectivity
   - Check firewall settings

2. **Messages Not Sending**
   - Verify NodeMailer configuration
   - Check message status in admin panel
   - Review error logs

3. **Cron Job Not Running**
   - Check cron job configuration
   - Verify script permissions
   - Review system logs

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=messages:*
```

## Future Enhancements

### Planned Features
- **Email Templates**: Rich template system with variables
- **Advanced Scheduling**: Recurring message scheduling
- **Analytics Dashboard**: Detailed message analytics
- **Webhook Support**: Real-time status updates
- **Multi-language Support**: Internationalized messages
- **Message Queuing**: High-volume message processing

### Integration Opportunities
- **CRM Integration**: Customer relationship management
- **Marketing Automation**: Automated marketing campaigns
- **Support System**: Customer support ticket integration
- **Event Notifications**: System event notifications

## Support

For technical support or questions about the message system:

1. Check the troubleshooting section
2. Review error logs in the admin panel
3. Consult the API documentation
4. Contact the development team

## Contributing

When contributing to the message system:

1. Follow the existing code patterns
2. Add comprehensive tests
3. Update documentation
4. Follow the project's coding standards
5. Test with different email providers

---

*This documentation is maintained by the HNU Official Website development team.*
