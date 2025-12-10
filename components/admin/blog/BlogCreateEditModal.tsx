'use client';

import React, { useState, useEffect } from 'react';
import { useBlogMutations } from '@/contexts/BlogContext';
import { useUser } from '@/contexts/userContext';
import {
  BlogWithRelations,
  CreateBlogInput,
  UpdateBlogInput,
} from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  X,
  Image as ImageIcon,
  Calendar,
  Building,
  User,
  Tag,
  Globe,
  Star,
  Eye,
} from 'lucide-react';
import { ImageSelectorModal } from '@/components/ui/image-selector-modal';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { EventConfigForm } from './EventConfigForm';
import { EventConfig, EventType, EventStatus } from '@/types/event';

interface BlogCreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog?: BlogWithRelations | null;
  universityId?: string;
  collegeId?: string;
  availableColleges: any[];
  onSuccess: () => void;
}

export function BlogCreateEditModal({
  isOpen,
  onClose,
  blog,
  universityId,
  collegeId,
  availableColleges,
  onSuccess,
}: BlogCreateEditModalProps) {
  const { user } = useUser();
  const { createBlog, updateBlog } = useBlogMutations();
  const { toast } = useToast();

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    titleEn: '',
    titleAr: '',
    contentEn: '',
    contentAr: '',
    slug: '',
    images: [] as string[],
    tags: [] as string[],
    newTag: '',
    isPublished: false,
    isFeatured: false,
    publishedAt: '',
    scheduledAt: '',
    order: 0,
    universityId: universityId || '',
    collageId: collegeId || '',
    isEvent: false,
    eventConfig: null as EventConfig | null,
  });

  const isEditing = !!blog;

  // Initialize form with blog data when editing
  useEffect(() => {
    if (isEditing && blog) {
      const title = typeof blog.title === 'object' ? blog.title : {};
      const content = typeof blog.content === 'object' ? blog.content : {};
      const eventConfig = blog.eventConfig as EventConfig | null;

      setFormData({
        titleEn: (title as any).en || '',
        titleAr: (title as any).ar || '',
        contentEn: (content as any).en || '',
        contentAr: (content as any).ar || '',
        slug: blog.slug,
        images: blog.image || [],
        tags: blog.tags || [],
        newTag: '',
        isPublished: blog.isPublished,
        isFeatured: blog.isFeatured,
        publishedAt: blog.publishedAt
          ? new Date(blog.publishedAt).toISOString().slice(0, 16)
          : '',
        scheduledAt: blog.scheduledAt
          ? new Date(blog.scheduledAt).toISOString().slice(0, 16)
          : '',
        order: blog.order,
        universityId: blog.universityId || universityId || 'none',
        collageId: blog.collageId || collegeId || 'none',
        isEvent: blog.isEvent || false,
        eventConfig: eventConfig,
      });
    } else if (!isEditing) {
      setFormData({
        titleEn: '',
        titleAr: '',
        contentEn: '',
        contentAr: '',
        slug: '',
        images: [],
        tags: [],
        newTag: '',
        isPublished: false,
        isFeatured: false,
        publishedAt: '',
        scheduledAt: '',
        order: 0,
        universityId: universityId || 'none',
        collageId: collegeId || 'none',
        isEvent: false,
        eventConfig: null,
      });
    }
  }, [isEditing, blog, universityId, collegeId]);

  // Auto-generate slug from English title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleEnChange = (value: string) => {
    setFormData(prev => ({ ...prev, titleEn: value }));
    if (!isEditing) {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleAddTag = () => {
    const newTag = formData.newTag?.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
        newTag: '',
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleAddImage = (imageUrl: string) => {
    if (selectedImageIndex !== null) {
      // Replace existing image
      const newImages = [...formData.images];
      newImages[selectedImageIndex] = imageUrl;
      setFormData(prev => ({ ...prev, images: newImages }));
    } else {
      // Add new image
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
    }
    setShowImageModal(false);
    setSelectedImageIndex(null);
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const blogData: CreateBlogInput = {
        title: {
          en: formData.titleEn,
          ar: formData.titleAr,
        },
        content: {
          en: formData.contentEn,
          ar: formData.contentAr,
        },
        slug: formData.slug,
        image: formData.images,
        tags: formData.tags,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
        publishedAt: formData.publishedAt
          ? new Date(formData.publishedAt)
          : null,
        scheduledAt: formData.scheduledAt
          ? new Date(formData.scheduledAt)
          : null,
        order: formData.order,
        universityId:
          formData.universityId && formData.universityId !== 'none'
            ? formData.universityId
            : null,
        collageId:
          formData.collageId && formData.collageId !== 'none'
            ? formData.collageId
            : null,
        createdById: user?.id,
        isEvent: formData.isEvent,
        eventConfig: formData.eventConfig,
      };

      if (isEditing && blog) {
        await updateBlog(blog.id, blogData as any);
        toast({
          title: 'Success',
          description: 'Blog updated successfully',
        });
      } else {
        await createBlog(blogData);
        toast({
          title: 'Success',
          description: 'Blog created successfully',
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save blog',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Blog' : 'Create New Blog'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <Tabs defaultValue='content' className='w-full'>
              <TabsList className='grid w-full grid-cols-5'>
                <TabsTrigger value='content'>Content</TabsTrigger>
                <TabsTrigger value='media'>Media</TabsTrigger>
                <TabsTrigger value='settings'>Settings</TabsTrigger>
                <TabsTrigger value='event'>Event</TabsTrigger>
                <TabsTrigger value='publish'>Publish</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value='content' className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='titleEn'>Title (English) *</Label>
                    <Input
                      id='titleEn'
                      value={formData.titleEn}
                      onChange={e => handleTitleEnChange(e.target.value)}
                      placeholder='Enter English title'
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='titleAr'>Title (Arabic) *</Label>
                    <Input
                      id='titleAr'
                      value={formData.titleAr}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          titleAr: e.target.value,
                        }))
                      }
                      placeholder='Enter Arabic title'
                      dir='rtl'
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='slug'>Slug *</Label>
                  <Input
                    id='slug'
                    value={formData.slug}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder='blog-url-slug'
                    className='font-mono'
                    required
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='contentEn'>Content (English) *</Label>
                    <Textarea
                      id='contentEn'
                      value={formData.contentEn}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          contentEn: e.target.value,
                        }))
                      }
                      placeholder='Enter English content'
                      rows={8}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='contentAr'>Content (Arabic) *</Label>
                    <Textarea
                      id='contentAr'
                      value={formData.contentAr}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          contentAr: e.target.value,
                        }))
                      }
                      placeholder='Enter Arabic content'
                      rows={8}
                      dir='rtl'
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value='media' className='space-y-4'>
                <div>
                  <Label className='text-sm font-medium'>Images</Label>
                  <div className='mt-2 space-y-4'>
                    {formData.images.map((image, index) => (
                      <Card key={index} className='p-4'>
                        <div className='flex items-center gap-4'>
                          <Image
                            width={80}
                            height={80}
                            src={image}
                            alt={`Blog image ${index + 1}`}
                            className='w-20 h-20 object-cover rounded'
                          />
                          <div className='flex-1'>
                            <div className='text-sm font-medium'>
                              Image {index + 1}
                            </div>
                            <div className='text-xs text-muted-foreground truncate'>
                              {image}
                            </div>
                          </div>
                          <div className='flex gap-2'>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setSelectedImageIndex(index);
                                setShowImageModal(true);
                              }}
                            >
                              <ImageIcon className='h-4 w-4 mr-1' />
                              Replace
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        setSelectedImageIndex(null);
                        setShowImageModal(true);
                      }}
                      className='w-full'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add Image
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value='settings' className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='universityId'>University</Label>
                    <Select
                      value={formData.universityId}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, universityId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select university' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='none'>No university</SelectItem>
                        {/* Add university options here */}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='collageId'>College</Label>
                    <Select
                      value={formData.collageId}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, collageId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select college' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='none'>No college</SelectItem>
                        {availableColleges.map(college => (
                          <SelectItem key={college.id} value={college.id}>
                            {String(college.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className='text-sm font-medium'>Tags</Label>
                  <div className='mt-2 space-y-2'>
                    <div className='flex gap-2'>
                      <Input
                        placeholder='Add a tag'
                        value={formData.newTag}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            newTag: e.target.value,
                          }))
                        }
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type='button' onClick={handleAddTag}>
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='flex items-center gap-1'
                        >
                          {tag}
                          <X
                            className='h-3 w-3 cursor-pointer'
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor='order'>Order (for featured content)</Label>
                  <Input
                    id='order'
                    type='number'
                    min='0'
                    value={formData.order}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </TabsContent>

              {/* Event Tab */}
              <TabsContent value='event' className='space-y-4'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <Label className='text-base flex items-center gap-2'>
                        <Calendar className='h-4 w-4' />
                        This is an Event
                      </Label>
                      <div className='text-sm text-muted-foreground'>
                        Enable event configuration for this blog
                      </div>
                    </div>
                    <Switch
                      checked={formData.isEvent}
                      onCheckedChange={checked =>
                        setFormData(prev => ({
                          ...prev,
                          isEvent: checked,
                          eventConfig: checked
                            ? {
                                eventDate: null,
                                eventEndDate: null,
                                location: null,
                                eventType: EventType.OTHER,
                                status: EventStatus.DRAFT,
                                metadata: {},
                              }
                            : null,
                        }))
                      }
                    />
                  </div>

                  {formData.isEvent && (
                    <EventConfigForm
                      eventConfig={formData.eventConfig}
                      onChange={eventConfig =>
                        setFormData(prev => ({ ...prev, eventConfig }))
                      }
                    />
                  )}
                </div>
              </TabsContent>

              {/* Publish Tab */}
              <TabsContent value='publish' className='space-y-4'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <Label className='text-base flex items-center gap-2'>
                        <Eye className='h-4 w-4' />
                        Publish Blog
                      </Label>
                      <div className='text-sm text-muted-foreground'>
                        Make this blog visible to the public
                      </div>
                    </div>
                    <Switch
                      checked={formData.isPublished}
                      onCheckedChange={checked =>
                        setFormData(prev => ({ ...prev, isPublished: checked }))
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <Label className='text-base flex items-center gap-2'>
                        <Star className='h-4 w-4' />
                        Featured Blog
                      </Label>
                      <div className='text-sm text-muted-foreground'>
                        Highlight this blog as featured content
                      </div>
                    </div>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={checked =>
                        setFormData(prev => ({ ...prev, isFeatured: checked }))
                      }
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='publishedAt'>Published Date</Label>
                      <Input
                        id='publishedAt'
                        type='datetime-local'
                        value={formData.publishedAt}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            publishedAt: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor='scheduledAt'>Scheduled Date</Label>
                      <Input
                        id='scheduledAt'
                        type='datetime-local'
                        value={formData.scheduledAt}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            scheduledAt: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className='flex justify-end gap-2 pt-4'>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Blog'
                    : 'Create Blog'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Selector Modal */}
      <ImageSelectorModal
        isOpen={showImageModal}
        onClose={() => {
          setShowImageModal(false);
          setSelectedImageIndex(null);
        }}
        onSelect={handleAddImage}
        currentValue=''
      />
    </>
  );
}
