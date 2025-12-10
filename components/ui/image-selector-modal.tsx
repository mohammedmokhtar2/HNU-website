'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileService } from '@/services/file.service';
import { CloudinaryFile } from '@/types/file';
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  Play,
  FileText,
  File,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useFileUpload } from '@/hooks/use-file-upload';
import {
  getFileType,
  getFileIcon,
  formatFileSize,
  type FileType,
} from '@/lib/file-utils';

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
  acceptedFileTypes?: FileType[];
  title?: string;
}

export function ImageSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
  acceptedFileTypes = ['image', 'video', 'pdf', 'text', 'document'],
  title = 'Select or Upload File',
}: ImageSelectorModalProps) {
  const [existingImages, setExistingImages] = useState<CloudinaryFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentValue || null
  );
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const isMountedRef = useRef(true);

  const { uploadFile: uploadFileHook, isUploading } = useFileUpload();

  // Component to render different file types
  const FilePreview = ({
    file,
    isSelected,
    onClick,
  }: {
    file: CloudinaryFile;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    const fileType = getFileType(file);
    const fileIcon = getFileIcon(fileType);

    if (!acceptedFileTypes.includes(fileType)) {
      return null;
    }

    return (
      <div
        className={cn(
          'relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:border-blue-500',
          isSelected ? 'border-blue-500' : 'border-gray-200'
        )}
        onClick={onClick}
      >
        <div className='w-full h-32 flex items-center justify-center bg-gray-50'>
          {fileType === 'image' && (
            <Image
              src={file.secure_url}
              alt='File preview'
              className='w-full h-full object-cover'
              width={150}
              height={128}
            />
          )}
          {fileType === 'video' && (
            <div className='relative w-full h-full flex items-center justify-center'>
              <video
                src={file.secure_url}
                className='w-full h-full object-cover'
                muted
                preload='metadata'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30'>
                <Play className='h-8 w-8 text-white' />
              </div>
            </div>
          )}
          {fileType === 'pdf' && (
            <div className='flex flex-col items-center justify-center p-4'>
              <FileText className='h-12 w-12 text-red-500 mb-2' />
              <span className='text-xs text-gray-600 text-center'>PDF</span>
            </div>
          )}
          {fileType === 'text' && (
            <div className='flex flex-col items-center justify-center p-4'>
              <FileText className='h-12 w-12 text-blue-500 mb-2' />
              <span className='text-xs text-gray-600 text-center'>TEXT</span>
            </div>
          )}
          {fileType === 'document' && (
            <div className='flex flex-col items-center justify-center p-4'>
              <File className='h-12 w-12 text-green-500 mb-2' />
              <span className='text-xs text-gray-600 text-center'>DOC</span>
            </div>
          )}
          {fileType === 'other' && (
            <div className='flex flex-col items-center justify-center p-4'>
              <File className='h-12 w-12 text-gray-500 mb-2' />
              <span className='text-xs text-gray-600 text-center'>
                {file.format?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* File info overlay */}
        <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2'>
          <div className='text-xs truncate font-medium'>{file.filename}</div>
          <div className='text-xs opacity-75 flex justify-between items-center'>
            <span>{formatFileSize(file.bytes)}</span>
            {file.width && file.height && (
              <span className='ml-2'>
                {file.width}×{file.height}
              </span>
            )}
          </div>
          {file.tags && file.tags.length > 0 && (
            <div className='text-xs opacity-60 mt-1'>
              {file.tags.slice(0, 2).join(', ')}
              {file.tags.length > 2 && ` +${file.tags.length - 2}`}
            </div>
          )}
        </div>

        {isSelected && (
          <div className='absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center'>
            <Check className='h-6 w-6 text-blue-600' />
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (isOpen) {
      const fetchImages = async () => {
        if (loading || !isMountedRef.current) return;

        try {
          setLoading(true);
          setError(null);
          const result = await FileService.listFiles({
            folder: 'programs/images',
            resource_type: 'auto',
            max_results: 50,
          });

          if (result.success && result.data && isMountedRef.current) {
            // Filter files based on accepted file types
            const filteredFiles =
              result.data.files?.filter(file => {
                const fileType = getFileType(file);
                return acceptedFileTypes.includes(fileType);
              }) || [];
            setExistingImages(filteredFiles);
            setNextCursor(result.data.next_cursor);
            setTotalCount(result.data.total_count);
          } else if (result.error && isMountedRef.current) {
            setError(result.error);
          }
        } catch (error) {
          console.error('Error loading files:', error);
          if (isMountedRef.current) {
            setError(
              error instanceof Error ? error.message : 'Failed to load files'
            );
          }
        } finally {
          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      };

      fetchImages();
    }
  }, [isOpen, acceptedFileTypes, loading]);

  // Function to load more files (pagination)
  const loadMoreFiles = async () => {
    if (loadingMore || !nextCursor || !isMountedRef.current) return;

    try {
      setLoadingMore(true);
      const result = await FileService.listFiles({
        folder: 'programs/images',
        resource_type: 'auto',
        max_results: 50,
        next_cursor: nextCursor,
      });

      if (result.success && result.data && isMountedRef.current) {
        // Filter files based on accepted file types
        const filteredFiles =
          result.data.files?.filter(file => {
            const fileType = getFileType(file);
            return acceptedFileTypes.includes(fileType);
          }) || [];
        setExistingImages(prev => [...prev, ...filteredFiles]);
        setNextCursor(result.data.next_cursor);
      }
    } catch (error) {
      console.error('Error loading more files:', error);
    } finally {
      if (isMountedRef.current) {
        setLoadingMore(false);
      }
    }
  };

  // Cleanup effect to prevent state updates after unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  console.log('existingImages', existingImages);

  const handleUpload = async () => {
    if (!uploadFile) return;

    const fileType = getFileType(uploadFile);
    if (!acceptedFileTypes.includes(fileType)) {
      console.error('File type not accepted:', fileType);
      return;
    }

    try {
      const result = await uploadFileHook({
        file: uploadFile,
        folder: 'programs/images',
        tags: ['program', fileType],
        resource_type:
          fileType === 'video'
            ? 'video'
            : fileType === 'image'
              ? 'image'
              : 'raw',
        // No transformation - preserve original quality and dimensions
      });

      if (result.success && result.data) {
        // Add the new file to the existing list
        setExistingImages(prev => [result.data!, ...prev]);
        onSelect(result.data.secure_url);
        onClose();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const refreshFiles = () => {
    setError(null);
    setLoading(true);
    setNextCursor(undefined);
    setExistingImages([]);
  };

  // Filter files based on search query and file type
  const filteredFiles = existingImages.filter(file => {
    const matchesSearch =
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags?.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType =
      selectedFileType === 'all' || getFileType(file) === selectedFileType;
    return matchesSearch && matchesType;
  });

  // Get unique file types from existing files
  const availableFileTypes = [
    'all',
    ...new Set(existingImages.map(file => getFileType(file))),
  ];

  const handleSelectExisting = (url: string) => {
    setSelectedImage(url);
    onSelect(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[70vh] overflow-hidden'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue='existing' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='existing'>Existing Files</TabsTrigger>
            <TabsTrigger value='upload'>Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value='existing' className='mt-4'>
            <div className='max-h-80 overflow-y-auto'>
              {loading ? (
                <div className='flex items-center justify-center h-32'>
                  <div className='flex items-center gap-2 text-gray-500'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500'></div>
                    Loading files...
                  </div>
                </div>
              ) : error ? (
                <div className='flex flex-col items-center justify-center h-32 text-center'>
                  <div className='text-red-500 mb-2'>Failed to load files</div>
                  <div className='text-sm text-gray-500 mb-3'>{error}</div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setError(null);
                      // Trigger reload by toggling loading state
                      setLoading(true);
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : existingImages.length === 0 ? (
                <div className='flex items-center justify-center h-32'>
                  <div className='text-gray-500'>No files found</div>
                </div>
              ) : (
                <>
                  {/* Search and Filter Controls */}
                  <div className='space-y-3 mb-4'>
                    <div className='flex gap-2'>
                      <Input
                        placeholder='Search files...'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className='flex-1'
                      />
                      <Select
                        value={selectedFileType}
                        onValueChange={setSelectedFileType}
                      >
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFileTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type === 'all'
                                ? 'All Types'
                                : type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='flex justify-between items-center'>
                      <div className='text-sm text-gray-600'>
                        Showing {filteredFiles.length} of{' '}
                        {existingImages.length} files
                        {totalCount > 0 && ` (${totalCount} total)`}
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={refreshFiles}
                          disabled={loading}
                        >
                          Refresh
                        </Button>
                        {nextCursor && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={loadMoreFiles}
                            disabled={loadingMore}
                          >
                            {loadingMore ? (
                              <>
                                <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mr-2'></div>
                                Loading...
                              </>
                            ) : (
                              'Load More'
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* File Grid */}
                  {filteredFiles.length === 0 ? (
                    <div className='flex items-center justify-center h-32'>
                      <div className='text-gray-500'>
                        {searchQuery || selectedFileType !== 'all'
                          ? 'No files match your filters'
                          : 'No files found'}
                      </div>
                    </div>
                  ) : (
                    <div className='grid grid-cols-3 gap-3'>
                      {filteredFiles.map(file => (
                        <FilePreview
                          key={file.public_id}
                          file={file}
                          isSelected={selectedImage === file.secure_url}
                          onClick={() => handleSelectExisting(file.secure_url)}
                        />
                      ))}
                    </div>
                  )}
                  {loadingMore && (
                    <div className='flex items-center justify-center py-4'>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2'></div>
                      <span className='text-sm text-gray-500'>
                        Loading more files...
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value='upload' className='mt-4'>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='file-upload'>Upload File</Label>
                <Input
                  id='file-upload'
                  type='file'
                  accept={acceptedFileTypes.includes('image') ? 'image/*,' : ''}
                  onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  className='mt-1'
                />
                <div className='text-xs text-gray-500 mt-1'>
                  Accepted types: {acceptedFileTypes.join(', ')}
                </div>
              </div>

              {uploadFile && (
                <div className='space-y-4 flex flex-col items-center'>
                  <div className='text-sm text-gray-600'>Preview:</div>
                  <div className='w-42 h-42 rounded-lg overflow-hidden border'>
                    {(() => {
                      const fileType = getFileType(uploadFile);
                      const fileUrl = URL.createObjectURL(uploadFile);

                      if (fileType === 'image') {
                        return (
                          <Image
                            src={fileUrl}
                            alt='Preview'
                            className='w-full h-full object-cover'
                            width={128}
                            height={128}
                          />
                        );
                      } else if (fileType === 'video') {
                        return (
                          <div className='relative w-full h-full flex items-center justify-center'>
                            <video
                              src={fileUrl}
                              className='w-full h-full object-cover'
                              muted
                              preload='metadata'
                            />
                            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30'>
                              <Play className='h-8 w-8 text-white' />
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className='flex flex-col items-center justify-center p-4 h-full'>
                            <div className='text-4xl mb-2'>
                              {getFileIcon(fileType)}
                            </div>
                            <div className='text-xs text-gray-600 text-center'>
                              {fileType.toUpperCase()}
                            </div>
                            <div className='text-xs text-gray-500 mt-1'>
                              {uploadFile.name}
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className='w-full'
                  >
                    {isUploading ? (
                      <>
                        <Upload className='h-4 w-4 mr-2 animate-spin' />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className='h-4 w-4 mr-2' />
                        Upload File
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
