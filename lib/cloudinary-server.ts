// Server-side Cloudinary utilities
// This file should only be imported in server-side code (API routes, server components)

import { cloudinary } from './cloudinary';

export class CloudinaryServer {
  /**
   * Get file URL with transformations (server-side)
   */
  static getFileUrl(
    publicId: string,
    transformations?: Record<string, any>
  ): string {
    if (transformations) {
      return cloudinary.url(publicId, transformations);
    }
    return cloudinary.url(publicId);
  }

  /**
   * Get optimized image URL (server-side)
   */
  static getOptimizedImageUrl(
    publicId: string,
    width?: number,
    height?: number,
    quality: number = 80
  ): string {
    const transformations: Record<string, any> = {
      quality: 'auto',
      fetch_format: 'auto',
    };

    if (width) transformations.width = width;
    if (height) transformations.height = height;
    if (quality) transformations.quality = quality;

    return cloudinary.url(publicId, transformations);
  }

  /**
   * Get thumbnail URL (server-side)
   */
  static getThumbnailUrl(publicId: string, size: number = 150): string {
    return cloudinary.url(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  /**
   * Generate signed upload URL (server-side)
   */
  static generateUploadSignature(params: {
    folder: string;
    public_id?: string;
    tags?: string[];
    context?: Record<string, string>;
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
    transformation?: Record<string, any>;
  }) {
    return cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );
  }
}
