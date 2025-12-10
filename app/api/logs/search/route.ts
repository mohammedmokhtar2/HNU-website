import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { db } from '@/lib/db';
import { handleCORS, addCORSHeaders } from '@/lib/cors';

// GET /api/logs/search - Search logs with advanced filtering
async function handleGET(req: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build where clause with search
    const where: any = {};

    // Text search across action, entity, and user name/email
    if (query) {
      where.OR = [
        { action: { contains: query, mode: 'insensitive' } },
        { entity: { contains: query, mode: 'insensitive' } },
        {
          clerkUser: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    // Apply filters
    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (entity) where.entity = { contains: entity, mode: 'insensitive' };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Get total count for pagination
    const totalCount = await db.auditLog.count({ where });

    // Get logs with user information
    const logs = await db.auditLog.findMany({
      where,
      include: {
        clerkUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const response = NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      searchQuery: query,
    });

    return addCORSHeaders(response);
  } catch (error) {
    console.error('Error searching logs:', error);
    const response = NextResponse.json(
      { error: 'Failed to search logs' },
      { status: 500 }
    );
    return addCORSHeaders(response);
  }
}

// Handle OPTIONS requests for CORS preflight
async function handleOPTIONS(req: NextRequest) {
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  // If not a preflight request, return a simple response
  return new NextResponse(null, { status: 200 });
}

// Apply tracking to all methods using crud preset
export const { GET, OPTIONS } = withApiTrackingMethods(
  { GET: handleGET, OPTIONS: handleOPTIONS },
  ApiTrackingPresets.crud('Log')
);
