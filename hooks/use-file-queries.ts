import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CloudinaryFile } from '@/types/file';

// Query Keys
export const fileKeys = {
  all: ['files'] as const,
  lists: () => [...fileKeys.all, 'list'] as const,
  list: (folder?: string, resourceType?: string) =>
    [...fileKeys.lists(), { folder, resourceType }] as const,
  details: () => [...fileKeys.all, 'detail'] as const,
  detail: (id: string) => [...fileKeys.details(), id] as const,
  usage: () => [...fileKeys.all, 'usage'] as const,
};

// API Functions
const fileApi = {
  getFiles: async (
    folder?: string,
    resourceType?: string
  ): Promise<CloudinaryFile[]> => {
    const params = new URLSearchParams();
    if (folder) params.append('folder', folder);
    if (resourceType) params.append('resource_type', resourceType);

    const url = `/api/files/list${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch files');
    }

    // The API returns { success: true, data: { files, next_cursor, total_count } }
    // We need to extract the files array
    return result.data.files || [];
  },

  getFileById: async (id: string): Promise<CloudinaryFile> => {
    const response = await fetch(`/api/files/${id}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch file');
    }

    return result.data;
  },

  deleteFile: async (id: string): Promise<{ id: string; filename: string }> => {
    const response = await fetch(
      `/api/files/delete?public_id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete file');
    }

    return result.data;
  },

  deleteFiles: async (
    ids: string[]
  ): Promise<{ deleted: number; failed: number }> => {
    let deleted = 0;
    let failed = 0;

    // Delete files one by one since the API doesn't support bulk deletion
    for (const id of ids) {
      try {
        await fileApi.deleteFile(id);
        deleted++;
      } catch (error) {
        console.error(`Failed to delete file ${id}:`, error);
        failed++;
      }
    }

    return { deleted, failed };
  },

  getCloudinaryUsage: async () => {
    const response = await fetch('/api/files/usage');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch usage data');
    }

    return result.data;
  },
};

// Query Hooks
export function useFiles(folder?: string, resourceType?: string) {
  return useQuery({
    queryKey: fileKeys.list(folder, resourceType),
    queryFn: () => fileApi.getFiles(folder, resourceType),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useFile(id: string) {
  return useQuery({
    queryKey: fileKeys.detail(id),
    queryFn: () => fileApi.getFileById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCloudinaryUsage() {
  return useQuery({
    queryKey: fileKeys.usage(),
    queryFn: fileApi.getCloudinaryUsage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

// Mutation Hooks
export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fileApi.deleteFile,
    onSuccess: deletedFile => {
      // Remove the file from all file lists
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });

      // Remove from cache
      queryClient.removeQueries({ queryKey: fileKeys.detail(deletedFile.id) });

      // Invalidate usage data
      queryClient.invalidateQueries({ queryKey: fileKeys.usage() });

      toast.success(`File "${deletedFile.filename}" deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete file');
    },
  });
}

export function useDeleteFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fileApi.deleteFiles,
    onSuccess: result => {
      // Invalidate all file lists
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });

      // Invalidate usage data
      queryClient.invalidateQueries({ queryKey: fileKeys.usage() });

      if (result.failed > 0) {
        toast.warning(
          `${result.deleted} files deleted, ${result.failed} failed`
        );
      } else {
        toast.success(`${result.deleted} files deleted successfully`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete files');
    },
  });
}

// Utility Hooks
export function useFileMutations() {
  const deleteFile = useDeleteFile();
  const deleteFiles = useDeleteFiles();

  return {
    deleteFile,
    deleteFiles,
    isLoading: deleteFile.isPending || deleteFiles.isPending,
  };
}

export function useFileOperations(folder?: string, resourceType?: string) {
  const files = useFiles(folder, resourceType);
  const usage = useCloudinaryUsage();
  const mutations = useFileMutations();

  return {
    files,
    usage,
    mutations,
    isLoading: files.isLoading || usage.isLoading || mutations.isLoading,
    error: files.error || usage.error,
  };
}

// Refresh hook
export function useRefreshFiles() {
  const queryClient = useQueryClient();

  const refreshFiles = () => {
    queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
    queryClient.invalidateQueries({ queryKey: fileKeys.usage() });
  };

  return { refreshFiles };
}
