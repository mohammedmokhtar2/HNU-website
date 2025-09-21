import { CloudinaryFile } from '@/types/file';

export type FileType =
  | 'image'
  | 'video'
  | 'pdf'
  | 'text'
  | 'document'
  | 'other';

export function getFileType(file: CloudinaryFile | File): FileType {
  let format: string;
  let resourceType: string;

  if (file instanceof File) {
    format = file.name.split('.').pop()?.toLowerCase() || '';
    resourceType = file.type.split('/')[0];
  } else {
    format = file.format?.toLowerCase() || '';
    resourceType = file.resource_type || 'auto';
  }

  // Video formats
  if (
    ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(format) ||
    resourceType === 'video'
  ) {
    return 'video';
  }

  // Image formats
  if (
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(format) ||
    resourceType === 'image'
  ) {
    return 'image';
  }

  // PDF format
  if (format === 'pdf') {
    return 'pdf';
  }

  // Text formats
  if (['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(format)) {
    return 'text';
  }

  // Document formats
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(format)) {
    return 'document';
  }

  return 'other';
}

export function getFileIcon(fileType: FileType): string {
  switch (fileType) {
    case 'image':
      return '🖼️';
    case 'video':
      return '🎥';
    case 'pdf':
      return '📄';
    case 'text':
      return '📝';
    case 'document':
      return '📋';
    default:
      return '📁';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
