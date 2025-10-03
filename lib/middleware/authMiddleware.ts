import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Authentication middleware for API routes
 * Checks if user is authenticated and returns appropriate responses
 */

export interface AuthResult {
  userId: string | null;
  isAuthenticated: boolean;
  error?: string;
}

/**
 * Checks if the current request is from an authenticated user
 * @param req - The NextRequest object
 * @returns AuthResult with authentication status
 */
export async function checkAuthentication(
  req: NextRequest
): Promise<AuthResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        userId: null,
        isAuthenticated: false,
        error: 'Authentication required',
      };
    }

    return {
      userId,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Authentication check failed:', error);
    return {
      userId: null,
      isAuthenticated: false,
      error: 'Authentication verification failed',
    };
  }
}

/**
 * Higher-order function that wraps API route handlers with authentication
 * @param handler - The API route handler function
 * @param options - Optional configuration
 * @returns Wrapped handler that requires authentication
 */
export function withAuth<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>,
  options: {
    allowUnauthenticated?: boolean;
    customAuthCheck?: (req: NextRequest) => Promise<AuthResult>;
  } = {}
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    // Skip authentication if explicitly allowed
    if (options.allowUnauthenticated) {
      return handler(req, ...args);
    }

    // Use custom auth check if provided, otherwise use default
    const authResult = options.customAuthCheck
      ? await options.customAuthCheck(req)
      : await checkAuthentication(req);

    // If not authenticated, return 401 Unauthorized
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: authResult.error || 'Authentication required',
          statusCode: 401,
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer',
          },
        }
      );
    }

    // Add userId to request headers for downstream handlers
    req.headers.set('x-user-id', authResult.userId!);

    // Call the original handler
    return handler(req, ...args);
  };
}

/**
 * Creates an authenticated API route handler
 * @param handlers - Object containing HTTP method handlers
 * @param options - Authentication options
 * @returns Wrapped handlers that require authentication
 */
export function createAuthenticatedRoute<T extends Record<string, any>>(
  handlers: T,
  options: {
    allowUnauthenticated?: boolean;
    customAuthCheck?: (req: NextRequest) => Promise<AuthResult>;
  } = {}
): T {
  const wrappedHandlers = {} as T;

  for (const [method, handler] of Object.entries(handlers)) {
    if (typeof handler === 'function') {
      // Wrap the handler with authentication
      (wrappedHandlers as any)[method] = withAuth(handler, options);
    } else {
      // Keep non-function exports as-is
      (wrappedHandlers as any)[method] = handler;
    }
  }

  return wrappedHandlers;
}

/**
 * Utility function to get authenticated user ID from request
 * @param req - The NextRequest object
 * @returns User ID or null if not authenticated
 */
export async function getAuthenticatedUserId(
  req: NextRequest
): Promise<string | null> {
  const authResult = await checkAuthentication(req);
  return authResult.isAuthenticated ? authResult.userId : null;
}

/**
 * Middleware function that can be used in API routes to check authentication
 * @param req - The NextRequest object
 * @returns NextResponse with error if not authenticated, null if authenticated
 */
export async function requireAuth(
  req: NextRequest
): Promise<NextResponse | null> {
  const authResult = await checkAuthentication(req);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: authResult.error || 'Authentication required',
        statusCode: 401,
      },
      {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Bearer',
        },
      }
    );
  }

  return null;
}
