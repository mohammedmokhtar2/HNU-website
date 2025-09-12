'use client';

import React from 'react';
import { CloudinaryFile } from '@/types/file';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Eye,
  Download,
  Calendar,
  User,
  Tag,
  File,
  Image as ImageIcon,
  Video,
  FileText,
  HardDrive,
  Link,
  Copy,
} from 'lucide-react';
import Image from 'next/image';

interface FileDetailsDialogProps {
  file: CloudinaryFile;
  trigger?: React.ReactNode;
}

const FILE_TYPE_ICONS = {
  image: ImageIcon,
  video: Video,
  raw: FileText,
  auto: File,
};

export function FileDetailsDialog({ file, trigger }: FileDetailsDialogProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getFileIcon = () => {
    const IconComponent = FILE_TYPE_ICONS[file.resource_type] || File;
    return <IconComponent className='w-8 h-8 text-gray-500' />;
  };

  const getFileTags = () => {
    return file.tags || [];
  };

  const getFileContext = () => {
    return file.context || {};
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='ghost' size='sm'>
            <Eye className='w-4 h-4' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            {getFileIcon()}
            <div>
              <h2 className='text-xl font-bold'>{file.filename}</h2>
              <p className='text-sm text-gray-500 font-normal'>
                {file.resource_type.toUpperCase()} •{' '}
                {formatFileSize(file.bytes)}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription>
            View file details, metadata, and download options
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='preview' className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='metadata'>Metadata</TabsTrigger>
            <TabsTrigger value='sharing'>Sharing</TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value='preview' className='space-y-4'>
            <div className='space-y-4'>
              {file.resource_type === 'image' ? (
                <div className='relative'>
                  <Image
                    src={file.secure_url}
                    alt={file.filename}
                    width={800}
                    height={600}
                    className='w-full h-auto rounded-lg border'
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                </div>
              ) : file.resource_type === 'video' ? (
                <div className='relative'>
                  <video
                    src={file.secure_url}
                    controls
                    className='w-full rounded-lg border'
                    style={{ maxHeight: '500px' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className='flex items-center justify-center h-64 bg-gray-100 rounded-lg'>
                  <div className='text-center'>
                    {getFileIcon()}
                    <p className='mt-2 text-gray-500'>Preview not available</p>
                    <p className='text-sm text-gray-400'>
                      {file.format.toUpperCase()} file
                    </p>
                  </div>
                </div>
              )}

              <div className='flex gap-2'>
                <Button
                  onClick={() => window.open(file.secure_url, '_blank')}
                  className='flex-1'
                >
                  <Eye className='w-4 h-4 mr-2' />
                  View Full Size
                </Button>
                <Button
                  onClick={() => window.open(file.secure_url, '_blank')}
                  variant='outline'
                  className='flex-1'
                >
                  <Download className='w-4 h-4 mr-2' />
                  Download
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value='details' className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h3 className='font-medium'>File Information</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Name:</span>
                    <span className='font-medium'>{file.filename}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Type:</span>
                    <Badge variant='outline'>{file.resource_type}</Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Format:</span>
                    <Badge variant='secondary'>{file.format}</Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Size:</span>
                    <span className='font-medium'>
                      {formatFileSize(file.bytes)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Created:</span>
                    <span className='font-medium'>
                      {formatDate(file.created_at)}
                    </span>
                  </div>
                  {file.folder && (
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>Folder:</span>
                      <Badge variant='outline'>{file.folder}</Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='font-medium'>Technical Details</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Public ID:</span>
                    <div className='flex items-center gap-2'>
                      <code className='text-xs bg-gray-100 px-2 py-1 rounded'>
                        {file.public_id}
                      </code>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => copyToClipboard(file.public_id)}
                      >
                        <Copy className='w-3 h-3' />
                      </Button>
                    </div>
                  </div>
                  {file.width && file.height && (
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>Dimensions:</span>
                      <span className='font-medium'>
                        {file.width} × {file.height}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>URL:</span>
                    <div className='flex items-center gap-2'>
                      <code className='text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-32'>
                        {file.secure_url}
                      </code>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => copyToClipboard(file.secure_url)}
                      >
                        <Copy className='w-3 h-3' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value='metadata' className='space-y-4'>
            <div className='space-y-6'>
              <div>
                <h3 className='font-medium mb-3'>Tags</h3>
                {getFileTags().length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {getFileTags().map(tag => (
                      <Badge key={tag} variant='secondary'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 text-sm'>No tags assigned</p>
                )}
              </div>

              <div>
                <h3 className='font-medium mb-3'>Context Data</h3>
                {Object.keys(getFileContext()).length > 0 ? (
                  <div className='space-y-2'>
                    {Object.entries(getFileContext()).map(([key, value]) => (
                      <div
                        key={key}
                        className='flex justify-between py-2 border-b'
                      >
                        <span className='text-gray-500 capitalize'>{key}:</span>
                        <span className='font-medium'>{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 text-sm'>
                    No context data available
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Sharing Tab */}
          <TabsContent value='sharing' className='space-y-4'>
            <div className='space-y-6'>
              <div>
                <h3 className='font-medium mb-3'>Public URL</h3>
                <div className='flex gap-2'>
                  <code className='flex-1 text-xs bg-gray-100 px-3 py-2 rounded'>
                    {file.secure_url}
                  </code>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => copyToClipboard(file.secure_url)}
                  >
                    <Copy className='w-4 h-4' />
                  </Button>
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  This URL is publicly accessible and can be shared
                </p>
              </div>

              <div>
                <h3 className='font-medium mb-3'>Direct Link</h3>
                <div className='flex gap-2'>
                  <code className='flex-1 text-xs bg-gray-100 px-3 py-2 rounded'>
                    {file.url}
                  </code>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => copyToClipboard(file.url)}
                  >
                    <Copy className='w-4 h-4' />
                  </Button>
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  Direct link to the file (HTTP)
                </p>
              </div>

              <div className='p-4 bg-blue-50 rounded-lg'>
                <h4 className='font-medium text-blue-900 mb-2'>
                  Sharing Options
                </h4>
                <ul className='text-sm text-blue-800 space-y-1'>
                  <li>• Copy the URL to share with others</li>
                  <li>• Files are publicly accessible via the URL</li>
                  <li>• Use Cloudinary transformations for different sizes</li>
                  <li>• Consider privacy settings for sensitive files</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
