import {
  UploadFileInput,
  UploadFileResponse,
  ListFilesInput,
  ListFilesResponse,
  DeleteFileInput,
  DeleteFileResponse,
  CloudinaryFile,
} from '@/types/file';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class FileService {
  /**
   * Upload file to Cloudinary
   */
  static async uploadFile(input: UploadFileInput): Promise<UploadFileResponse> {
    try {
      const formData = new FormData();
      formData.append('file', input.file as File);
      formData.append('folder', input.folder || 'uploads');
      if (input.public_id) formData.append('public_id', input.public_id);
      if (input.tags) formData.append('tags', JSON.stringify(input.tags));
      if (input.context)
        formData.append('context', JSON.stringify(input.context));
      if (input.resource_type)
        formData.append('resource_type', input.resource_type);
      if (input.transformation)
        formData.append('transformation', JSON.stringify(input.transformation));

      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Upload failed',
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * List files from Cloudinary
   */
  static async listFiles(
    input: ListFilesInput = {}
  ): Promise<ListFilesResponse> {
    try {
      const params = new URLSearchParams();
      if (input.folder) params.append('folder', input.folder);
      if (input.resource_type)
        params.append('resource_type', input.resource_type);
      if (input.max_results)
        params.append('max_results', input.max_results.toString());
      if (input.next_cursor) params.append('next_cursor', input.next_cursor);
      if (input.tags) params.append('tags', input.tags.join(','));

      const response = await fetch(
        `${API_BASE_URL}/api/files/list?${params.toString()}`
      );
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Failed to list files',
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list files',
      };
    }
  }

  /**
   * Delete file from Cloudinary
   */
  static async deleteFile(input: DeleteFileInput): Promise<DeleteFileResponse> {
    try {
      const params = new URLSearchParams();
      params.append('public_id', input.public_id);
      if (input.resource_type)
        params.append('resource_type', input.resource_type);

      const response = await fetch(
        `${API_BASE_URL}/api/files/delete?${params.toString()}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Failed to delete file',
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file',
      };
    }
  }

  /**
   * Get Cloudinary usage statistics
   */
  static async getUsage(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/usage`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch usage data');
      }

      return result.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch usage data'
      );
    }
  }
}
