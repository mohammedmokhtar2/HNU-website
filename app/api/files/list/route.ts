import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import {
  ListFilesInput,
  ListFilesResponse,
  CloudinaryFile,
} from '@/types/file';
import { z } from 'zod';

// Validation schema for list request
const listSchema = z.object({
  folder: z.string().optional(),
  resource_type: z
    .enum(['image', 'video', 'raw', 'auto'])
    .optional()
    .default('image'),
  max_results: z.number().min(1).max(500).optional().default(50),
  next_cursor: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const folder = searchParams.get('folder') || undefined;
    const resource_type =
      (searchParams.get('resource_type') as
        | 'image'
        | 'video'
        | 'raw'
        | 'auto') || 'image';
    const max_results = searchParams.get('max_results')
      ? parseInt(searchParams.get('max_results')!)
      : 50;
    const next_cursor = searchParams.get('next_cursor') || undefined;
    const tags = searchParams.get('tags')
      ? searchParams.get('tags')!.split(',')
      : undefined;

    // Validate parameters
    const validationResult = listSchema.safeParse({
      folder,
      resource_type,
      max_results,
      next_cursor,
      tags,
    });

    if (!validationResult.success) {
      return NextResponse.json<ListFilesResponse>(
        {
          success: false,
          error: `Validation error: ${validationResult.error.issues.map(e => e.message).join(', ')}`,
        },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    const validatedData = validationResult.data;

    // Build Cloudinary search expression
    let expression =
      validatedData.resource_type === 'auto'
        ? 'resource_type:image OR resource_type:video OR resource_type:raw'
        : 'resource_type:' + validatedData.resource_type;

    if (validatedData.folder) {
      expression += ' AND folder:"' + validatedData.folder + '"';
    }

    // Note: Tag filtering is disabled for now to avoid Cloudinary search issues
    // Tags can still be used for organization but won't filter the results
    // if (validatedData.tags && validatedData.tags.length > 0) {
    //   const tagExpression = validatedData.tags
    //     .map(tag => `tags:"${tag}"`)
    //     .join(' AND ');
    //   expression += ' AND (' + tagExpression + ')';
    // }

    // Search for files in Cloudinary
    const searchResult = await cloudinary.search
      .expression(expression)
      .max_results(validatedData.max_results)
      .next_cursor(validatedData.next_cursor)
      .execute();

    // Format the response
    const files: CloudinaryFile[] = searchResult.resources.map(
      (resource: any) => ({
        id: resource.public_id,
        public_id: resource.public_id,
        url: resource.url,
        secure_url: resource.secure_url,
        folder: resource.folder || '',
        filename:
          resource.filename ||
          resource.public_id.split('/').pop() ||
          resource.public_id,
        format: resource.format,
        resource_type: resource.resource_type,
        bytes: resource.bytes,
        width: resource.width,
        height: resource.height,
        created_at: resource.created_at,
        tags: resource.tags,
        context: resource.context,
      })
    );

    return NextResponse.json<ListFilesResponse>(
      {
        success: true,
        data: {
          files,
          next_cursor: searchResult.next_cursor,
          total_count: searchResult.total_count,
        },
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json<ListFilesResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
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
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
