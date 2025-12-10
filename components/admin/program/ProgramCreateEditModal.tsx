'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  FileText,
  Eye,
  Download,
} from 'lucide-react';
import { ProgramWithRelations } from '@/types/program';
import { useCollege } from '@/contexts/CollegeContext';
import { ProgramService } from '@/services/program.service';
import { useToast } from '@/hooks/use-toast';
import { UploadDialog } from '@/components/file-manager/UploadDialog';
import { ImageSelectorModal } from '@/components/ui/image-selector-modal';
import { CloudinaryFile } from '@/types/file';
import Image from 'next/image';

const programSchema = z.object({
  name: z.object({
    en: z.string().min(1, 'English name is required'),
    ar: z.string().min(1, 'Arabic name is required'),
  }),
  description: z
    .object({
      en: z.string().optional(),
      ar: z.string().optional(),
    })
    .optional(),
  collageId: z.string().min(1, 'College is required'),
  config: z
    .object({
      degree: z.string().optional(),
      duration: z.string().optional(),
      credits: z.number().optional(),
      images: z.array(z.string()).optional(),
      videos: z.array(z.string()).optional(),
      pdfs: z.array(z.string()).optional(),
      links: z
        .array(
          z.object({
            title: z.string(),
            href: z.string().url(),
          })
        )
        .optional(),
    })
    .optional(),
});

type ProgramFormData = z.infer<typeof programSchema>;

interface ProgramCreateEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  program: ProgramWithRelations | null;
}

export function ProgramCreateEditModal({
  open,
  onOpenChange,
  onSaved,
  program,
}: ProgramCreateEditModalProps) {
  const { colleges } = useCollege();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<{ title: string; href: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [pdfs, setPdfs] = useState<string[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: { en: '', ar: '' },
      description: { en: '', ar: '' },
      collageId: '',
      config: {
        degree: '',
        duration: '',
        credits: undefined,
        images: [],
        videos: [],
        pdfs: [],
        links: [],
      },
    },
  });

  const isEdit = !!program;

  useEffect(() => {
    if (program) {
      form.reset({
        name: program.name || { en: '', ar: '' },
        description: program.description || { en: '', ar: '' },
        collageId: program.collageId || '',
        config: {
          degree: program.config?.degree || '',
          duration: program.config?.duration || '',
          credits: program.config?.credits || undefined,
          images: program.config?.images || [],
          videos: program.config?.videos || [],
          pdfs: program.config?.pdfs || [],
          links: program.config?.links || [],
        },
      });
      setLinks(program.config?.links || []);
      setImages(program.config?.images || []);
      setVideos(program.config?.videos || []);
      setPdfs(program.config?.pdfs || []);
    } else {
      form.reset({
        name: { en: '', ar: '' },
        description: { en: '', ar: '' },
        collageId: '',
        config: {
          degree: '',
          duration: '',
          credits: undefined,
          images: [],
          videos: [],
          pdfs: [],
          links: [],
        },
      });
      setLinks([]);
      setImages([]);
      setVideos([]);
      setPdfs([]);
    }
  }, [program, form]);

  const addLink = () => {
    setLinks([...links, { title: '', href: '' }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (
    index: number,
    field: 'title' | 'href',
    value: string
  ) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const handleFileUpload = (file: CloudinaryFile, type: 'videos' | 'pdfs') => {
    const url = file.secure_url;
    switch (type) {
      case 'videos':
        setVideos(prev => [...prev, url]);
        break;
      case 'pdfs':
        setPdfs(prev => [...prev, url]);
        break;
    }
  };

  const handleImageSelect = (url: string) => {
    setImages(prev => [...prev, url]);
  };

  const removeFile = (index: number, type: 'images' | 'videos' | 'pdfs') => {
    switch (type) {
      case 'images':
        setImages(prev => prev.filter((_, i) => i !== index));
        break;
      case 'videos':
        setVideos(prev => prev.filter((_, i) => i !== index));
        break;
      case 'pdfs':
        setPdfs(prev => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const onSubmit = async (data: ProgramFormData) => {
    try {
      setLoading(true);

      const programData = {
        ...data,
        config: {
          ...data.config,
          images,
          videos,
          pdfs,
          links: links.filter(link => link.title && link.href),
        },
      };

      if (isEdit) {
        await ProgramService.updateProgram(program!.id, programData);
        toast({
          title: 'Success',
          description: 'Program updated successfully',
        });
      } else {
        await ProgramService.createProgram(programData);
        toast({
          title: 'Success',
          description: 'Program created successfully',
        });
      }

      onSaved();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Program' : 'Create New Program'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Program Names */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name.en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name (English) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter program name in English'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name.ar'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name (Arabic) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='أدخل اسم البرنامج بالعربية'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Program Descriptions */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='description.en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (English)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter program description in English'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description.ar'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Arabic)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='أدخل وصف البرنامج بالعربية'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* College Selection */}
            <FormField
              control={form.control}
              name='collageId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a college' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colleges.map(college => (
                        <SelectItem key={college.id} value={college.id}>
                          {college.name?.en || college.name?.ar || college.slug}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Program Configuration */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Program Configuration</h3>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='config.degree'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., Bachelor of Science'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='config.duration'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., 4 years' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='config.credits'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credits</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='e.g., 120'
                          {...field}
                          onChange={e =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* File Uploads */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>Program Files</h4>

                {/* Images */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='flex items-center gap-2'>
                      <ImageIcon className='h-4 w-4' />
                      Images
                    </FormLabel>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => setShowImageSelector(true)}
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Select Images
                    </Button>
                  </div>
                  {images.length > 0 && (
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                      {images.map((url, index) => (
                        <div key={index} className='relative group'>
                          <Image
                            width={100}
                            height={100}
                            src={url}
                            alt={`Program image ${index + 1}`}
                            className='w-full h-20 object-cover rounded border'
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity'
                            onClick={() => removeFile(index, 'images')}
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Videos */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='flex items-center gap-2'>
                      <Video className='h-4 w-4' />
                      Videos
                    </FormLabel>
                    <UploadDialog
                      onUploadSuccess={file => handleFileUpload(file, 'videos')}
                      defaultFolder='programs/videos'
                      trigger={
                        <Button type='button' variant='outline' size='sm'>
                          <Plus className='h-4 w-4 mr-2' />
                          Upload Videos
                        </Button>
                      }
                    />
                  </div>
                  {videos.length > 0 && (
                    <div className='space-y-2'>
                      {videos.map((url, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-2 border rounded'
                        >
                          <div className='flex items-center gap-2'>
                            <Video className='h-4 w-4 text-muted-foreground' />
                            <span className='text-sm truncate'>
                              {url.split('/').pop()}
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => window.open(url, '_blank')}
                            >
                              <Eye className='h-3 w-3' />
                            </Button>
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              onClick={() => removeFile(index, 'videos')}
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PDFs */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='flex items-center gap-2'>
                      <FileText className='h-4 w-4' />
                      PDFs (لوايح)
                    </FormLabel>
                    <UploadDialog
                      onUploadSuccess={file => handleFileUpload(file, 'pdfs')}
                      defaultFolder='programs/pdfs'
                      trigger={
                        <Button type='button' variant='outline' size='sm'>
                          <Plus className='h-4 w-4 mr-2' />
                          Upload PDFs
                        </Button>
                      }
                    />
                  </div>
                  {pdfs.length > 0 && (
                    <div className='space-y-2'>
                      {pdfs.map((url, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-2 border rounded'
                        >
                          <div className='flex items-center gap-2'>
                            <FileText className='h-4 w-4 text-muted-foreground' />
                            <span className='text-sm truncate'>
                              {url.split('/').pop()}
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => window.open(url, '_blank')}
                            >
                              <Eye className='h-3 w-3' />
                            </Button>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => window.open(url, '_blank')}
                            >
                              <Download className='h-3 w-3' />
                            </Button>
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              onClick={() => removeFile(index, 'pdfs')}
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <FormLabel>Links</FormLabel>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addLink}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Add Link
                  </Button>
                </div>
                {links.map((link, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input
                      placeholder='Link title'
                      value={link.title}
                      onChange={e => updateLink(index, 'title', e.target.value)}
                    />
                    <Input
                      placeholder='https://example.com'
                      value={link.href}
                      onChange={e => updateLink(index, 'href', e.target.value)}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeLink(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={loading}>
                {loading
                  ? 'Saving...'
                  : isEdit
                    ? 'Update Program'
                    : 'Create Program'}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {/* Image Selector Modal */}
        <ImageSelectorModal
          isOpen={showImageSelector}
          onClose={() => setShowImageSelector(false)}
          onSelect={handleImageSelect}
        />
      </DialogContent>
    </Dialog>
  );
}
