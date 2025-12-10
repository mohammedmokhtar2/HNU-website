// lib/auth-headers.ts
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function getUserIdHeader(): Promise<string | null> {
  const { userId } = await auth(); // get user ID from auth context
  return userId ?? null;
}

/**
 * Gets the authenticated user ID from the request headers
 * This is set by the middleware for authenticated requests
 * @param req - The NextRequest object
 * @returns User ID or null if not found
 */
export function getUserIdFromHeaders(req: NextRequest): string | null {
  return req.headers.get('x-user-id');
}

/**
 * Checks if the request has an authenticated user
 * @param req - The NextRequest object
 * @returns true if user is authenticated, false otherwise
 */
export function isAuthenticated(req: NextRequest): boolean {
  return req.headers.get('x-user-id') !== null;
}
