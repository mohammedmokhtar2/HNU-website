import { useState, useCallback } from 'react';
import {
  UploadFileInput,
  UploadFileResponse,
  ListFilesInput,
  ListFilesResponse,
  CloudinaryFile,
  UploadProgress,
} from '@/types/file';

export interface UseFileUploadOptions {
  onUploadSuccess?: (file: CloudinaryFile) => void;
  onUploadError?: (error: string) => void;
  onProgress?: (progress: UploadProgress) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (input: UploadFileInput) => {
      setIsUploading(true);
      setUploadError(null);
      setUploadProgress({ loaded: 0, total: 0, percentage: 0 });

      try {
        // Set initial progress
        if (input.file instanceof File) {
          const total = input.file.size;
          setUploadProgress({ loaded: 0, total, percentage: 0 });
        }

        // Create FormData for file upload
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
          formData.append(
            'transformation',
            JSON.stringify(input.transformation)
          );

        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success && result.data) {
          // Set progress to 100% on success
          if (input.file instanceof File) {
            setUploadProgress({
              loaded: input.file.size,
              total: input.file.size,
              percentage: 100,
            });
          }

          options.onUploadSuccess?.(result.data);

          // Clear progress after a short delay
          setTimeout(() => {
            setUploadProgress(null);
          }, 1000);

          return result;
        } else {
          const error = result.error || 'Upload failed';
          setUploadError(error);
          options.onUploadError?.(error);
          setUploadProgress(null);
          return result;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        setUploadError(errorMessage);
        options.onUploadError?.(errorMessage);
        setUploadProgress(null);
        return {
          success: false,
          error: errorMessage,
        } as UploadFileResponse;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  const resetUpload = useCallback(() => {
    setUploadError(null);
    setUploadProgress(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    uploadError,
    resetUpload,
  };
}

export function useFileList() {
  const [files, setFiles] = useState<CloudinaryFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [totalCount, setTotalCount] = useState(0);

  const listFiles = useCallback(async (input: ListFilesInput = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching files with input:', input);
      // Build query parameters
      const params = new URLSearchParams();
      if (input.folder) params.append('folder', input.folder);
      if (input.resource_type)
        params.append('resource_type', input.resource_type);
      if (input.max_results)
        params.append('max_results', input.max_results.toString());
      if (input.next_cursor) params.append('next_cursor', input.next_cursor);
      // Tags are not used for filtering in the list API
      // if (input.tags) params.append('tags', input.tags.join(','));

      const response = await fetch(`/api/files/list?${params.toString()}`);
      const result = await response.json();
      console.log('File list result:', result);

      if (result.success && result.data) {
        setFiles(result.data.files);
        setNextCursor(result.data.next_cursor);
        setTotalCount(result.data.total_count);
        console.log(`Loaded ${result.data.files.length} files`);
        return result;
      } else {
        const errorMessage = result.error || 'Failed to list files';
        console.error('File list error:', errorMessage);
        setError(errorMessage);
        return result;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to list files';
      console.error('File list catch error:', errorMessage);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      } as ListFilesResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMoreFiles = useCallback(
    async (input: ListFilesInput = {}) => {
      if (!nextCursor) return;

      setIsLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (input.folder) params.append('folder', input.folder);
        if (input.resource_type)
          params.append('resource_type', input.resource_type);
        if (input.max_results)
          params.append('max_results', input.max_results.toString());
        if (nextCursor) params.append('next_cursor', nextCursor);
        // Tags are not used for filtering in the list API
        // if (input.tags) params.append('tags', input.tags.join(','));

        const response = await fetch(`/api/files/list?${params.toString()}`);
        const result = await response.json();

        if (result.success && result.data) {
          setFiles(prev => [...prev, ...result.data!.files]);
          setNextCursor(result.data.next_cursor);
          return result;
        } else {
          const errorMessage = result.error || 'Failed to load more files';
          setError(errorMessage);
          return result;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load more files';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        } as ListFilesResponse;
      } finally {
        setIsLoading(false);
      }
    },
    [nextCursor]
  );

  const refreshFiles = useCallback(
    async (input: ListFilesInput = {}) => {
      console.log('Refreshing files with input:', input);
      setNextCursor(undefined);
      setFiles([]); // Clear existing files
      setTotalCount(0); // Reset total count
      return listFiles(input);
    },
    [listFiles]
  );

  return {
    files,
    isLoading,
    error,
    nextCursor,
    totalCount,
    listFiles,
    loadMoreFiles,
    refreshFiles,
    hasMore: !!nextCursor,
  };
}

export function useFileDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFile = useCallback(
    async (
      publicId: string,
      resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image'
    ) => {
      setIsDeleting(true);
      setError(null);

      try {
        console.log('Deleting file:', publicId, resourceType);
        const response = await fetch(
          `/api/files/delete?public_id=${encodeURIComponent(publicId)}&resource_type=${resourceType}`,
          {
            method: 'DELETE',
          }
        );

        const result = await response.json();

        if (result.success) {
          console.log('File deleted successfully');
        } else {
          const errorMessage = result.error || 'Failed to delete file';
          console.error('Delete error:', errorMessage);
          setError(errorMessage);
        }

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete file';
        console.error('Delete catch error:', errorMessage);
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  return {
    deleteFile,
    isDeleting,
    error,
  };
}
