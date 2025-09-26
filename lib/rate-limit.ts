import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Maximum 5 requests per window
  message: 'Too many contact form submissions, please try again later.',
};

// Store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown';
  const now = Date.now();
  const windowMs = RATE_LIMIT_CONFIG.windowMs;

  // Clean up expired entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }

  const current = rateLimitStore.get(ip);

  if (!current) {
    // First request from this IP
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return null; // No rate limit exceeded
  }

  if (now > current.resetTime) {
    // Window has expired, reset
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return null; // No rate limit exceeded
  }

  if (current.count >= RATE_LIMIT_CONFIG.maxRequests) {
    // Rate limit exceeded
    return NextResponse.json(
      {
        success: false,
        error: RATE_LIMIT_CONFIG.message,
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      },
      { status: 429 }
    );
  }

  // Increment count
  current.count++;
  rateLimitStore.set(ip, current);

  return null; // No rate limit exceeded
}

// Alternative implementation using a more sophisticated approach
export class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();

  constructor(
    private windowMs: number = 15 * 60 * 1000, // 15 minutes
    private maxRequests: number = 5
  ) {}

  isAllowed(identifier: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();

    // Clean up expired entries
    this.cleanup();

    const current = this.store.get(identifier);

    if (!current) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return { allowed: true };
    }

    if (now > current.resetTime) {
      // Window has expired, reset
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return { allowed: true };
    }

    if (current.count >= this.maxRequests) {
      return {
        allowed: false,
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      };
    }

    // Increment count
    current.count++;
    this.store.set(identifier, current);

    return { allowed: true };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (now > value.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // Get remaining requests for an identifier
  getRemainingRequests(identifier: string): number {
    const current = this.store.get(identifier);
    if (!current) return this.maxRequests;

    const now = Date.now();
    if (now > current.resetTime) return this.maxRequests;

    return Math.max(0, this.maxRequests - current.count);
  }

  // Get reset time for an identifier
  getResetTime(identifier: string): number | null {
    const current = this.store.get(identifier);
    if (!current) return null;

    const now = Date.now();
    if (now > current.resetTime) return null;

    return current.resetTime;
  }
}

// Create a global rate limiter instance
export const contactFormRateLimiter = new RateLimiter(
  15 * 60 * 1000, // 15 minutes
  5 // 5 requests per window
);
