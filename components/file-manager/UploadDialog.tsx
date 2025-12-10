'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { CloudinaryFile } from '@/types/file';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  File,
  Image,
  Video,
  FileText,
  Plus,
  X,
  Tag,
  RefreshCw,
} from 'lucide-react';

interface UploadDialogProps {
  onUploadSuccess?: (file: CloudinaryFile) => void;
  trigger?: React.ReactNode;
  defaultFolder?: string;
}

interface FileMetadata {
  title: string;
  description: string;
  tags: string[];
  author: string;
  category: string;
}

const FILE_TYPE_ICONS = {
  image: Image,
  video: Video,
  raw: FileText,
  auto: File,
};

const FILE_TYPE_LABELS = {
  image: 'Images',
  video: 'Videos',
  raw: 'Documents',
  auto: 'All Types',
};

const SUPPORTED_FORMATS = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
  video: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v'],
  raw: [
    'pdf',
    'doc',
    'docx',
    'txt',
    'rtf',
    'odt',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'zip',
    'rar',
    '7z',
  ],
};

const CATEGORIES = [
  'General',
  'Documents',
  'Images',
  'Videos',
  'Archives',
  'Presentations',
  'Spreadsheets',
  'Code',
  'Design',
  'Other',
];

export function UploadDialog({
  onUploadSuccess,
  trigger,
  defaultFolder = 'uploads',
}: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [folderName, setFolderName] = useState(defaultFolder);
  const [resourceType, setResourceType] = useState<
    'image' | 'video' | 'raw' | 'auto'
  >('auto');
  const [metadata, setMetadata] = useState<FileMetadata>({
    title: '',
    description: '',
    tags: [],
    author: '',
    category: 'General',
  });
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('files');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, uploadProgress, uploadError, resetUpload } =
    useFileUpload({
      onUploadSuccess: file => {
        console.log('File uploaded successfully:', file);
        onUploadSuccess?.(file);
        handleClose();
      },
      onUploadError: error => {
        console.error('Upload error:', error);
      },
    });

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedFiles([]);
    setFolderName(defaultFolder);
    setMetadata({
      title: '',
      description: '',
      tags: [],
      author: '',
      category: 'General',
    });
    setNewTag('');
    setActiveTab('files');
    resetUpload();
  }, [defaultFolder, resetUpload]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setSelectedFiles(prev => [...prev, ...files]);
    },
    []
  );

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  }, [newTag, metadata.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      const tags = [
        ...metadata.tags,
        `category:${metadata.category}`,
        `author:${metadata.author || 'unknown'}`,
        'uploaded-via-dialog',
      ];

      const context = {
        title: metadata.title || file.name,
        description: metadata.description,
        author: metadata.author,
        category: metadata.category,
      };

      await uploadFile({
        file,
        folder: folderName,
        tags,
        context,
        resource_type: resourceType === 'auto' ? undefined : resourceType,
      });
    }
  }, [selectedFiles, metadata, folderName, resourceType, uploadFile]);

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (SUPPORTED_FORMATS.image.includes(extension || '')) return Image;
    if (SUPPORTED_FORMATS.video.includes(extension || '')) return Video;
    if (SUPPORTED_FORMATS.raw.includes(extension || '')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Upload className='w-4 h-4 mr-2' />
            Upload Files
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Upload className='w-5 h-5' />
            Upload Files
          </DialogTitle>
          <DialogDescription>
            Upload files with metadata directly to Cloudinary. Files will be
            organized by folder path.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='files' className='flex items-center gap-2'>
              <File className='w-4 h-4' />
              Files
            </TabsTrigger>
            <TabsTrigger value='metadata' className='flex items-center gap-2'>
              <Tag className='w-4 h-4' />
              Metadata
            </TabsTrigger>
          </TabsList>

          {/* Files Tab */}
          <TabsContent value='files' className='space-y-4'>
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <div className='flex-1'>
                  <Label htmlFor='file-type'>File Type Filter</Label>
                  <Select
                    value={resourceType}
                    onValueChange={(value: any) => setResourceType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FILE_TYPE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className='flex items-center gap-2'>
                              {React.createElement(
                                FILE_TYPE_ICONS[
                                  value as keyof typeof FILE_TYPE_ICONS
                                ],
                                {
                                  className: 'w-4 h-4',
                                }
                              )}
                              {label}
                            </div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex-1'>
                  <Label htmlFor='folder'>Cloudinary Folder Path</Label>
                  <Input
                    id='folder'
                    placeholder='e.g., uploads/images (optional)'
                    value={folderName}
                    onChange={e => setFolderName(e.target.value)}
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    Files will be uploaded to this Cloudinary folder path
                  </p>
                </div>
              </div>

              <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  onChange={handleFileSelect}
                  className='hidden'
                  accept={
                    resourceType === 'auto'
                      ? '*/*'
                      : SUPPORTED_FORMATS[resourceType]
                          .map(ext => `.${ext}`)
                          .join(',')
                  }
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant='outline'
                  className='mb-4'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Select Files
                </Button>
                <p className='text-sm text-gray-500'>
                  Drag and drop files here, or click to select
                </p>
                <p className='text-xs text-gray-400 mt-1'>
                  Supported:{' '}
                  {resourceType === 'auto'
                    ? 'All file types'
                    : SUPPORTED_FORMATS[
                        resourceType as keyof typeof SUPPORTED_FORMATS
                      ].join(', ')}
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='font-medium'>
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <div className='space-y-2 max-h-40 overflow-y-auto'>
                    {selectedFiles.map((file, index) => {
                      const IconComponent = getFileIcon(file);
                      return (
                        <div
                          key={`${file.name}-${index}`}
                          className='flex items-center justify-between p-2 border rounded-lg'
                        >
                          <div className='flex items-center gap-3'>
                            <IconComponent className='w-5 h-5 text-gray-500' />
                            <div>
                              <p className='font-medium text-sm'>{file.name}</p>
                              <p className='text-xs text-gray-500'>
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleRemoveFile(index)}
                            className='text-red-600 hover:text-red-700'
                          >
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {uploadError && (
                <Alert variant='destructive'>
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}

              {uploadProgress && (
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Uploading...</span>
                    <span>{uploadProgress.percentage}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${uploadProgress.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value='metadata' className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  placeholder='File title (optional)'
                  value={metadata.title}
                  onChange={e =>
                    setMetadata(prev => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='author'>Author</Label>
                <Input
                  id='author'
                  placeholder='Author name (optional)'
                  value={metadata.author}
                  onChange={e =>
                    setMetadata(prev => ({ ...prev, author: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='File description (optional)'
                value={metadata.description}
                onChange={e =>
                  setMetadata(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category'>Category</Label>
              <Select
                value={metadata.category}
                onValueChange={value =>
                  setMetadata(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Tags</Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='Add a tag'
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} variant='outline'>
                  <Plus className='w-4 h-4' />
                </Button>
              </div>
              {metadata.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {metadata.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {tag}
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemoveTag(tag)}
                        className='h-auto p-0 ml-1'
                      >
                        <X className='w-3 h-3' />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className='flex justify-between'>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <div className='flex gap-2'>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                <Upload className='w-4 h-4 mr-2' />
              )}
              {isUploading
                ? 'Uploading...'
                : `Upload ${selectedFiles.length} Files`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
