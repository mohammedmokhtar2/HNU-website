import { NextRequest, NextResponse } from 'next/server';
import { AuditAction, logAction } from '@/utils/auditLogger';
import { getUserIdHeader } from '@/lib/auth-headers';

/**
 * Global audit configuration for different route patterns
 */
const AUDIT_CONFIG = {
  // Routes that should be audited
  auditableRoutes: [
    /^\/api\/users/,
    /^\/api\/colleges/,
    /^\/api\/sections/,
    /^\/api\/university/,
    /^\/api\/statistics/,
  ],

  // Routes that should be skipped
  skippedRoutes: [
    /^\/api\/logs/, // Don't audit log queries
    /^\/api\/test/, // Skip test routes
    /^\/api\/health/, // Skip health checks
  ],

  // Methods to skip
  skippedMethods: ['GET', 'OPTIONS'],

  // Custom action mappings for specific routes
  customActions: {
    '/api/users': {
      POST: 'CREATE_USER',
      PUT: 'UPDATE_USER',
      DELETE: 'DELETE_USER',
    },
    '/api/colleges': {
      POST: 'CREATE_COLLEGE',
      PUT: 'UPDATE_COLLEGE',
      DELETE: 'DELETE_COLLEGE',
    },
  },
} as const;

/**
 * Checks if a route should be audited
 */
function shouldAuditRoute(pathname: string, method: string): boolean {
  // Skip if method is in skipped methods
  if (AUDIT_CONFIG.skippedMethods.includes(method as any)) {
    return false;
  }

  // Skip if route matches skipped patterns
  if (AUDIT_CONFIG.skippedRoutes.some(pattern => pattern.test(pathname))) {
    return false;
  }

  // Include if route matches auditable patterns
  return AUDIT_CONFIG.auditableRoutes.some(pattern => pattern.test(pathname));
}

/**
 * Generates audit action for a request
 */
function generateAuditAction(req: NextRequest): AuditAction {
  const pathname = new URL(req.url).pathname;
  const method = req.method;

  // Check for custom action mapping
  const customActions =
    AUDIT_CONFIG.customActions[
      pathname as keyof typeof AUDIT_CONFIG.customActions
    ];
  if (customActions && customActions[method as keyof typeof customActions]) {
    return customActions[method as keyof typeof customActions] as AuditAction;
  }

  // Generate action based on method and path
  const pathParts = pathname.split('/').filter(Boolean);
  const resource = pathParts[1] || 'unknown';
  const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1);

  const actionMap: Record<string, string> = {
    POST: 'CREATE',
    PUT: 'UPDATE',
    PATCH: 'UPDATE',
    DELETE: 'DELETE',
  };

  const prefix = actionMap[method] || 'UNKNOWN';
  return `${prefix}_${resourceName}` as AuditAction;
}

/**
 * Generates entity name from path
 */
function generateEntity(req: NextRequest): string {
  const pathname = new URL(req.url).pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  const resource = pathParts[1] || 'Unknown';
  return resource.charAt(0).toUpperCase() + resource.slice(1);
}

/**
 * Extracts user ID from request
 */
async function extractUserId(req: NextRequest): Promise<string | undefined> {
  // Try header first
  const userIdFromHeader = req.headers.get('x-user-id');
  if (userIdFromHeader) {
    return userIdFromHeader;
  }

  // Try auth helper
  try {
    const userId = await getUserIdHeader();
    return userId || undefined;
  } catch (error) {
    console.warn('Could not extract user ID for audit log:', error);
    return undefined;
  }
}

/**
 * Creates audit metadata for a request
 */
function createAuditMetadata(
  req: NextRequest,
  res: NextResponse,
  duration: number
) {
  return {
    method: req.method,
    url: req.url,
    statusCode: res.status,
    duration,
    userAgent: req.headers.get('user-agent'),
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Logs an API call if it should be audited
 */
export async function logApiCallIfNeeded(
  req: NextRequest,
  res: NextResponse,
  duration: number
): Promise<void> {
  const pathname = new URL(req.url).pathname;

  // Check if this route should be audited
  if (!shouldAuditRoute(pathname, req.method)) {
    return;
  }

  try {
    // Extract user ID
    const userId = await extractUserId(req);

    // Generate action and entity
    const action = generateAuditAction(req);
    const entity = generateEntity(req);

    // Create metadata
    const metadata = createAuditMetadata(req, res, duration);

    // Log the action
    await logAction({
      action,
      userId,
      entity,
      metadata,
    });

    console.log(`Audit logged: ${action} on ${entity} by user ${userId}`);
  } catch (error) {
    // Don't let audit logging break the API response
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Higher-order function that wraps API handlers with automatic audit logging
 */
export function withGlobalAudit<
  T extends (...args: any[]) => Promise<NextResponse>,
>(handler: T): T {
  return (async (...args: any[]) => {
    const req = args[0] as NextRequest;
    const startTime = Date.now();

    try {
      // Execute the handler
      const response = await handler(...args);

      // Log the call if needed
      await logApiCallIfNeeded(req, response, Date.now() - startTime);

      return response;
    } catch (error) {
      // Even if there's an error, try to log it
      try {
        const errorResponse = NextResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 }
        );
        await logApiCallIfNeeded(req, errorResponse, Date.now() - startTime);
      } catch (logError) {
        console.error('Failed to log error audit:', logError);
      }

      // Re-throw the original error
      throw error;
    }
  }) as T;
}
