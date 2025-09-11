import { NextRequest, NextResponse } from 'next/server';
import { handleCORS, addCORSHeaders } from '@/lib/cors';

export async function GET(request: NextRequest) {
  console.log('GET /api/test-cors - Request received');
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

  const response = NextResponse.json({
    message: 'CORS test successful',
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries()),
  });

  console.log('Test response created, adding CORS headers');
  const corsResponseFinal = addCORSHeaders(response);
  console.log(
    'CORS headers added:',
    Object.fromEntries(corsResponseFinal.headers.entries())
  );
  return corsResponseFinal;
}

export async function OPTIONS(request: NextRequest) {
  console.log('OPTIONS /api/test-cors - Preflight request received');
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  // If not a preflight request, return a simple response
  return new NextResponse(null, { status: 200 });
}
