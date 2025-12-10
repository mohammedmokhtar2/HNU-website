import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';

// Example API route with user action tracking
async function handleGet(req: NextRequest) {
  // Simulate some processing
  await new Promise(resolve => setTimeout(resolve, 100));

  return NextResponse.json({
    message: 'Hello from tracked API!',
    timestamp: new Date().toISOString(),
    userAgent: req.headers.get('user-agent'),
    sessionId: req.headers.get('x-session-id'),
    clerkId: req.headers.get('x-clerk-id'),
  });
}

async function handlePost(req: NextRequest) {
  const body = await req.json();

  // Simulate some processing
  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: 'Data processed successfully',
    receivedData: body,
    timestamp: new Date().toISOString(),
  });
}

async function handlePut(req: NextRequest) {
  const body = await req.json();

  // Simulate some processing
  await new Promise(resolve => setTimeout(resolve, 150));

  return NextResponse.json({
    message: 'Data updated successfully',
    updatedData: body,
    timestamp: new Date().toISOString(),
  });
}

async function handleDelete(req: NextRequest) {
  // Simulate some processing
  await new Promise(resolve => setTimeout(resolve, 100));

  return NextResponse.json({
    message: 'Data deleted successfully',
    timestamp: new Date().toISOString(),
  });
}

// Apply tracking to all methods using CRUD preset
export const { GET, POST, PUT, DELETE } = withApiTrackingMethods(
  {
    GET: handleGet,
    POST: handlePost,
    PUT: handlePut,
    DELETE: handleDelete,
  },
  ApiTrackingPresets.crud('Example')
);
