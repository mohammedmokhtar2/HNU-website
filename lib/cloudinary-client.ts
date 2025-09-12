// Client-side safe Cloudinary utilities
// This file can be imported in client components

export class CloudinaryClient {
  /**
   * Get file URL with transformations (client-side safe)
   */
  static getFileUrl(
    publicId: string,
    transformations?: Record<string, any>
  ): string {
    // Use Cloudinary's URL transformation API directly
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not configured');
      return publicId; // Fallback to public ID
    }

    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

    if (transformations) {
      const transformString = Object.entries(transformations)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');
      return `${baseUrl}/${transformString}/${publicId}`;
    }

    return `${baseUrl}/${publicId}`;
  }

  /**
   * Get optimized image URL (client-side safe)
   */
  static getOptimizedImageUrl(
    publicId: string,
    width?: number,
    height?: number,
    quality: number = 80
  ): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not configured');
      return publicId; // Fallback to public ID
    }

    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

    const transformations: string[] = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`, 'f_auto');

    const transformString = transformations.join(',');
    return `${baseUrl}/${transformString}/${publicId}`;
  }

  /**
   * Get thumbnail URL (client-side safe)
   */
  static getThumbnailUrl(publicId: string, size: number = 150): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not configured');
      return publicId; // Fallback to public ID
    }

    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
    const transformString = `w_${size},h_${size},c_fill,q_auto,f_auto`;
    return `${baseUrl}/${transformString}/${publicId}`;
  }

  /**
   * Get video thumbnail URL (client-side safe)
   */
  static getVideoThumbnailUrl(publicId: string, size: number = 150): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not configured');
      return publicId; // Fallback to public ID
    }

    const baseUrl = `https://res.cloudinary.com/${cloudName}/video/upload`;
    const transformString = `w_${size},h_${size},c_fill,q_auto,f_auto`;
    return `${baseUrl}/${transformString}/${publicId}`;
  }

  /**
   * Get raw file URL (client-side safe)
   */
  static getRawFileUrl(publicId: string): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not configured');
      return publicId; // Fallback to public ID
    }

    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
  }
}
