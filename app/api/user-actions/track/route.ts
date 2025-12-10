import { NextRequest, NextResponse } from 'next/server';
import {
  trackUserAction,
  UserActionType,
} from '@/lib/middleware/userActionTracker';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, metadata = {} } = body;

    // Validate action
    if (!action || typeof action !== 'string') {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    // Track the user action
    await trackUserAction(req, action as UserActionType, metadata);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track user action:', error);
    return NextResponse.json(
      { error: 'Failed to track user action' },
      { status: 500 }
    );
  }
}
