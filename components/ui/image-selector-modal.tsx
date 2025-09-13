'use client';

import React, { useState, useEffect } from 'react';
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
import { FileService } from '@/services/file.service';
import { CloudinaryFile } from '@/types/file';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useFileUpload } from '@/hooks/use-file-upload';

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
}

export function ImageSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
}: ImageSelectorModalProps) {
  const [existingImages, setExistingImages] = useState<CloudinaryFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentValue || null
  );
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { uploadFile: uploadFileHook, isUploading } = useFileUpload();

  useEffect(() => {
    if (isOpen) {
      loadExistingImages();
    }
  }, [isOpen]);

  const loadExistingImages = async () => {
    try {
      setLoading(true);
      const result = await FileService.listFiles({
        folder: 'university-logos',
        resource_type: 'image',
        max_results: 50,
      });

      if (result.success && result.data) {
        setExistingImages(result.data.files || []);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    try {
      const result = await uploadFileHook({
        file: uploadFile,
        folder: 'university-logos',
        tags: ['logo', 'university'],
        // No transformation - preserve original quality and dimensions
      });

      if (result.success && result.data) {
        onSelect(result.data.secure_url);
        onClose();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSelectExisting = (url: string) => {
    setSelectedImage(url);
    onSelect(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[70vh] overflow-hidden'>
        <DialogHeader>
          <DialogTitle>Select or Upload Logo</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue='existing' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='existing'>Existing Images</TabsTrigger>
            <TabsTrigger value='upload'>Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value='existing' className='mt-4'>
            <div className='max-h-80 overflow-y-auto'>
              {loading ? (
                <div className='flex items-center justify-center h-32'>
                  <div className='text-gray-500'>Loading images...</div>
                </div>
              ) : existingImages.length === 0 ? (
                <div className='flex items-center justify-center h-32'>
                  <div className='text-gray-500'>No images found</div>
                </div>
              ) : (
                <div className='grid grid-cols-3 gap-3'>
                  {existingImages.map(image => (
                    <div
                      key={image.public_id}
                      className={cn(
                        'relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:border-blue-500',
                        selectedImage === image.secure_url
                          ? 'border-blue-500'
                          : 'border-gray-200'
                      )}
                      onClick={() => handleSelectExisting(image.secure_url)}
                    >
                      <Image
                        src={image.secure_url}
                        alt='Logo option'
                        className='w-full object-cover'
                        width={150}
                        height={150}
                      />
                      {selectedImage === image.secure_url && (
                        <div className='absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center'>
                          <Check className='h-6 w-6 text-blue-600' />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='upload' className='mt-4'>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='logo-upload'>Upload Logo</Label>
                <Input
                  id='logo-upload'
                  type='file'
                  accept='image/*'
                  onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  className='mt-1'
                />
              </div>

              {uploadFile && (
                <div className='space-y-4 flex flex-col items-center'>
                  <div className='text-sm text-gray-600'>Preview:</div>
                  <div className='w-42 h-42  rounded-lg overflow-hidden'>
                    <Image
                      src={URL.createObjectURL(uploadFile)}
                      alt='Preview'
                      className='w-full h-full object-cover'
                      width={128}
                      height={128}
                    />
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
                        Upload Logo
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
