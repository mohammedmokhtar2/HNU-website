# API Authentication Implementation

This document explains how authentication is implemented for all API routes in the application.

## Overview

All API routes now require user authentication by default. The authentication is handled at the middleware level using Clerk authentication.

## How It Works

### 1. Middleware Protection

The main `middleware.ts` file now protects all API routes by:
- Checking if the request is to an API route (`/api/*`)
- Verifying user authentication using Clerk's `auth()` function
- Returning a 401 Unauthorized response for unauthenticated requests
- Adding the user ID to request headers for downstream handlers

### 2. Public API Routes

Some API routes can be made public by adding them to the `publicApiRoutes` array in `middleware.ts`:

```typescript
const publicApiRoutes = [
  '/api/health',
  '/api/example', // Add any public API routes here
];
```

### 3. Authentication Middleware

A comprehensive authentication middleware is available at `lib/middleware/authMiddleware.ts` that provides:

- `checkAuthentication()` - Check if user is authenticated
- `withAuth()` - Higher-order function to wrap handlers with authentication
- `createAuthenticatedRoute()` - Create authenticated route handlers
- `requireAuth()` - Middleware function for individual route checks

## Usage Examples

### Method 1: Using createAuthenticatedRoute (Recommended)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedRoute } from '@/lib/middleware/authMiddleware';
import { getUserIdFromHeaders } from '@/lib/auth-headers';

async function handleGET(req: NextRequest) {
  const userId = getUserIdFromHeaders(req);
  // Your logic here
  return NextResponse.json({ userId, data: 'your data' });
}

async function handlePOST(req: NextRequest) {
  const userId = getUserIdFromHeaders(req);
  // Your logic here
  return NextResponse.json({ success: true });
}

export const { GET, POST } = createAuthenticatedRoute({
  GET: handleGET,
  POST: handlePOST,
});
```

### Method 2: Using requireAuth in individual handlers

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/authMiddleware';
import { getUserIdFromHeaders } from '@/lib/auth-headers';

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) {
    return authError;
  }

  const userId = getUserIdFromHeaders(req);
  // Your logic here
  return NextResponse.json({ userId, data: 'your data' });
}
```

### Method 3: Manual authentication check

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { checkAuthentication } from '@/lib/middleware/authMiddleware';

export async function GET(req: NextRequest) {
  const authResult = await checkAuthentication(req);
  
  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Your logic here
  return NextResponse.json({ userId: authResult.userId });
}
```

## Getting User Information

### From Request Headers (Recommended)

```typescript
import { getUserIdFromHeaders, isAuthenticated } from '@/lib/auth-headers';

export async function GET(req: NextRequest) {
  const userId = getUserIdFromHeaders(req);
  const authenticated = isAuthenticated(req);
  
  // Use userId and authenticated status
}
```

### From Clerk Auth Context

```typescript
import { getUserIdHeader } from '@/lib/auth-headers';

export async function GET(req: NextRequest) {
  const userId = await getUserIdHeader();
  
  // Use userId
}
```

## Error Responses

When authentication fails, the API returns a standardized error response:

```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}
```

With HTTP status code 401 and `WWW-Authenticate: Bearer` header.

## Migration Guide

To migrate existing API routes to use authentication:

1. **Import the authentication utilities:**
   ```typescript
   import { createAuthenticatedRoute } from '@/lib/middleware/authMiddleware';
   import { getUserIdFromHeaders } from '@/lib/auth-headers';
   ```

2. **Wrap your handlers:**
   ```typescript
   // Before
   export const { GET, POST } = { GET: handleGET, POST: handlePOST };
   
   // After
   export const { GET, POST } = createAuthenticatedRoute({
     GET: handleGET,
     POST: handlePOST,
   });
   ```

3. **Update handlers to use authenticated user ID:**
   ```typescript
   async function handleGET(req: NextRequest) {
     const userId = getUserIdFromHeaders(req);
     // Use userId in your logic
   }
   ```

## Testing Authentication

To test that authentication is working:

1. **Test unauthenticated request:**
   ```bash
   curl -X GET http://localhost:3000/api/users
   # Should return 401 Unauthorized
   ```

2. **Test authenticated request:**
   ```bash
   # Include authentication headers/tokens as required by your setup
   curl -X GET http://localhost:3000/api/users \
     -H "Authorization: Bearer YOUR_TOKEN"
   # Should return data
   ```

## Security Considerations

- All API routes are protected by default
- User ID is available in request headers for authenticated requests
- Public routes must be explicitly whitelisted
- Authentication errors are logged for monitoring
- CORS headers are properly configured for authenticated requests

## Troubleshooting

### Common Issues

1. **401 Unauthorized for all requests:**
   - Check if Clerk is properly configured
   - Verify authentication tokens are being sent correctly

2. **User ID not found in headers:**
   - Ensure the middleware is running before your route handler
   - Check that the request is properly authenticated

3. **CORS issues:**
   - Verify CORS headers include `x-user-id` in allowed headers
   - Check that preflight OPTIONS requests are handled correctly

### Debug Mode

Enable debug logging by checking the console for authentication-related messages and errors.
