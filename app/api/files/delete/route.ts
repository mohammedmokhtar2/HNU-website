import { NextRequest, NextResponse } from 'next/server';
import {
  withApiTrackingMethods,
  ApiTrackingPresets,
} from '@/lib/middleware/apiTrackingMiddleware';
import { cloudinary } from '@/lib/cloudinary';
import { DeleteFileInput, DeleteFileResponse } from '@/types/file';
import { z } from 'zod';

// Validation schema for delete file request
const deleteFileSchema = z.object({
  public_id: z.string().min(1, 'Public ID is required'),
  resource_type: z
    .enum(['image', 'video', 'raw', 'auto'])
    .optional()
    .default('image'),
});

async function handleDELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const public_id = searchParams.get('public_id');
    const resource_type =
      (searchParams.get('resource_type') as
        | 'image'
        | 'video'
        | 'raw'
        | 'auto') || 'image';

    // Validate parameters
    const validationResult = deleteFileSchema.safeParse({
      public_id,
      resource_type,
    });

    if (!validationResult.success) {
      return NextResponse.json<DeleteFileResponse>(
        {
          success: false,
          error: `Validation error: ${validationResult.error.issues.map(e => e.message).join(', ')}`,
        },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    const validatedData = validationResult.data;

    // Delete the file from Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(
      validatedData.public_id,
      {
        resource_type: validatedData.resource_type,
      }
    );

    if (deleteResult.result === 'not found') {
      return NextResponse.json<DeleteFileResponse>(
        {
          success: false,
          error: 'File not found',
        },
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    return NextResponse.json<DeleteFileResponse>(
      {
        success: true,
        data: {
          public_id: validatedData.public_id,
          result: deleteResult.result,
        },
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json<DeleteFileResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
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
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Apply tracking to all methods using fileOperation preset
export const { DELETE, OPTIONS } = withApiTrackingMethods(
  { DELETE: handleDELETE, OPTIONS: handleOPTIONS },
  ApiTrackingPresets.fileOperation('delete')
);
