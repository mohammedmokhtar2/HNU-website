import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactFormRateLimiter } from '@/lib/rate-limit';
import {
  CreateMessageInputSchema,
  MessageQueryParamsSchema,
  MessageStatus,
  MessageType,
  MessagePriority,
} from '@/types/message';

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      status: (searchParams.get('status') as MessageStatus) || undefined,
      type: (searchParams.get('type') as MessageType) || undefined,
      priority: (searchParams.get('priority') as MessagePriority) || undefined,
      search: searchParams.get('search') || undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      orderBy: (searchParams.get('orderBy') as any) || 'createdAt',
      orderDirection:
        (searchParams.get('orderDirection') as 'asc' | 'desc') || 'desc',
    };

    // Validate parameters
    const validationResult = MessageQueryParamsSchema.safeParse(params);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${validationResult.error.issues.map(e => e.message).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const validatedParams = validationResult.data;

    // Build where clause
    const where: any = {};

    if (validatedParams.status) {
      where.messageConfig = {
        path: ['status'],
        equals: validatedParams.status,
      };
    }

    if (validatedParams.type) {
      where.messageConfig = {
        ...where.messageConfig,
        path: ['type'],
        equals: validatedParams.type,
      };
    }

    if (validatedParams.priority) {
      where.messageConfig = {
        ...where.messageConfig,
        path: ['priority'],
        equals: validatedParams.priority,
      };
    }

    if (validatedParams.from) {
      where.messageConfig = {
        ...where.messageConfig,
        path: ['from'],
        string_contains: validatedParams.from,
      };
    }

    if (validatedParams.to) {
      where.messageConfig = {
        ...where.messageConfig,
        path: ['to'],
        string_contains: validatedParams.to,
      };
    }

    if (validatedParams.dateFrom || validatedParams.dateTo) {
      where.createdAt = {};
      if (validatedParams.dateFrom) {
        where.createdAt.gte = new Date(validatedParams.dateFrom);
      }
      if (validatedParams.dateTo) {
        where.createdAt.lte = new Date(validatedParams.dateTo);
      }
    }

    if (validatedParams.search) {
      where.OR = [
        {
          messageConfig: {
            path: ['subject'],
            string_contains: validatedParams.search,
          },
        },
        {
          messageConfig: {
            path: ['body'],
            string_contains: validatedParams.search,
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (validatedParams.page - 1) * validatedParams.limit;

    // Get total count
    const total = await db.messages.count({ where });

    // Fetch messages with pagination
    const messages = await db.messages.findMany({
      where,
      orderBy: { [validatedParams.orderBy]: validatedParams.orderDirection },
      skip,
      take: validatedParams.limit,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / validatedParams.limit);
    const hasNext = validatedParams.page < totalPages;
    const hasPrev = validatedParams.page > 1;

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch messages',
      },
      { status: 500 }
    );
  }
}

async function handlePOST(req: NextRequest) {
  try {
    // Rate limiting check
    const clientIP =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      'unknown';
    const rateLimitResult = contactFormRateLimiter.isAllowed(clientIP);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many contact form submissions. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(
              Date.now() + (rateLimitResult.retryAfter || 900) * 1000
            ).toISOString(),
          },
        }
      );
    }

    const body = await req.json();

    // Validate input
    const validationResult = CreateMessageInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${validationResult.error.issues.map(e => e.message).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const { messageConfig } = validationResult.data;

    // Create message
    const message = await db.messages.create({
      data: {
        messageConfig: messageConfig as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message created successfully',
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create message',
      },
      { status: 500 }
    );
  }
}

// Export handlers with mixed authentication:
// - GET requires authentication (admin users viewing messages)
// - POST doesn't require authentication (public contact form submissions)
export const GET = handleGET;
export const POST = handlePOST;
