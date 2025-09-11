import { NextRequest, NextResponse } from 'next/server';
import { handleCORS, addCORSHeaders } from '@/lib/cors';

export async function GET(request: NextRequest) {
  console.log('GET /api/users/simple - Request received');
  console.log(
    'Request headers:',
    Object.fromEntries(request.headers.entries())
  );

  // Handle CORS preflight
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    console.log('CORS preflight response sent');
    return corsResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
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

export async function OPTIONS(request: NextRequest) {
  console.log('OPTIONS /api/users/simple - Preflight request received');
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  // If not a preflight request, return a simple response
  return new NextResponse(null, { status: 200 });
}
