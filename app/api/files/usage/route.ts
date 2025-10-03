import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { cloudinary } from '@/lib/cloudinary';

export interface CloudinaryUsageResponse {
  success: boolean;
  data?: {
    credits: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
    storage: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
    transformations: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
    bandwidth: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
    requests: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
  };
  error?: string;
}

async function handleGET(req: NextRequest) {
  try {
    // Get usage statistics from Cloudinary
    const usageData = await cloudinary.api.usage();

    // Format the response
    const response = {
      success: true,
      data: {
        credits: {
          used: usageData.credits?.used || 0,
          limit: usageData.credits?.limit || 0,
          remaining:
            (usageData.credits?.limit || 0) - (usageData.credits?.used || 0),
          percentage: usageData.credits?.limit
            ? Math.round(
                ((usageData.credits?.used || 0) / usageData.credits.limit) * 100
              )
            : 0,
        },
        storage: {
          used: usageData.storage?.used || 0,
          limit: usageData.storage?.limit || 0,
          remaining:
            (usageData.storage?.limit || 0) - (usageData.storage?.used || 0),
          percentage: usageData.storage?.limit
            ? Math.round(
                ((usageData.storage?.used || 0) / usageData.storage.limit) * 100
              )
            : 0,
        },
        transformations: {
          used: usageData.transformations?.used || 0,
          limit: usageData.transformations?.limit || 0,
          remaining:
            (usageData.transformations?.limit || 0) -
            (usageData.transformations?.used || 0),
          percentage: usageData.transformations?.limit
            ? Math.round(
                ((usageData.transformations?.used || 0) /
                  usageData.transformations.limit) *
                  100
              )
            : 0,
        },
        bandwidth: {
          used: usageData.bandwidth?.used || 0,
          limit: usageData.bandwidth?.limit || 0,
          remaining:
            (usageData.bandwidth?.limit || 0) -
            (usageData.bandwidth?.used || 0),
          percentage: usageData.bandwidth?.limit
            ? Math.round(
                ((usageData.bandwidth?.used || 0) / usageData.bandwidth.limit) *
                  100
              )
            : 0,
        },
        requests: {
          used: usageData.requests?.used || 0,
          limit: usageData.requests?.limit || 0,
          remaining:
            (usageData.requests?.limit || 0) - (usageData.requests?.used || 0),
          percentage: usageData.requests?.limit
            ? Math.round(
                ((usageData.requests?.used || 0) / usageData.requests.limit) *
                  100
              )
            : 0,
        },
      },
    };

    return NextResponse.json<CloudinaryUsageResponse>(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json<CloudinaryUsageResponse>(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch usage data',
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS
async function handleOPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Apply tracking to all methods using crud preset
export const { GET, OPTIONS } = withApiTrackingMethods(
  { GET: handleGET, OPTIONS: handleOPTIONS },
  ApiTrackingPresets.crud('File')
);
