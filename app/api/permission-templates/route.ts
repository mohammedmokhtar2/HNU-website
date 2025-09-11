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
    // Mock permission templates data
    const mockTemplates = [
      {
        id: '1',
        name: 'User Management',
        description: 'Full user management permissions',
        resource: 'USER',
        actions: [Action.VIEW, Action.CREATE, Action.EDIT, Action.DELETE],
        category: 'USER_MANAGEMENT',
        icon: 'Users',
        path: '/admin/users',
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'College Management',
        description: 'College administration permissions',
        resource: 'COLLEGE',
        actions: [Action.VIEW, Action.CREATE, Action.EDIT],
        category: 'ADMINISTRATION',
        icon: 'Shield',
        path: '/admin/colleges',
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Content Management',
        description: 'Website content management permissions',
        resource: 'SECTION',
        actions: [Action.VIEW, Action.EDIT],
        category: 'CONTENT_MANAGEMENT',
        icon: 'Settings',
        path: '/admin/sections',
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      templates: mockTemplates,
    });
  } catch (error) {
    console.error('Error fetching permission templates:', error);
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
