import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import {
  UploadFileInput,
  UploadFileResponse,
  DEFAULT_FILE_VALIDATION,
} from '@/types/file';
import { z } from 'zod';

// Validation schema for upload request
const uploadSchema = z
  .object({
    folder: z.string().min(1, 'Folder name is required'),
    public_id: z.string().optional(),
    tags: z.array(z.string()).optional(),
    context: z.record(z.string(), z.string()).optional(),
    resource_type: z
      .enum(['image', 'video', 'raw', 'auto'])
      .optional()
      .default('auto'),
    transformation: z.record(z.string(), z.any()).optional(),
  })
  .refine(
    data => {
      // Ensure no quality-reducing transformations are applied
      if (
        data.transformation &&
        typeof data.transformation === 'object' &&
        Object.keys(data.transformation).length > 0
      ) {
        const forbiddenKeys = [
          'quality',
          'q',
          'width',
          'height',
          'crop',
          'gravity',
          'format',
        ];
        const hasForbiddenTransform = Object.keys(data.transformation).some(
          key =>
            forbiddenKeys.some(forbidden =>
              key.toLowerCase().includes(forbidden.toLowerCase())
            )
        );
        return !hasForbiddenTransform;
      }
      return true;
    },
    {
      message:
        'Transformations that affect quality, dimensions, or cropping are not allowed. Files will be uploaded in their original quality and dimensions.',
    }
  );

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const public_id = formData.get('public_id') as string | null;
    const tags = formData.get('tags') as string | null;
    const context = formData.get('context') as string | null;
    const resource_type = formData.get('resource_type') as string | null;
    const transformation = formData.get('transformation') as string | null;

    // Validate required fields
    if (!file) {
      return NextResponse.json<UploadFileResponse>(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      );
    }

    if (!folder) {
      return NextResponse.json<UploadFileResponse>(
        {
          success: false,
          error: 'Folder name is required',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > DEFAULT_FILE_VALIDATION.maxSize) {
      return NextResponse.json<UploadFileResponse>(
        {
          success: false,
          error: `File size exceeds maximum allowed size of ${DEFAULT_FILE_VALIDATION.maxSize / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (
      fileExtension &&
      !DEFAULT_FILE_VALIDATION.allowedFormats.includes(fileExtension)
    ) {
      return NextResponse.json<UploadFileResponse>(
        {
          success: false,
          error: `File type .${fileExtension} is not allowed. Allowed types: ${DEFAULT_FILE_VALIDATION.allowedFormats.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Parse optional parameters
    let parsedTags: string[] | undefined;
    let parsedContext: Record<string, string> | undefined;
    let parsedTransformation: Record<string, any> | undefined;

    try {
      if (tags && tags.trim()) parsedTags = JSON.parse(tags);
      if (context && context.trim()) parsedContext = JSON.parse(context);
      if (transformation && transformation.trim())
        parsedTransformation = JSON.parse(transformation);
    } catch (error) {
      return NextResponse.json<UploadFileResponse>(
        {
          success: false,
          error: 'Invalid JSON format in optional parameters',
        },
        { status: 400 }
      );
    }

    // Validate the parsed data
    const validationResult = uploadSchema.safeParse({
      folder,
      public_id: public_id || undefined,
      tags: parsedTags,
      context: parsedContext,
      resource_type: resource_type || 'auto',
      transformation: parsedTransformation,
    });

    if (!validationResult.success) {
      return NextResponse.json<UploadFileResponse>(
        {
          success: false,
          error: `Validation error: ${validationResult.error.issues.map(e => e.message).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary with quality preservation settings
    // This ensures images and videos are uploaded without any quality loss or cropping
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: validatedData.folder,
            public_id: validatedData.public_id,
            tags: validatedData.tags,
            context: validatedData.context,
            resource_type: validatedData.resource_type,
            // Preserve original quality and dimensions
            quality: 'auto:best', // Use best quality available
            // Don't apply any transformations that could affect quality
            transformation: validatedData.transformation || {},
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    if (!uploadResult) {
      return NextResponse.json<UploadFileResponse>(
        {
          success: false,
          error: 'Upload failed',
        },
        { status: 500 }
      );
    }

    const cloudinaryFile = uploadResult as any;

    // Format response
    const fileData = {
      id: cloudinaryFile.public_id,
      public_id: cloudinaryFile.public_id,
      url: cloudinaryFile.url,
      secure_url: cloudinaryFile.secure_url,
      folder: cloudinaryFile.folder || validatedData.folder,
      filename: cloudinaryFile.original_filename || file.name,
      format: cloudinaryFile.format,
      resource_type: cloudinaryFile.resource_type,
      bytes: cloudinaryFile.bytes,
      width: cloudinaryFile.width,
      height: cloudinaryFile.height,
      created_at: cloudinaryFile.created_at,
      tags: cloudinaryFile.tags,
      context: cloudinaryFile.context,
    };

    return NextResponse.json<UploadFileResponse>(
      {
        success: true,
        data: fileData,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json<UploadFileResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
