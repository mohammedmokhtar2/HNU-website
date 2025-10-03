# User Action Tracking Middleware

This middleware system provides comprehensive user action tracking for both authenticated and guest users across your application.

## Features

- **Dual User Support**: Tracks both logged-in users (via Clerk ID) and guest users (via session ID)
- **Client-Side Interceptor**: Automatically adds user identification headers to all requests
- **Server-Side Tracking**: Comprehensive API route tracking with configurable options
- **Session Management**: Guest users are tracked via persistent session IDs
- **Rich Metadata**: Captures detailed information about user actions
- **Performance Optimized**: Non-blocking tracking that won't affect user experience

## Quick Start

### 1. Set up Client-Side Interceptor

Add the user action interceptor to your root layout or main app component:

```tsx
// app/layout.tsx or app/[locale]/layout.tsx
import { useUserActionInterceptor } from '@/hooks/use-user-action-tracking';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // This automatically adds user ID headers to all requests
  useUserActionInterceptor();
  
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Track Page Visits

Wrap your pages with automatic page visit tracking:

```tsx
// app/[locale]/about/page.tsx
import { withPageTracking } from '@/hooks/use-user-action-tracking';

function AboutPage() {
  return <div>About Page Content</div>;
}

export default withPageTracking(AboutPage, 'About Page');
```

### 3. Track User Interactions

Use the tracking hooks in your components:

```tsx
// components/ContactForm.tsx
import { useUserActionTracking } from '@/hooks/use-user-action-tracking';

export function ContactForm() {
  const { trackFormSubmit, trackButtonClick } = useUserActionTracking();

  const handleSubmit = (formData: any) => {
    trackFormSubmit('contact-form', formData);
    // Your form submission logic
  };

  const handleButtonClick = () => {
    trackButtonClick('submit-button', 'Submit Contact Form');
    // Your button click logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={handleButtonClick}>Submit</button>
    </form>
  );
}
```

### 4. Wrap API Routes

Apply tracking to your API routes:

```tsx
// app/api/users/route.ts
import { withApiTrackingMethods, ApiTrackingPresets } from '@/lib/middleware/apiTrackingMiddleware';

async function GET(req: NextRequest) {
  // Your GET logic
}

async function POST(req: NextRequest) {
  // Your POST logic
}

async function PUT(req: NextRequest) {
  // Your PUT logic
}

async function DELETE(req: NextRequest) {
  // Your DELETE logic
}

// Apply CRUD tracking
export const { GET, POST, PUT, DELETE } = withApiTrackingMethods(
  { GET, POST, PUT, DELETE },
  ApiTrackingPresets.crud('User')
);
```

### 5. Custom API Tracking

For more control over tracking:

```tsx
// app/api/files/upload/route.ts
import { withApiTracking, ApiTrackingPresets } from '@/lib/middleware/apiTrackingMiddleware';

async function POST(req: NextRequest) {
  // Your file upload logic
}

export const POST = withApiTracking(
  POST,
  ApiTrackingPresets.fileOperation('upload')
);
```

## Configuration Options

### API Tracking Configuration

```typescript
import { withApiTracking, createTrackingConfig } from '@/lib/middleware/apiTrackingMiddleware';

// Custom configuration
const customConfig = createTrackingConfig(
  'FILE_UPLOAD',
  'Document',
  (req, res) => ({
    fileName: req.headers.get('x-file-name'),
    fileSize: req.headers.get('x-file-size'),
  })
);

export const POST = withApiTracking(POST, customConfig);
```

### Available Presets

- `ApiTrackingPresets.crud(entity)` - For CRUD operations
- `ApiTrackingPresets.fileOperation(operation)` - For file operations
- `ApiTrackingPresets.formSubmission(formName)` - For form submissions
- `ApiTrackingPresets.search(searchEntity)` - For search operations
- `ApiTrackingPresets.auth(authAction)` - For authentication operations

## User Scenarios

### Scenario 1: Guest User (Not Logged In)

When a user is not logged in:
- `clerkId` is `null`
- `userId` is `null`
- `isGuest` is `true`
- Actions are tracked using `sessionId`
- Session ID is stored in localStorage and sent with requests

### Scenario 2: Authenticated User

When a user is logged in:
- `clerkId` contains the Clerk user ID
- `userId` is resolved from the database using `clerkId`
- `isGuest` is `false`
- Actions are tracked using both `clerkId` and `userId`

### Scenario 3: Guest User with Backend Access

For guest users who can perform backend actions:
- Same as Scenario 1, but actions are still logged
- Useful for tracking what guest users are doing
- Can be used for analytics and security monitoring

## Retrieving User Action Logs

### Get Logs for Current User

```typescript
// Get current user's logs
const response = await fetch('/api/user-actions/logs');
const { logs } = await response.json();
```

### Get Logs for Specific User (Admin)

```typescript
// Get logs for specific user
const response = await fetch('/api/user-actions/logs?clerkId=user_123');
const { logs } = await response.json();
```

### Get Guest User Logs

```typescript
// Get logs for guest users
const response = await fetch('/api/user-actions/logs?isGuest=true');
const { logs } = await response.json();
```

### Get Logs by Session

```typescript
// Get logs for specific session
const response = await fetch('/api/user-actions/logs?sessionId=session_123');
const { logs } = await response.json();
```

### Filter Logs

```typescript
// Get logs with filters
const response = await fetch('/api/user-actions/logs?' + new URLSearchParams({
  action: 'PAGE_VISIT',
  entity: 'User',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  page: '1',
  limit: '50'
}));
const { logs, pagination } = await response.json();
```

## Database Schema

The system uses the `AuditLog` table with the following fields:

```sql
model AuditLog {
  id        String   @id @default(cuid())
  action    String
  entity    String
  entityId  String?
  metadata  Json?
  userId    String?      -- Database user ID (for authenticated users)
  clerkId   String?      -- Clerk user ID
  sessionId String?      -- Session ID (for guest users)
  isGuest   Boolean      -- Whether this is a guest user
  ipAddress String?      -- User's IP address
  userAgent String?      -- User's browser info
  createdAt DateTime     -- When the action occurred
}
```

## Migration

To apply the database changes:

```bash
# Generate Prisma migration
npx prisma migrate dev --name enhance_audit_log

# Or apply the SQL migration directly
psql your_database < prisma/migrations/enhance_audit_log.sql
```

## Security Considerations

- **IP Address Logging**: IP addresses are logged for security auditing
- **Session Management**: Session IDs are generated client-side and stored in localStorage
- **Data Privacy**: Consider your privacy policy when logging user actions
- **Retention Policy**: Implement log retention policies to manage storage

## Performance Considerations

- **Non-blocking**: All tracking is asynchronous and won't block user actions
- **Error Handling**: Tracking failures won't break your application
- **Indexing**: Database indexes are optimized for common query patterns
- **Batching**: Consider implementing log batching for high-traffic applications

## Troubleshooting

### Common Issues

1. **Actions not being tracked**
   - Check if the interceptor is properly initialized
   - Verify that API routes are wrapped with tracking middleware
   - Check browser console for tracking errors

2. **Guest users not being tracked**
   - Ensure session ID is being generated and stored
   - Check that `x-session-id` header is being sent with requests

3. **Database errors**
   - Verify that the migration has been applied
   - Check database connection and permissions

### Debug Mode

Enable debug logging by setting environment variable:

```bash
USER_ACTION_DEBUG=true
```

This will log detailed information about tracking decisions and user identification.
