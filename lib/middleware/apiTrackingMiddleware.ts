import { NextRequest, NextResponse } from 'next/server';
import {
  trackUserAction,
  UserActionType,
  UserActionMetadata,
} from './userActionTracker';

/**
 * Configuration for API route tracking
 */
export interface ApiTrackingConfig {
  // Whether to track this route
  enabled?: boolean;
  // Custom action name
  action?: UserActionType;
  // Custom entity name
  entity?: string;
  // Extract additional metadata from request/response
  extractMetadata?: (
    req: NextRequest,
    res: NextResponse
  ) => Partial<UserActionMetadata>;
  // Skip tracking for certain conditions
  skipTracking?: (req: NextRequest, res: NextResponse) => boolean;
  // Methods to track (default: all except GET)
  trackMethods?: string[];
  // Methods to skip
  skipMethods?: string[];
}

/**
 * Default configuration for API tracking
 */
const DEFAULT_CONFIG: Required<ApiTrackingConfig> = {
  enabled: true,
  action: 'API_CALL',
  entity: 'Unknown',
  extractMetadata: () => ({}),
  skipTracking: () => false,
  trackMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  skipMethods: ['OPTIONS'],
};

/**
 * Higher-order function to wrap API handlers with automatic user action tracking
 */
export function withApiTracking<
  T extends (...args: any[]) => Promise<NextResponse>,
>(handler: T, config: ApiTrackingConfig = {}): T {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return (async (...args: any[]) => {
    const req = args[0] as NextRequest;
    const startTime = Date.now();
    let response: NextResponse;

    try {
      // Execute the handler
      response = await handler(...args);
    } catch (error) {
      // Create error response for tracking
      response = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
      throw error;
    } finally {
      // Track the action if enabled and conditions are met
      if (await shouldTrackRequest(req, response!, finalConfig)) {
        try {
          const duration = Date.now() - startTime;
          const additionalMetadata = finalConfig.extractMetadata(
            req,
            response!
          );

          await trackUserAction(
            req,
            finalConfig.action,
            {
              ...additionalMetadata,
              duration,
              entity: finalConfig.entity,
            },
            response!
          );
        } catch (trackingError) {
          console.error('Failed to track API call:', trackingError);
        }
      }
    }

    return response!;
  }) as T;
}

/**
 * Determines if a request should be tracked
 */
async function shouldTrackRequest(
  req: NextRequest,
  res: NextResponse,
  config: Required<ApiTrackingConfig>
): Promise<boolean> {
  // Skip GET requests and log them
  if (req.method === 'GET') {
    console.log(`🚀 GET request passed: ${req.url}`);
    return false;
  }

  // Check if tracking is enabled
  if (!config.enabled) {
    return false;
  }

  // Check if method should be tracked
  if (config.skipMethods.includes(req.method)) {
    return false;
  }

  // Check if method is in track methods
  if (
    config.trackMethods.length > 0 &&
    !config.trackMethods.includes(req.method)
  ) {
    return false;
  }

  // Check custom skip condition
  if (config.skipTracking(req, res)) {
    return false;
  }

  // Track all responses, including error responses
  // This allows us to track failed API calls for debugging and monitoring
  return true;
}

/**
 * Wrapper for multiple HTTP methods in a route file
 */
export function withApiTrackingMethods(
  handlers: Record<string, (...args: any[]) => Promise<NextResponse>>,
  config: ApiTrackingConfig = {}
): Record<string, (...args: any[]) => Promise<NextResponse>> {
  const wrappedHandlers: Record<
    string,
    (...args: any[]) => Promise<NextResponse>
  > = {};

  for (const [method, handler] of Object.entries(handlers)) {
    if (typeof handler === 'function') {
      wrappedHandlers[method] = withApiTracking(handler, config);
    }
  }

  return wrappedHandlers;
}

/**
 * Specific tracking configurations for common API patterns
 */
export const ApiTrackingPresets = {
  // Track CRUD operations
  crud: (entity: string): ApiTrackingConfig => ({
    entity,
    extractMetadata: (req, res) => ({
      operation: req.method.toLowerCase(),
      resource: entity.toLowerCase(),
    }),
  }),

  // Track file operations
  fileOperation: (
    operation: 'upload' | 'download' | 'delete'
  ): ApiTrackingConfig => ({
    action:
      operation === 'upload'
        ? 'FILE_UPLOAD'
        : operation === 'download'
          ? 'FILE_DOWNLOAD'
          : 'API_CALL',
    entity: 'File',
    extractMetadata: (req, res) => ({
      operation,
      contentType: req.headers.get('content-type'),
    }),
  }),

  // Track form submissions
  formSubmission: (formName: string): ApiTrackingConfig => ({
    action: 'FORM_SUBMIT',
    entity: formName,
    extractMetadata: (req, res) => ({
      formName,
      contentType: req.headers.get('content-type'),
    }),
  }),

  // Track search operations
  search: (searchEntity: string): ApiTrackingConfig => ({
    action: 'SEARCH',
    entity: searchEntity,
    extractMetadata: (req, res) => ({
      searchEntity,
      query: new URL(req.url).searchParams.get('q'),
    }),
  }),

  // Track authentication operations
  auth: (authAction: 'login' | 'logout' | 'register'): ApiTrackingConfig => ({
    action: 'API_CALL', // Use generic API_CALL since LOGIN/LOGOUT/REGISTER may not be in UserActionType
    entity: 'User',
    extractMetadata: (req, res) => ({
      authAction,
      userAgent: req.headers.get('user-agent') || undefined,
    }),
  }),
};

/**
 * Utility function to create custom tracking configuration
 */
export function createTrackingConfig(
  action: UserActionType,
  entity: string,
  extractMetadata?: (
    req: NextRequest,
    res: NextResponse
  ) => Partial<UserActionMetadata>
): ApiTrackingConfig {
  return {
    action,
    entity,
    extractMetadata,
  };
}

/**
 * Middleware to automatically track all API routes (use with caution)
 */
export function withGlobalApiTracking<
  T extends (...args: any[]) => Promise<NextResponse>,
>(handler: T, globalConfig: ApiTrackingConfig = {}): T {
  return withApiTracking(handler, {
    ...globalConfig,
    // Default to tracking all methods except OPTIONS
    trackMethods: globalConfig.trackMethods || [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ],
  });
}
