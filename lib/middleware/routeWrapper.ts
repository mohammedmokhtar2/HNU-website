import { NextRequest, NextResponse } from 'next/server';
import { withAutoAuditLog, AutoAuditOptions } from './autoAuditLog';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

type RouteHandlers = {
  [K in HttpMethod]?: (
    req: NextRequest,
    ...args: any[]
  ) => Promise<NextResponse>;
};

type RouteConfig = {
  // Global options for all methods in this route
  audit?: AutoAuditOptions;
  // Method-specific options
  methods?: {
    [K in HttpMethod]?: AutoAuditOptions;
  };
  // Skip certain methods entirely
  skipMethods?: HttpMethod[];
};

/**
 * Creates a route wrapper that automatically applies audit logging to all HTTP methods
 *
 * @param handlers - Object containing HTTP method handlers
 * @param config - Configuration for audit logging
 * @returns Wrapped handlers with automatic audit logging
 */
export function createAuditedRoute(
  handlers: RouteHandlers,
  config: RouteConfig = {}
) {
  const {
    audit: globalOptions = {},
    methods: methodOptions = {},
    skipMethods = [],
  } = config;

  const wrappedHandlers: RouteHandlers = {};

  for (const [method, handler] of Object.entries(handlers) as [
    HttpMethod,
    any,
  ][]) {
    if (!handler || skipMethods.includes(method)) {
      // Keep original handler or skip
      wrappedHandlers[method] = handler;
      continue;
    }

    // Merge global and method-specific options
    const options = {
      ...globalOptions,
      ...methodOptions[method],
    };

    // Wrap the handler with audit logging
    wrappedHandlers[method] = withAutoAuditLog(handler, options);
  }

  return wrappedHandlers;
}

/**
 * Utility to create a route with minimal configuration
 *
 * @param handlers - HTTP method handlers
 * @param entity - Entity name for audit logs
 * @param skipMethods - Methods to skip logging for
 * @returns Wrapped handlers
 */
export function createSimpleAuditedRoute(
  handlers: RouteHandlers,
  entity?: string,
  skipMethods: HttpMethod[] = ['GET', 'OPTIONS']
) {
  return createAuditedRoute(handlers, {
    audit: { entity },
    skipMethods,
  });
}

/**
 * Higher-order function that can be used as a decorator for route files
 *
 * Usage in route.ts:
 * export const { GET, POST, PUT, DELETE } = withAuditRoute({
 *   GET: async (req) => { ... },
 *   POST: async (req) => { ... },
 *   // ...
 * });
 */
export function withAuditRoute(handlers: RouteHandlers, config?: RouteConfig) {
  return createAuditedRoute(handlers, config);
}

/**
 * Creates a route wrapper that logs all API calls with minimal configuration
 *
 * @param handlers - HTTP method handlers
 * @param options - Audit options
 * @returns Wrapped handlers
 */
export function withBasicAudit(
  handlers: RouteHandlers,
  options: AutoAuditOptions = {}
) {
  return createAuditedRoute(handlers, {
    audit: options,
    skipMethods: ['GET', 'OPTIONS'], // Skip read operations by default
  });
}
