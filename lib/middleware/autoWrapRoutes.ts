import { NextRequest, NextResponse } from 'next/server';
import { withGlobalAudit } from './globalAuditMiddleware';

/**
 * Automatically wraps all HTTP method exports in a route file with audit logging
 *
 * Usage in any route.ts file:
 *
 * // Your existing handlers
 * async function GET(req: NextRequest) { ... }
 * async function POST(req: NextRequest) { ... }
 * async function PUT(req: NextRequest) { ... }
 * async function DELETE(req: NextRequest) { ... }
 * async function OPTIONS(req: NextRequest) { ... }
 *
 * // Auto-wrap all methods
 * export const { GET, POST, PUT, DELETE, OPTIONS } = autoWrapRouteHandlers({
 *   GET, POST, PUT, DELETE, OPTIONS
 * });
 */
export function autoWrapRouteHandlers<T extends Record<string, any>>(
  handlers: T
): T {
  const wrappedHandlers = {} as T;

  for (const [method, handler] of Object.entries(handlers)) {
    if (typeof handler === 'function') {
      // Wrap the handler with global audit logging
      wrappedHandlers[method as keyof T] = withGlobalAudit(handler);
    } else {
      // Keep non-function exports as-is
      wrappedHandlers[method as keyof T] = handler;
    }
  }

  return wrappedHandlers;
}

/**
 * Shorthand for the most common case
 */
export const wrapRoute = autoWrapRouteHandlers;

/**
 * Creates a route with automatic audit logging for all methods
 *
 * @param handlers - Object containing HTTP method handlers
 * @returns Wrapped handlers with automatic audit logging
 */
export function createAuditedRoute<T extends Record<string, any>>(
  handlers: T
): T {
  return autoWrapRouteHandlers(handlers);
}

/**
 * Utility to create a simple route with just the methods you need
 *
 * @param methods - Object with method names as keys and handlers as values
 * @returns Wrapped handlers
 */
export function route<T extends Record<string, any>>(methods: T): T {
  return autoWrapRouteHandlers(methods);
}
