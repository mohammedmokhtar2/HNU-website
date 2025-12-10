// File management types for Cloudinary storage system

export interface CloudinaryFile {
  id: string;
  public_id: string;
  url: string;
  secure_url: string;
  folder: string;
  filename: string;
  format: string;
  resource_type: 'image' | 'video' | 'raw' | 'auto';
  bytes: number;
  width?: number;
  height?: number;
  created_at: string;
  tags?: string[];
  context?: Record<string, string>;
}

export interface UploadFileInput {
  file: File | Buffer | string; // File object, Buffer, or base64 string
  folder: string;
  public_id?: string; // Optional custom public ID
  tags?: string[];
  context?: Record<string, string>;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: Record<string, any>; // Cloudinary transformation options
}

export interface UploadFileResponse {
  success: boolean;
  data?: CloudinaryFile;
  error?: string;
}

export interface ListFilesInput {
  folder?: string; // If provided, only list files in this folder
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  max_results?: number; // Default 50, max 500
  next_cursor?: string; // For pagination
  tags?: string[]; // Filter by tags
}

export interface ListFilesResponse {
  success: boolean;
  data?: {
    files: CloudinaryFile[];
    next_cursor?: string;
    total_count: number;
  };
  error?: string;
}

export interface DeleteFileInput {
  public_id: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

export interface DeleteFileResponse {
  success: boolean;
  data?: {
    public_id: string;
    result: string;
  };
  error?: string;
}

export interface DeleteFolderInput {
  folder: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

export interface DeleteFolderResponse {
  success: boolean;
  data?: {
    deleted: string[];
    not_found: string[];
  };
  error?: string;
}

// Folder management types
export interface Folder {
  name: string;
  path: string;
  created_at: string;
  file_count: number;
}

export interface ListFoldersResponse {
  success: boolean;
  data?: {
    folders: Folder[];
  };
  error?: string;
}

// File upload progress tracking
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// File validation
export interface FileValidation {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedFormats: string[];
}

export const DEFAULT_FILE_VALIDATION: FileValidation = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image', 'video', 'raw'],
  allowedFormats: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'mp4',
    'mov',
    'avi',
    'pdf',
    'doc',
    'docx',
    'txt',
  ],
};
