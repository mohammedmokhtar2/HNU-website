import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const userId = searchParams.get('userId');
    const resource = searchParams.get('resource');
    const action = searchParams.get('action') as Action;
    const isActive = searchParams.get('isActive');

    const where: any = {};

    // Text search across title and description
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { resource: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Apply filters
    if (userId) where.userId = userId;
    if (resource) where.resource = resource;
    if (action) where.action = action;
    if (isActive !== null) where.isActive = isActive === 'true';

    const permissions = await db.permission.findMany({
      where,
      include: {
        user: {
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
    });

    return NextResponse.json({ permissions });
  } catch (error) {
    console.error('Error searching permissions:', error);
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
