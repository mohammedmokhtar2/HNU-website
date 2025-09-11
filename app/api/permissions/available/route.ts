import { NextResponse } from 'next/server';
import { Action } from '@/types/enums';

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
    },
  });
}

export async function GET() {
  try {
    // Mock available resources and actions
    const availableResources = {
      resources: [
        'USER',
        'COLLEGE',
        'SECTION',
        'STATISTIC',
        'PERMISSION',
        'TEMPLATE',
        'DASHBOARD',
        'SETTINGS',
      ],
      actions: Object.values(Action),
      categories: [
        'ADMINISTRATION',
        'CONTENT_MANAGEMENT',
        'USER_MANAGEMENT',
        'ANALYTICS',
        'SYSTEM',
      ],
    };

    return NextResponse.json(availableResources);
  } catch (error) {
    console.error('Error fetching available resources:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
