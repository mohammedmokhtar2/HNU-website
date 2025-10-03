import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { PrismaClient } from '@prisma/client';
import { VisitorData } from '@/types/configa';

const prisma = new PrismaClient();

// Helper function to get current date string
function getCurrentDateString(): string {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

// Helper function to get current month string
function getCurrentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
}

// Helper function to get current hour string
function getCurrentHourString(): string {
  return String(new Date().getHours()).padStart(2, '0'); // HH
}

// Helper function to initialize default config
function getDefaultConfig() {
  const currentDate = getCurrentDateString();
  const currentMonth = getCurrentMonthString();

  return {
    counter: 0,
    lastVisit: new Date().toISOString(),
    newVisitors: 0,
    returningVisitors: 0,
    dailyStats: {
      [currentDate]: {
        visitors: 0,
        pageViews: 0,
        sessions: 0,
        newVisitors: 0,
        returningVisitors: 0,
      },
    },
    monthlyStats: {
      [currentMonth]: {
        visitors: 0,
        pageViews: 0,
        sessions: 0,
        newVisitors: 0,
        returningVisitors: 0,
      },
    },
    hourlyStats: {},
    deviceStats: {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    },
    browserStats: {},
    countryStats: {},
  };
}

async function handleGET() {
  try {
    // Get the latest config
    const config = await prisma.config.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      // Create initial config if none exists
      const defaultConfig = getDefaultConfig();
      const initialConfig = await prisma.config.create({
        data: {
          config: {
            globalConfig: defaultConfig,
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

async function handlePOST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'track_visitor') {
      const visitorData: VisitorData = body.data;

      // Get the latest config
      let config = await prisma.config.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (!config) {
        // Create initial config if none exists
        const defaultConfig = getDefaultConfig();
        config = await prisma.config.create({
          data: {
            config: {
              globalConfig: defaultConfig,
            },
          },
        });
      }

      // Update config with visitor data
      const currentConfig = config.config as any;
      const currentDate = getCurrentDateString();
      const currentMonth = getCurrentMonthString();
      const currentHour = getCurrentHourString();

      // Initialize stats if they don't exist
      if (!currentConfig.globalConfig.dailyStats) {
        currentConfig.globalConfig.dailyStats = {};
      }
      if (!currentConfig.globalConfig.monthlyStats) {
        currentConfig.globalConfig.monthlyStats = {};
      }
      if (!currentConfig.globalConfig.hourlyStats) {
        currentConfig.globalConfig.hourlyStats = {};
      }
      if (!currentConfig.globalConfig.deviceStats) {
        currentConfig.globalConfig.deviceStats = {
          desktop: 0,
          mobile: 0,
          tablet: 0,
        };
      }
      if (!currentConfig.globalConfig.browserStats) {
        currentConfig.globalConfig.browserStats = {};
      }
      if (!currentConfig.globalConfig.countryStats) {
        currentConfig.globalConfig.countryStats = {};
      }

      // Initialize daily stats for current date
      if (!currentConfig.globalConfig.dailyStats[currentDate]) {
        currentConfig.globalConfig.dailyStats[currentDate] = {
          visitors: 0,
          pageViews: 0,
          sessions: 0,
          newVisitors: 0,
          returningVisitors: 0,
        };
      }

      // Initialize monthly stats for current month
      if (!currentConfig.globalConfig.monthlyStats[currentMonth]) {
        currentConfig.globalConfig.monthlyStats[currentMonth] = {
          visitors: 0,
          pageViews: 0,
          sessions: 0,
          newVisitors: 0,
          returningVisitors: 0,
        };
      }

      // Update counters
      currentConfig.globalConfig.counter += 1;
      currentConfig.globalConfig.lastVisit = visitorData.timestamp;

      // Update visitor type counters
      if (visitorData.isNewVisitor) {
        currentConfig.globalConfig.newVisitors += 1;
        currentConfig.globalConfig.dailyStats[currentDate].newVisitors += 1;
        currentConfig.globalConfig.monthlyStats[currentMonth].newVisitors += 1;
      } else {
        currentConfig.globalConfig.returningVisitors += 1;
        currentConfig.globalConfig.dailyStats[currentDate].returningVisitors +=
          1;
        currentConfig.globalConfig.monthlyStats[
          currentMonth
        ].returningVisitors += 1;
      }

      // Update daily stats
      currentConfig.globalConfig.dailyStats[currentDate].visitors += 1;
      currentConfig.globalConfig.dailyStats[currentDate].sessions += 1;
      currentConfig.globalConfig.dailyStats[currentDate].pageViews +=
        visitorData.pageViews;

      // Update monthly stats
      currentConfig.globalConfig.monthlyStats[currentMonth].visitors += 1;
      currentConfig.globalConfig.monthlyStats[currentMonth].sessions += 1;
      currentConfig.globalConfig.monthlyStats[currentMonth].pageViews +=
        visitorData.pageViews;

      // Update hourly stats
      currentConfig.globalConfig.hourlyStats[currentHour] =
        (currentConfig.globalConfig.hourlyStats[currentHour] || 0) + 1;

      // Update device stats
      currentConfig.globalConfig.deviceStats[visitorData.device] += 1;

      // Update browser stats
      currentConfig.globalConfig.browserStats[visitorData.browser] =
        (currentConfig.globalConfig.browserStats[visitorData.browser] || 0) + 1;

      // Update country stats
      currentConfig.globalConfig.countryStats[visitorData.country] =
        (currentConfig.globalConfig.countryStats[visitorData.country] || 0) + 1;

      // Save updated config
      config = await prisma.config.update({
        where: { id: config.id },
        data: { config: currentConfig },
      });

      return NextResponse.json({
        success: true,
        counter: currentConfig.globalConfig.counter,
        stats: currentConfig.globalConfig,
      });
    }

    if (body.action === 'track_page_view') {
      const sessionId = body.sessionId;

      // Get the latest config
      const config = await prisma.config.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (config) {
        const currentConfig = config.config as any;
        const currentDate = getCurrentDateString();
        const currentMonth = getCurrentMonthString();

        // Update page view counters
        if (currentConfig.globalConfig.dailyStats[currentDate]) {
          currentConfig.globalConfig.dailyStats[currentDate].pageViews += 1;
        }
        if (currentConfig.globalConfig.monthlyStats[currentMonth]) {
          currentConfig.globalConfig.monthlyStats[currentMonth].pageViews += 1;
        }

        // Save updated config
        await prisma.config.update({
          where: { id: config.id },
          data: { config: currentConfig },
        });
      }

      return NextResponse.json({ success: true });
    }

    // Legacy support for increment_visitor
    if (body.action === 'increment_visitor') {
      // Get the latest config
      let config = await prisma.config.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (!config) {
        const defaultConfig = getDefaultConfig();
        config = await prisma.config.create({
          data: {
            config: {
              globalConfig: defaultConfig,
            },
          },
        });
      } else {
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

// Apply tracking to all methods using crud preset
export const { GET, POST } = withApiTrackingMethods(
  { GET: handleGET, POST: handlePOST },
  ApiTrackingPresets.crud('Config')
);
