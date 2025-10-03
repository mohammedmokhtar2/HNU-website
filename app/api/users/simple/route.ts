import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedRoute } from '@/lib/middleware/authMiddleware';
import { getUserIdFromHeaders } from '@/lib/auth-headers';
import { handleCORS, addCORSHeaders } from '@/lib/cors';

async function handleGET(req: NextRequest) {
  console.log('GET /api/users/simple - Request received');
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  // Get the authenticated user ID
  const userId = getUserIdFromHeaders(req);
  console.log('Authenticated user ID:', userId);

  // Handle CORS preflight
  const corsResponse = handleCORS(req);
  if (corsResponse) {
    console.log('CORS preflight response sent');
    return corsResponse;
  }

  try {
    const { searchParams } = new URL(req.url);
    const includeCollege = searchParams.get('includeCollege') === 'true';

    // Return mock data instead of database query
    const mockUsers = [
      {
        id: '1',
        name: 'Test User 1',
        email: 'test1@example.com',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(includeCollege && { College: [] }),
      },
      {
        id: '2',
        name: 'Test User 2',
        email: 'test2@example.com',
        role: 'GUEST',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(includeCollege && { College: [] }),
      },
    ];

    const response = NextResponse.json({
      users: mockUsers,
      pagination: {
        page: 1,
        limit: 100,
        total: 2,
        totalPages: 1,
      },
      authenticatedUserId: userId, // Include the authenticated user ID
    });

    console.log('Mock users created, adding CORS headers');
    const corsResponseFinal = addCORSHeaders(response);
    console.log(
      'CORS headers added:',
      Object.fromEntries(corsResponseFinal.headers.entries())
    );
    return corsResponseFinal;
  } catch (error) {
    console.error('Error in simple users API:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
    return addCORSHeaders(response);
  }
}

async function handleOPTIONS(req: NextRequest) {
  console.log('OPTIONS /api/users/simple - Preflight request received');
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  // If not a preflight request, return a simple response
  return new NextResponse(null, { status: 200 });
}

// Apply authentication middleware to all methods
export const { GET, OPTIONS } = createAuthenticatedRoute(
  {
    GET: handleGET,
    OPTIONS: handleOPTIONS,
  },
  {
    // OPTIONS requests don't need authentication for CORS preflight
    allowUnauthenticated: false, // Keep this false to require auth for GET
  }
);
