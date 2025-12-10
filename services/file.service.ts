import {
  UploadFileInput,
  UploadFileResponse,
  ListFilesInput,
  ListFilesResponse,
  DeleteFileInput,
  DeleteFileResponse,
  CloudinaryFile,
} from '@/types/file';
import { api } from '@/lib/axios';

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

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;

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
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Upload failed',
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
      const params: any = {};
      if (input.folder) params.folder = input.folder;
      if (input.resource_type) params.resource_type = input.resource_type;
      if (input.max_results) params.max_results = input.max_results;
      if (input.next_cursor) params.next_cursor = input.next_cursor;
      if (input.tags) params.tags = input.tags.join(',');

      const response = await api.get('/files/list', { params });
      const result = response.data;

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
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to list files',
      };
    }
  }

  /**
   * Delete file from Cloudinary
   */
  static async deleteFile(input: DeleteFileInput): Promise<DeleteFileResponse> {
    try {
      const params: any = { public_id: input.public_id };
      if (input.resource_type) params.resource_type = input.resource_type;

      const response = await api.delete('/files/delete', { params });
      const result = response.data;

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
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to delete file',
      };
    }
  }

  /**
   * Get Cloudinary usage statistics
   */
  static async getUsage(): Promise<any> {
    try {
      const response = await api.get('/files/usage');
      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch usage data');
      }

      return result.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          'Failed to fetch usage data'
      );
    }
  }
}
