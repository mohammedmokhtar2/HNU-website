import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the latest config
    const config = await prisma.config.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      // Create initial config if none exists
      const initialConfig = await prisma.config.create({
        data: {
          config: {
            globalConfig: {
              counter: 0,
            },
          },
        },
      });

      return NextResponse.json(initialConfig.config);
    }

    return NextResponse.json(config.config);
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === 'increment_visitor') {
      // Get the latest config
      let config = await prisma.config.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (!config) {
        // Create initial config if none exists
        config = await prisma.config.create({
          data: {
            config: {
              globalConfig: {
                counter: 1,
              },
            },
          },
        });
      } else {
        // Update existing config
        const currentConfig = config.config as any;
        const updatedConfig = {
          ...currentConfig,
          globalConfig: {
            ...currentConfig.globalConfig,
            counter: (currentConfig.globalConfig?.counter || 0) + 1,
          },
        };

        config = await prisma.config.update({
          where: { id: config.id },
          data: { config: updatedConfig },
        });
      }

      return NextResponse.json({
        success: true,
        counter: (config.config as any)?.globalConfig?.counter || 0,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
