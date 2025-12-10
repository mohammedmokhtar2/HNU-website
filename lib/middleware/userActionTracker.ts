import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export type UserActionType =
  | 'PAGE_VISIT'
  | 'API_CALL'
  | 'FORM_SUBMIT'
  | 'FILE_UPLOAD'
  | 'FILE_DOWNLOAD'
  | 'SEARCH'
  | 'FILTER'
  | 'SORT'
  | 'NAVIGATION'
  | 'BUTTON_CLICK'
  | 'LINK_CLICK'
  | 'CUSTOM_ACTION';

export interface UserActionMetadata {
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  userAgent?: string;
  ip?: string;
  referer?: string;
  timestamp?: string;
  sessionId?: string;
  pageTitle?: string;
  elementId?: string;
  elementType?: string;
  formData?: any;
  searchQuery?: string;
  filterCriteria?: any;
  sortCriteria?: any;
  fileInfo?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
  };
  [key: string]: any;
}

export interface UserActionLog {
  action: UserActionType;
  userId?: string;
  clerkId?: string;
  isGuest: boolean;
  entity?: string;
  entityId?: string;
  metadata: UserActionMetadata;
}

/**
 * Extracts user information from Clerk auth
 */
async function extractUserInfo(): Promise<{
  userId?: string;
  clerkId?: string;
  isGuest: boolean;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { isGuest: true };
    }

    // Check if this is a guest user (you might want to add guest detection logic)
    // For now, we'll assume all authenticated users are not guests
    // You can modify this based on your guest user detection logic
    const isGuest = false; // Add your guest detection logic here

    return {
      userId: undefined, // Will be resolved from clerkId
      clerkId: userId,
      isGuest,
    };
  } catch (error) {
    console.warn('Failed to extract user info:', error);
    return { isGuest: true };
  }
}

/**
 * Resolves Clerk ID to database user ID
 */
async function resolveUserId(clerkId: string): Promise<string | undefined> {
  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    return user?.id;
  } catch (error) {
    console.warn('Failed to resolve user ID:', error);
    return undefined;
  }
}

/**
 * Creates a session ID for guest users
 */
function createSessionId(req: NextRequest): string {
  // Try to get existing session ID from headers or cookies
  const existingSessionId =
    req.headers.get('x-session-id') || req.cookies.get('session-id')?.value;

  if (existingSessionId) {
    return existingSessionId;
  }

  // Generate new session ID
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extracts metadata from request
 */
function extractRequestMetadata(
  req: NextRequest,
  response?: NextResponse
): UserActionMetadata {
  const url = new URL(req.url);

  return {
    method: req.method,
    url: req.url,
    statusCode: response?.status,
    userAgent: req.headers.get('user-agent') || undefined,
    ip:
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      'unknown',
    referer: req.headers.get('referer') || undefined,
    timestamp: new Date().toISOString(),
    sessionId: req.headers.get('x-session-id') || undefined,
  };
}

/**
 * Logs a user action to the database
 */
export async function logUserAction(actionLog: UserActionLog): Promise<void> {
  try {
    const logData = {
      action: actionLog.action,
      entity: actionLog.entity || 'Unknown',
      entityId: actionLog.entityId,
      metadata: actionLog.metadata,
      clerkId: actionLog.clerkId,
      userId: actionLog.isGuest ? null : actionLog.userId,
      sessionId: actionLog.metadata.sessionId,
      isGuest: actionLog.isGuest,
      ipAddress: actionLog.metadata.ip,
      userAgent: actionLog.metadata.userAgent,
    };

    await db.auditLog.create({
      data: logData,
    });

    console.log(
      `User action logged: ${actionLog.action} by ${actionLog.isGuest ? 'guest' : 'user'} ${actionLog.clerkId || actionLog.userId}`
    );
  } catch (error) {
    console.error('Failed to log user action:', error);
    // Don't throw error to avoid breaking the main functionality
  }
}

/**
 * Main middleware function for tracking user actions
 */
export async function trackUserAction(
  req: NextRequest,
  action: UserActionType,
  additionalMetadata: Partial<UserActionMetadata> = {},
  response?: NextResponse
): Promise<void> {
  try {
    // Extract user information
    const userInfo = await extractUserInfo();

    // For guest users, create or get session ID
    let sessionId: string | undefined;
    if (userInfo.isGuest) {
      sessionId = createSessionId(req);
    }

    // Resolve user ID if we have a Clerk ID
    let userId: string | undefined;
    if (userInfo.clerkId && !userInfo.isGuest) {
      userId = await resolveUserId(userInfo.clerkId);
    }

    // Extract request metadata
    const requestMetadata = extractRequestMetadata(req, response);

    // Combine all metadata
    const metadata: UserActionMetadata = {
      ...requestMetadata,
      ...additionalMetadata,
      ...(sessionId && { sessionId }),
    };

    // Create action log
    const actionLog: UserActionLog = {
      action,
      userId,
      clerkId: userInfo.clerkId,
      isGuest: userInfo.isGuest,
      metadata,
    };

    // Log the action
    await logUserAction(actionLog);
  } catch (error) {
    console.error('Failed to track user action:', error);
    // Don't throw error to avoid breaking the main functionality
  }
}

/**
 * Higher-order function to wrap API handlers with user action tracking
 */
export function withUserActionTracking<
  T extends (...args: any[]) => Promise<NextResponse>,
>(
  handler: T,
  action: UserActionType = 'API_CALL',
  extractAdditionalMetadata?: (
    req: NextRequest,
    res: NextResponse
  ) => Partial<UserActionMetadata>
): T {
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
      // Track the action
      try {
        const duration = Date.now() - startTime;
        const additionalMetadata = extractAdditionalMetadata
          ? extractAdditionalMetadata(req, response!)
          : {};

        await trackUserAction(
          req,
          action,
          {
            ...additionalMetadata,
            duration,
          },
          response!
        );
      } catch (trackingError) {
        console.error('Failed to track user action:', trackingError);
      }
    }

    return response!;
  }) as T;
}

/**
 * Utility function to track page visits
 */
export async function trackPageVisit(
  req: NextRequest,
  pageTitle?: string,
  additionalMetadata: Partial<UserActionMetadata> = {}
): Promise<void> {
  await trackUserAction(req, 'PAGE_VISIT', {
    pageTitle,
    ...additionalMetadata,
  });
}

/**
 * Utility function to track API calls
 */
export async function trackApiCall(
  req: NextRequest,
  response: NextResponse,
  additionalMetadata: Partial<UserActionMetadata> = {}
): Promise<void> {
  await trackUserAction(req, 'API_CALL', additionalMetadata, response);
}

/**
 * Utility function to track form submissions
 */
export async function trackFormSubmit(
  req: NextRequest,
  formData: any,
  additionalMetadata: Partial<UserActionMetadata> = {}
): Promise<void> {
  await trackUserAction(req, 'FORM_SUBMIT', {
    formData,
    ...additionalMetadata,
  });
}

/**
 * Utility function to track file operations
 */
export async function trackFileOperation(
  req: NextRequest,
  fileInfo: UserActionMetadata['fileInfo'],
  action: 'FILE_UPLOAD' | 'FILE_DOWNLOAD' = 'FILE_UPLOAD',
  additionalMetadata: Partial<UserActionMetadata> = {}
): Promise<void> {
  await trackUserAction(req, action, {
    fileInfo,
    ...additionalMetadata,
  });
}
