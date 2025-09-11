# Automatic API Audit Logging

This directory contains middleware and utilities for automatically logging all API calls without requiring manual wrapping of each endpoint.

## Overview

The automatic audit logging system provides several approaches to log API calls:

1. **Global Middleware** - Automatically logs all API calls based on configuration
2. **Route Wrappers** - Wrap individual route files with audit logging
3. **Migration Tools** - Convert existing routes to use automatic logging

## Quick Start

### Option 1: Simple Route Wrapping (Recommended)

Replace your existing route exports with automatic wrapping:

```typescript
// Before
export async function GET(req: NextRequest) { ... }
export async function POST(req: NextRequest) { ... }
export async function PUT(req: NextRequest) { ... }

// After
import { autoWrapRouteHandlers } from '@/lib/middleware/autoWrapRoutes';

async function GET(req: NextRequest) { ... }
async function POST(req: NextRequest) { ... }
async function PUT(req: NextRequest) { ... }

export const { GET, POST, PUT } = autoWrapRouteHandlers({
  GET, POST, PUT
});
```

### Option 2: Advanced Configuration

For more control over audit logging:

```typescript
import { withAuditRoute } from '@/lib/middleware/routeWrapper';

async function GET(req: NextRequest) { ... }
async function POST(req: NextRequest) { ... }

export const { GET, POST } = withAuditRoute(
  { GET, POST },
  {
    audit: {
      entity: 'CustomEntity',
      extractMetadata: (req, res) => ({
        customField: 'value'
      })
    },
    skipMethods: ['GET'], // Skip GET requests
  }
);
```

## Features

### Automatic Action Generation

The system automatically generates audit actions based on:
- HTTP method (POST → CREATE, PUT → UPDATE, DELETE → DELETE)
- Route path (/api/permissions → PERMISSIONS)
- Special patterns (toggle, search, stats)

Examples:
- `POST /api/permissions` → `CREATE_PERMISSION`
- `PUT /api/users/123` → `UPDATE_USER`
- `DELETE /api/colleges/456` → `DELETE_COLLEGE`
- `POST /api/permissions/123/toggle` → `TOGGLE_PERMISSION`

### Smart Filtering

By default, the system:
- Skips GET and OPTIONS requests (read operations)
- Skips test and health check routes
- Only logs successful requests (2xx status codes)
- Logs all write operations (POST, PUT, PATCH, DELETE)

### User ID Extraction

The system automatically extracts user IDs from:
1. `x-user-id` header
2. Auth helper functions
3. Clerk user ID conversion

### Rich Metadata

Each audit log includes:
- HTTP method and URL
- Response status code
- Request duration
- User agent and IP address
- Custom metadata (configurable)

## Configuration

### Global Configuration

Edit `globalAuditMiddleware.ts` to configure:

```typescript
const AUDIT_CONFIG = {
  // Routes to audit
  auditableRoutes: [
    /^\/api\/permissions/,
    /^\/api\/users/,
    // Add more patterns
  ],
  
  // Routes to skip
  skippedRoutes: [
    /^\/api\/logs/,
    /^\/api\/test/,
  ],
  
  // Methods to skip
  skippedMethods: ['GET', 'OPTIONS'],
  
  // Custom action mappings
  customActions: {
    '/api/permissions': {
      POST: 'CREATE_PERMISSION',
      PUT: 'UPDATE_PERMISSION',
    },
  },
};
```

### Per-Route Configuration

```typescript
export const { GET, POST } = withAuditRoute(
  { GET, POST },
  {
    audit: {
      entity: 'Permission',
      extractMetadata: (req, res) => ({
        endpoint: 'permissions',
        operation: 'create',
      }),
    },
    methods: {
      POST: {
        action: 'CUSTOM_CREATE_ACTION',
      },
    },
    skipMethods: ['GET'],
  }
);
```

## Migration

### Automatic Migration

Run the migration script to convert existing routes:

```bash
node scripts/migrate-routes-to-audit.js
```

### Manual Migration

1. Add the import:
   ```typescript
   import { autoWrapRouteHandlers } from '@/lib/middleware/autoWrapRoutes';
   ```

2. Remove `withAuditLog` wrapping:
   ```typescript
   // Remove this
   export const POST = withAuditLog(handler, options);
   
   // Replace with
   async function POST(req: NextRequest) { ... }
   ```

3. Update exports:
   ```typescript
   export const { GET, POST, PUT, DELETE } = autoWrapRouteHandlers({
     GET, POST, PUT, DELETE
   });
   ```

## API Reference

### autoWrapRouteHandlers(handlers)

Wraps all HTTP method handlers with automatic audit logging.

**Parameters:**
- `handlers` - Object with method names as keys and handler functions as values

**Returns:** Wrapped handlers with audit logging

### withAuditRoute(handlers, config)

Advanced route wrapping with configuration options.

**Parameters:**
- `handlers` - Object with method handlers
- `config` - Configuration object
  - `audit` - Global audit options
  - `methods` - Method-specific options
  - `skipMethods` - Methods to skip

### withGlobalAudit(handler)

Wraps a single handler function with global audit logging.

## Examples

### Basic Route

```typescript
// app/api/users/route.ts
import { autoWrapRouteHandlers } from '@/lib/middleware/autoWrapRoutes';

async function GET(req: NextRequest) {
  // Your GET logic
}

async function POST(req: NextRequest) {
  // Your POST logic
}

export const { GET, POST } = autoWrapRouteHandlers({ GET, POST });
```

### Advanced Route with Custom Configuration

```typescript
// app/api/permissions/route.ts
import { withAuditRoute } from '@/lib/middleware/routeWrapper';

async function GET(req: NextRequest) { ... }
async function POST(req: NextRequest) { ... }
async function PUT(req: NextRequest) { ... }
async function DELETE(req: NextRequest) { ... }

export const { GET, POST, PUT, DELETE } = withAuditRoute(
  { GET, POST, PUT, DELETE },
  {
    audit: {
      entity: 'Permission',
      extractMetadata: (req, res) => ({
        resource: req.url.split('/').pop(),
        timestamp: new Date().toISOString(),
      }),
    },
    methods: {
      POST: {
        action: 'CREATE_PERMISSION',
        extractMetadata: (req, res) => ({
          operation: 'create',
          endpoint: 'permissions',
        }),
      },
    },
    skipMethods: ['GET'],
  }
);
```

### Dynamic Route with Parameters

```typescript
// app/api/users/[id]/route.ts
import { autoWrapRouteHandlers } from '@/lib/middleware/autoWrapRoutes';

async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Your GET logic with params.id
}

async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // Your PUT logic with params.id
}

export const { GET, PUT } = autoWrapRouteHandlers({ GET, PUT });
```

## Troubleshooting

### Common Issues

1. **Audit logs not being created**
   - Check that the route matches `auditableRoutes` patterns
   - Verify the method is not in `skippedMethods`
   - Ensure the response status is 2xx

2. **User ID not being extracted**
   - Check that `x-user-id` header is being sent
   - Verify auth helper functions are working
   - Check console for user ID extraction warnings

3. **Custom actions not working**
   - Verify the route path matches exactly in `customActions`
   - Check that the method name is correct

### Debug Mode

Enable debug logging by setting:

```typescript
// In your route file
process.env.AUDIT_DEBUG = 'true';
```

This will log detailed information about audit decisions and user ID extraction.

## Performance Considerations

- Audit logging is asynchronous and won't block API responses
- Failed audit logging won't break API functionality
- GET requests are skipped by default to reduce overhead
- Consider the volume of API calls when enabling audit logging

## Security Notes

- User IDs are automatically extracted and converted from Clerk IDs
- IP addresses are logged for security auditing
- Sensitive data should not be included in metadata without proper sanitization
- Audit logs are stored in the database and should be secured appropriately
