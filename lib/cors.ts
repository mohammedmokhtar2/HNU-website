import { NextRequest, NextResponse } from 'next/server';

// CORS configuration
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // In production, replace with specific domains
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With, X-Clerk-Auth, x-user-id, X-User-Id',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// CORS options for preflight requests
export function handleCORS(request: NextRequest): NextResponse | null {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: CORS_HEADERS,
    });
  }
  return null;
}

// Add CORS headers to response
export function addCORSHeaders(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// CORS middleware wrapper
export function withCORS(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    // Handle preflight requests
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    // Execute the handler
    const response = await handler(request);

    // Add CORS headers to the response
    return addCORSHeaders(response);
  };
}

// Environment-specific CORS configuration - Allow all origins
export function getCORSHeaders(origin?: string) {
  console.log('CORS - Origin received:', origin);
  console.log('CORS - Allowing all origins (*)');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With, X-Clerk-Auth, x-user-id, X-User-Id',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };

  console.log('CORS - Final headers:', headers);
  return headers;
}
