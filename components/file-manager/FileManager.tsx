'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  useFileUpload,
  useFileList,
  useFileDelete,
} from '@/hooks/use-file-upload';
import { CloudinaryFile } from '@/types/file';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Upload,
  File,
  Trash2,
  Download,
  Eye,
  RefreshCw,
  Plus,
  Grid3X3,
  List,
  Search,
  Filter,
} from 'lucide-react';
import { CloudinaryClient } from '@/lib/cloudinary-client';
import Image from 'next/image';
import { UploadDialog } from './UploadDialog';
import { FileDetailsDialog } from './FileDetailsDialog';

interface FileManagerProps {
  onFileSelect?: (file: CloudinaryFile) => void;
  showUpload?: boolean;
  showDelete?: boolean;
  viewMode?: 'cards' | 'list';
  onViewModeChange?: (mode: 'cards' | 'list') => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  onResourceTypeChange?: (type: 'image' | 'video' | 'raw' | 'auto') => void;
}

export function FileManager({
  onFileSelect,
  showUpload = true,
  showDelete = true,
  viewMode: externalViewMode,
  onViewModeChange,
  searchTerm = '',
  onSearchChange,
  resourceType = 'image',
  onResourceTypeChange,
}: FileManagerProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use external view mode if provided, otherwise use internal state
  const currentViewMode = externalViewMode || viewMode;
  const handleViewModeChange = useCallback(
    (mode: 'cards' | 'list') => {
      if (onViewModeChange) {
        onViewModeChange(mode);
      } else {
        setViewMode(mode);
      }
    },
    [onViewModeChange]
  );

  const { uploadFile, isUploading, uploadProgress, uploadError, resetUpload } =
    useFileUpload({
      onUploadSuccess: file => {
        console.log('File uploaded successfully:', file);
        refreshFiles();
        resetUpload();
      },
      onUploadError: error => {
        console.error('Upload error:', error);
      },
    });

  const { files, isLoading, error, listFiles, refreshFiles, totalCount } =
    useFileList();

  const { deleteFile, isDeleting } = useFileDelete();

  // Load files when component mounts
  React.useEffect(() => {
    listFiles({
      resource_type: resourceType,
    });
  }, [resourceType, listFiles]);

  // Filter files based on search term
  const filteredFiles = useMemo(() => {
    if (!searchTerm) return files;
    return files.filter(
      file =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.folder &&
          file.folder.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [files, searchTerm]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadFile({
      file,
      folder: 'uploads', // Default folder
      tags: ['uploaded-via-manager'],
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = useCallback(
    async (file: CloudinaryFile) => {
      if (!confirm(`Are you sure you want to delete "${file.filename}"?`))
        return;

      try {
        await deleteFile(file.public_id, file.resource_type);
        refreshFiles();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    },
    [deleteFile, refreshFiles]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Multi-select functionality - optimized with useCallback
  const handleSelectFile = useCallback((fileId: string, checked: boolean) => {
    setSelectedFiles(prev => {
      const newSelectedFiles = new Set(prev);
      if (checked) {
        newSelectedFiles.add(fileId);
      } else {
        newSelectedFiles.delete(fileId);
      }
      return newSelectedFiles;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allFileIds = new Set(filteredFiles.map(file => file.public_id));
        setSelectedFiles(allFileIds);
      } else {
        setSelectedFiles(new Set());
      }
      setSelectAll(checked);
    },
    [filteredFiles]
  );

  const handleBulkDownload = useCallback(async () => {
    const selectedFilesList = filteredFiles.filter(file =>
      selectedFiles.has(file.public_id)
    );

    for (const file of selectedFilesList) {
      const link = document.createElement('a');
      link.href = file.secure_url;
      link.download = file.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add a small delay between downloads to avoid browser blocking
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }, [filteredFiles, selectedFiles]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedFiles.size === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedFiles.size} selected files? This action cannot be undone.`
      )
    ) {
      return;
    }

    const selectedFilesList = Array.from(selectedFiles);

    try {
      for (const fileId of selectedFilesList) {
        const file = filteredFiles.find(f => f.public_id === fileId);
        if (file) {
          await deleteFile(file.public_id, file.resource_type);
        }
      }
      setSelectedFiles(new Set());
      setSelectAll(false);
      refreshFiles();
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  }, [selectedFiles, filteredFiles, deleteFile, refreshFiles]);

  // Update selectAll state when selectedFiles or filteredFiles change
  React.useEffect(() => {
    setSelectAll(
      selectedFiles.size === filteredFiles.length && filteredFiles.length > 0
    );
  }, [selectedFiles, filteredFiles]);

  // Clear selections when files change
  React.useEffect(() => {
    setSelectedFiles(new Set());
    setSelectAll(false);
  }, [filteredFiles]);

  // Memoized values to prevent unnecessary re-renders
  const selectedFilesCount = useMemo(() => selectedFiles.size, [selectedFiles]);
  const hasSelectedFiles = useMemo(
    () => selectedFilesCount > 0,
    [selectedFilesCount]
  );

  // Custom comparison function for memoized components
  const fileComponentPropsAreEqual = (prevProps: any, nextProps: any) => {
    return (
      prevProps.file.public_id === nextProps.file.public_id &&
      prevProps.file.filename === nextProps.file.filename &&
      prevProps.file.format === nextProps.file.format &&
      prevProps.file.bytes === nextProps.file.bytes &&
      prevProps.file.created_at === nextProps.file.created_at &&
      prevProps.file.folder === nextProps.file.folder &&
      prevProps.file.resource_type === nextProps.file.resource_type &&
      prevProps.file.secure_url === nextProps.file.secure_url
    );
  };

  // Card View Component - Memoized to prevent unnecessary re-renders
  const FileCard = React.memo(
    ({ file }: { file: CloudinaryFile }) => (
      <div className='group relative border rounded-lg p-4 hover:shadow-md transition-shadow'>
        <div className='flex items-start justify-between mb-3'>
          <Checkbox
            checked={selectedFiles.has(file.public_id)}
            onCheckedChange={checked =>
              handleSelectFile(file.public_id, checked as boolean)
            }
            className='mt-1'
          />
          <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
            <FileDetailsDialog
              file={file}
              trigger={
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <Eye className='w-4 h-4' />
                </Button>
              }
            />
            <Button
              variant='ghost'
              size='sm'
              onClick={() => window.open(file.secure_url, '_blank')}
              className='h-8 w-8 p-0'
            >
              <Download className='w-4 h-4' />
            </Button>
            {showDelete && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleDeleteFile(file)}
                disabled={isDeleting}
                className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            )}
          </div>
        </div>

        {/* Image Preview */}
        <div className='aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden'>
          {file.resource_type === 'image' ? (
            <Image
              src={CloudinaryClient.getThumbnailUrl(file.public_id, 200)}
              alt={file.filename}
              className='w-full h-full object-cover'
              loading='lazy'
              width={200}
              height={200}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <File className='w-12 h-12 text-gray-400' />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className='space-y-2'>
          <h3 className='font-medium text-sm truncate' title={file.filename}>
            {file.filename}
          </h3>
          <div className='flex items-center gap-2 text-xs text-gray-500'>
            <Badge variant='secondary'>{file.format}</Badge>
            <span>{formatFileSize(file.bytes)}</span>
          </div>
          <div className='text-xs text-gray-400'>
            {formatDate(file.created_at)}
          </div>
          {file.folder && (
            <Badge variant='outline' className='text-xs'>
              {file.folder}
            </Badge>
          )}
        </div>
      </div>
    ),
    fileComponentPropsAreEqual
  );
  FileCard.displayName = 'FileCard';

  // List View Component - Memoized to prevent unnecessary re-renders
  const FileListItem = React.memo(
    ({ file }: { file: CloudinaryFile }) => (
      <div className='flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 group'>
        <div className='flex items-center gap-3 flex-1'>
          <Checkbox
            checked={selectedFiles.has(file.public_id)}
            onCheckedChange={checked =>
              handleSelectFile(file.public_id, checked as boolean)
            }
          />
          <div className='w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0'>
            {file.resource_type === 'image' ? (
              <Image
                src={CloudinaryClient.getThumbnailUrl(file.public_id, 40)}
                alt={file.filename}
                className='w-full h-full object-cover rounded'
                width={40}
                height={40}
              />
            ) : (
              <File className='w-5 h-5 text-gray-500' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-medium truncate'>{file.filename}</p>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <Badge variant='secondary'>{file.format}</Badge>
              <span>{formatFileSize(file.bytes)}</span>
              <span>{formatDate(file.created_at)}</span>
              {file.folder && <Badge variant='outline'>{file.folder}</Badge>}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <FileDetailsDialog
            file={file}
            trigger={
              <Button variant='ghost' size='sm'>
                <Eye className='w-4 h-4' />
              </Button>
            }
          />
          <Button
            variant='ghost'
            size='sm'
            onClick={() => window.open(file.secure_url, '_blank')}
          >
            <Download className='w-4 h-4' />
          </Button>
          {showDelete && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleDeleteFile(file)}
              disabled={isDeleting}
              className='text-red-600 hover:text-red-700'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          )}
        </div>
      </div>
    ),
    fileComponentPropsAreEqual
  );
  FileListItem.displayName = 'FileListItem';

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>File Manager</h2>
          <p className='text-gray-600'>
            {filteredFiles.length} files
            {hasSelectedFiles && ` • ${selectedFilesCount} selected`}
          </p>
        </div>
        <div className='flex gap-2'>
          {/* View Mode Toggle */}
          <div className='flex border rounded-lg'>
            <Button
              variant={currentViewMode === 'cards' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => handleViewModeChange('cards')}
              className='rounded-r-none'
            >
              <Grid3X3 className='w-4 h-4' />
            </Button>
            <Button
              variant={currentViewMode === 'list' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => handleViewModeChange('list')}
              className='rounded-l-none'
            >
              <List className='w-4 h-4' />
            </Button>
          </div>

          {/* Bulk Operations */}
          {hasSelectedFiles && (
            <>
              <Button
                variant='outline'
                size='sm'
                onClick={handleBulkDownload}
                disabled={isDeleting}
              >
                <Download className='w-4 h-4 mr-2' />
                Download ({selectedFilesCount})
              </Button>
              {showDelete && (
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className='w-4 h-4 mr-2' />
                  Delete ({selectedFilesCount})
                </Button>
              )}
            </>
          )}

          <Button
            variant='outline'
            onClick={() => refreshFiles()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  placeholder='Search files...'
                  value={searchTerm}
                  onChange={e => onSearchChange?.(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <div className='w-48'>
              <select
                value={resourceType}
                onChange={e =>
                  onResourceTypeChange?.(
                    e.target.value as 'image' | 'video' | 'raw' | 'auto'
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='image'>Images</option>
                <option value='video'>Videos</option>
                <option value='raw'>Documents</option>
                <option value='auto'>All Types</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span className='flex items-center gap-2'>
                <Upload className='w-5 h-5' />
                Upload Files
              </span>
              <UploadDialog
                onUploadSuccess={refreshFiles}
                defaultFolder='uploads'
                trigger={
                  <Button>
                    <Plus className='w-4 h-4 mr-2' />
                    Upload Files
                  </Button>
                }
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-center py-8 text-gray-500'>
              <Upload className='w-12 h-12 mx-auto mb-4 text-gray-300' />
              <p className='text-lg font-medium mb-2'>
                Upload Files to Cloudinary
              </p>
              <p className='text-sm'>
                Click the "Upload Files" button to access the upload dialog
                with:
              </p>
              <ul className='text-sm mt-2 space-y-1'>
                <li>
                  • Multiple file type support (images, videos, documents)
                </li>
                <li>• Direct upload to Cloudinary</li>
                <li>• Batch upload with progress tracking</li>
                <li>• Automatic file organization</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <span className='flex items-center gap-2'>
                <File className='w-5 h-5' />
                Files ({filteredFiles.length})
              </span>
              {filteredFiles.length > 0 && (
                <div className='flex items-center gap-2'>
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    id='select-all'
                  />
                  <label htmlFor='select-all' className='text-sm text-gray-600'>
                    Select All
                  </label>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && filteredFiles.length === 0 ? (
            <div className='flex items-center justify-center py-8'>
              <RefreshCw className='w-6 h-6 animate-spin mr-2' />
              Loading files...
            </div>
          ) : error ? (
            <Alert variant='destructive'>
              <AlertDescription>
                {error || 'An error occurred'}
              </AlertDescription>
            </Alert>
          ) : filteredFiles.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              {searchTerm
                ? 'No files found matching your search'
                : 'No files found'}
            </div>
          ) : (
            <>
              {currentViewMode === 'cards' ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                  {filteredFiles.map(file => (
                    <FileCard key={file.public_id} file={file} />
                  ))}
                </div>
              ) : (
                <div className='space-y-2'>
                  {filteredFiles.map(file => (
                    <FileListItem key={file.public_id} file={file} />
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
