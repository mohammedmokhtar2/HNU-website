import { NextRequest, NextResponse } from 'next/server';
import { AuditAction, logAction } from '@/utils/auditLogger';
import { getUserIdHeader } from '@/lib/auth-headers';

type ApiHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

export type AutoAuditOptions = {
  // Override the default action naming convention
  action?: AuditAction;
  // Override the default entity name
  entity?: string;
  // Custom metadata extraction
  extractMetadata?: (req: NextRequest, res: NextResponse) => any;
  // Skip logging for certain conditions
  skipLogging?: (req: NextRequest, res: NextResponse) => boolean;
};

/**
 * Automatically generates audit logs for API routes based on HTTP method and route path
 *
 * @param handler - The API route handler function
 * @param options - Optional configuration for audit logging
 * @returns Wrapped handler with automatic audit logging
 */
export function withAutoAuditLog(
  handler: ApiHandler,
  options: AutoAuditOptions = {}
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const startTime = Date.now();
    let response: NextResponse;
    let error: any = null;

    try {
      // Execute the original handler
      response = await handler(req, ...args);
    } catch (err) {
      error = err;
      // Re-throw the error to maintain normal error handling
      throw err;
    } finally {
      // Always attempt to log, even if there was an error
      try {
        await logApiCall(req, response!, error, startTime, options);
      } catch (logError) {
        // Don't let logging errors break the API response
        console.error('Failed to create audit log:', logError);
      }
    }

    return response!;
  };
}

/**
 * Logs API calls with automatic action and entity detection
 */
async function logApiCall(
  req: NextRequest,
  res: NextResponse,
  error: any,
  startTime: number,
  options: AutoAuditOptions
) {
  // Skip if explicitly configured to skip
  if (options.skipLogging && options.skipLogging(req, res)) {
    return;
  }

  // Skip GET requests by default (as per existing logic)
  if (req.method === 'GET') {
    return;
  }

  // Skip if response indicates an error (4xx, 5xx)
  if (res.status >= 400) {
    return;
  }

  // Extract user ID
  const userIdFromHeader = req.headers.get('x-user-id');
  let userId = userIdFromHeader || undefined;

  if (!userId) {
    try {
      const headerUserId = await getUserIdHeader();
      userId = headerUserId || undefined;
    } catch (err) {
      console.warn('Could not extract user ID for audit log:', err);
    }
  }

  // Generate action based on HTTP method and route
  const action = options.action || generateAction(req);

  // Generate entity based on route path
  const entity = options.entity || generateEntity(req);

  // Extract metadata
  const metadata = {
    method: req.method,
    url: req.url,
    statusCode: res.status,
    duration: Date.now() - startTime,
    userAgent: req.headers.get('user-agent'),
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    ...(options.extractMetadata ? options.extractMetadata(req, res) : {}),
  };

  // Log the action
  await logAction({
    action,
    userId,
    entity,
    metadata,
  });
}

/**
 * Generates audit action based on HTTP method and route path
 */
function generateAction(req: NextRequest): AuditAction {
  const method = req.method;
  const pathname = new URL(req.url).pathname;

  // Extract resource name from path (e.g., /api/permissions -> permissions)
  const pathParts = pathname.split('/').filter(Boolean);
  const resource = pathParts[1] || 'unknown'; // Skip 'api' part

  // Convert resource to PascalCase for action
  const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1);

  // Map HTTP methods to action prefixes
  const actionMap: Record<string, string> = {
    POST: 'CREATE',
    PUT: 'UPDATE',
    PATCH: 'UPDATE',
    DELETE: 'DELETE',
    GET: 'GET',
  };

  const prefix = actionMap[method] || 'UNKNOWN';

  // Handle special cases
  if (pathname.includes('/toggle')) {
    return `TOGGLE_${resourceName}` as AuditAction;
  }

  if (pathname.includes('/search')) {
    return `SEARCH_${resourceName}` as AuditAction;
  }

  if (pathname.includes('/stats')) {
    return `GET_${resourceName}_STATS` as AuditAction;
  }

  return `${prefix}_${resourceName}` as AuditAction;
}

/**
 * Generates entity name based on route path
 */
function generateEntity(req: NextRequest): string {
  const pathname = new URL(req.url).pathname;
  const pathParts = pathname.split('/').filter(Boolean);

  // Extract resource name (skip 'api' part)
  const resource = pathParts[1] || 'Unknown';

  // Convert to PascalCase
  return resource.charAt(0).toUpperCase() + resource.slice(1);
}

/**
 * Higher-order function to wrap all HTTP methods in a route file
 * Usage: export const { GET, POST, PUT, DELETE } = withAutoAuditMethods({ GET, POST, PUT, DELETE });
 */
export function withAutoAuditMethods(
  handlers: Record<string, ApiHandler>,
  options: AutoAuditOptions = {}
) {
  const wrappedHandlers: Record<string, ApiHandler> = {};

  for (const [method, handler] of Object.entries(handlers)) {
    if (typeof handler === 'function') {
      wrappedHandlers[method] = withAutoAuditLog(handler, options);
    }
  }

  return wrappedHandlers;
}

/**
 * Decorator for individual route handlers
 * Usage: export const GET = withAutoAudit(handler, { action: 'CUSTOM_ACTION' });
 */
export const withAutoAudit = withAutoAuditLog;
