import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UpdateMessageInputSchema } from '@/types/message';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const message = await db.messages.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch message',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = UpdateMessageInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${validationResult.error.issues.map(e => e.message).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const { messageConfig } = validationResult.data;

    // Check if message exists
    const existingMessage = await db.messages.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message not found',
        },
        { status: 404 }
      );
    }

    // Update message
    const updatedMessage = await db.messages.update({
      where: { id },
      data: {
        messageConfig: messageConfig
          ? ({
              ...(existingMessage.messageConfig as Record<string, any>),
              ...messageConfig,
            } as any)
          : existingMessage.messageConfig,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedMessage,
      message: 'Message updated successfully',
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update message',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if message exists
    const existingMessage = await db.messages.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message not found',
        },
        { status: 404 }
      );
    }

    // Delete message
    await db.messages.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete message',
      },
      { status: 500 }
    );
  }
}
