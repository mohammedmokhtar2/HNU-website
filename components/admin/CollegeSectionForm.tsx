'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SectionType } from '@/types/enums';
import { useCollege } from '@/contexts/CollegeContext';
import { Save, Image as ImageIcon, Video, Link } from 'lucide-react';
import Image from 'next/image';
import { useBlogsAndEvents, getBlogTitle } from '@/hooks/use-blogs-events';

interface CollegeSectionFormProps {
  formData: {
    type: SectionType;
    content: any;
    order: number;
  };
  setFormData: (data: any) => void;
  onTypeChange: (type: SectionType) => void;
  onSubmit: () => void;
  onImageSelect: (field: string) => void;
  submitLabel: string;
}

const sectionTypeLabels = {
  [SectionType.HEADER]: 'Header',
  [SectionType.HERO]: 'Hero',
  [SectionType.ABOUT]: 'About',
  [SectionType.ACTIONS]: 'Actions',
  [SectionType.OUR_MISSION]: 'Our Mission',
  [SectionType.NUMBERS]: 'Numbers',
  [SectionType.STUDENT_UNION]: 'Student Union',
  [SectionType.COLLEGES_SECTION]: 'Colleges Section',
  [SectionType.EGYPT_STUDENT_GROUP]: 'Egypt Student Group',
  [SectionType.PRESIDENT]: 'President',
  [SectionType.BLOGS]: 'Blogs',
  [SectionType.PROGRAMS_SECTION]: 'Programs Section',
  [SectionType.CUSTOM]: 'Custom',
};

export function CollegeSectionForm({
  formData,
  setFormData,
  onTypeChange,
  onSubmit,
  onImageSelect,
  submitLabel,
}: CollegeSectionFormProps) {
  const { colleges, loading: collegesLoading } = useCollege();
  const { blogs, events, isLoading: loadingBlogsEvents } = useBlogsAndEvents();

  const renderContentFields = () => {
    const { type, content } = formData;

    switch (type) {
      case SectionType.HERO:
        return (
          <div className='space-y-4'>
            {/* Display Type Selector */}
            <div>
              <Label className='text-white'>Display Type</Label>
              <Select
                value={content.displayType || 'default'}
                onValueChange={value =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      displayType: value as 'default' | 'blog' | 'event',
                      linkedBlogId:
                        value === 'blog' ? content.linkedBlogId : undefined,
                      linkedEventId:
                        value === 'event' ? content.linkedEventId : undefined,
                    },
                  })
                }
              >
                <SelectTrigger className='bg-gray-700 text-white border-gray-600'>
                  <SelectValue placeholder='Select display type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='default'>Default (Static Content)</SelectItem>
                  <SelectItem value='blog'>Link to Blog</SelectItem>
                  <SelectItem value='event'>Link to Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Blog Selection */}
            {content.displayType === 'blog' && (
              <div className='bg-blue-900/30 p-4 rounded-lg space-y-4'>
                <div>
                  <Label className='text-white'>Select Blog</Label>
                  <Select
                    value={content.linkedBlogId || ''}
                    onValueChange={value =>
                      setFormData({
                        ...formData,
                        content: { ...content, linkedBlogId: value },
                      })
                    }
                  >
                    <SelectTrigger className='bg-gray-700 text-white border-gray-600'>
                      <SelectValue placeholder='Choose a blog to link' />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingBlogsEvents ? (
                        <SelectItem value='loading' disabled>
                          Loading blogs...
                        </SelectItem>
                      ) : blogs.length === 0 ? (
                        <SelectItem value='empty' disabled>
                          No published blogs found
                        </SelectItem>
                      ) : (
                        blogs.map(blog => (
                          <SelectItem key={blog.id} value={blog.id}>
                            {getBlogTitle(blog, 'en')} | {getBlogTitle(blog, 'ar')}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Event Selection */}
            {content.displayType === 'event' && (
              <div className='bg-green-900/30 p-4 rounded-lg space-y-4'>
                <div>
                  <Label className='text-white'>Select Event</Label>
                  <Select
                    value={content.linkedEventId || ''}
                    onValueChange={value =>
                      setFormData({
                        ...formData,
                        content: { ...content, linkedEventId: value },
                      })
                    }
                  >
                    <SelectTrigger className='bg-gray-700 text-white border-gray-600'>
                      <SelectValue placeholder='Choose an event to link' />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingBlogsEvents ? (
                        <SelectItem value='loading' disabled>
                          Loading events...
                        </SelectItem>
                      ) : events.length === 0 ? (
                        <SelectItem value='empty' disabled>
                          No published events found
                        </SelectItem>
                      ) : (
                        events.map(event => (
                          <SelectItem key={event.id} value={event.id}>
                            {getBlogTitle(event, 'en')} | {getBlogTitle(event, 'ar')}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Default Content Fields */}
            {(!content.displayType || content.displayType === 'default') && (
              <>
                <div>
                  <Label className='text-white'>Title (English)</Label>
                  <Input
                    value={content.title?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          title: { ...content.title, en: e.target.value },
                        },
                      })
                    }
                    placeholder='Enter English title'
                    className='bg-gray-700 text-white border-gray-600'
                  />
                </div>
                <div>
                  <Label className='text-white'>Title (Arabic)</Label>
                  <Input
                    value={content.title?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          title: { ...content.title, ar: e.target.value },
                        },
                      })
                    }
                    placeholder='Enter Arabic title'
                    className='bg-gray-700 text-white border-gray-600'
                  />
                </div>
                <div>
                  <Label className='text-white'>Content (English)</Label>
                  <Textarea
                    value={content.content?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          content: { ...content.content, en: e.target.value },
                        },
                      })
                    }
                    placeholder='Enter English content'
                    rows={4}
                    className='bg-gray-700 text-white border-gray-600'
                  />
                </div>
                <div>
                  <Label className='text-white'>Content (Arabic)</Label>
                  <Textarea
                    value={content.content?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          content: { ...content.content, ar: e.target.value },
                        },
                      })
                    }
                    placeholder='Enter Arabic content'
                    rows={4}
                    className='bg-gray-700 text-white border-gray-600'
                  />
                </div>
                <div>
                  <Label className='text-white'>Image URL</Label>
                  <div className='flex gap-2'>
                    <Input
                      value={content.imageUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: { ...content, imageUrl: e.target.value },
                        })
                      }
                      placeholder='Image URL'
                      className='bg-gray-700 text-white border-gray-600'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => onImageSelect('imageUrl')}
                      className='border-gray-600 text-gray-300 hover:bg-gray-700'
                    >
                      <ImageIcon className='h-4 w-4' />
                    </Button>
                  </div>
                  {content.imageUrl && (
                    <div className='mt-2'>
                      <Image
                        width={100}
                        height={100}
                        src={content.imageUrl}
                        alt='Preview'
                        className='w-32 h-24 object-cover rounded border'
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label className='text-white'>Video URL</Label>
                  <div className='flex gap-2'>
                    <Input
                      value={content.videoUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: { ...content, videoUrl: e.target.value },
                        })
                      }
                      placeholder='Video URL'
                      className='bg-gray-700 text-white border-gray-600'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => onImageSelect('videoUrl')}
                      className='border-gray-600 text-gray-300 hover:bg-gray-700'
                    >
                      <Video className='h-4 w-4' />
                    </Button>
                  </div>
                  {content.videoUrl && (
                    <div className='mt-2'>
                      <video
                        src={content.videoUrl}
                        className='w-32 h-24 object-cover rounded border'
                        controls
                        muted
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Custom Button Configuration */}
            <div className='border-t border-gray-600 pt-4'>
              <h4 className='font-medium text-white mb-3'>Button Configuration</h4>
              <div className='space-y-3'>
                <div>
                  <Label className='text-white'>Button Text (English) - Optional</Label>
                  <Input
                    value={content.buttonConfig?.text?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          buttonConfig: {
                            ...content.buttonConfig,
                            text: {
                              ...content.buttonConfig?.text,
                              en: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='e.g., View Blog'
                    className='bg-gray-700 text-white border-gray-600'
                  />
                </div>
                <div>
                  <Label className='text-white'>Button Text (Arabic) - Optional</Label>
                  <Input
                    value={content.buttonConfig?.text?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          buttonConfig: {
                            ...content.buttonConfig,
                            text: {
                              ...content.buttonConfig?.text,
                              ar: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='مثال: عرض المدونة'
                    className='bg-gray-700 text-white border-gray-600'
                  />
                </div>
                <div>
                  <Label className='text-white'>Custom Button URL - Optional</Label>
                  <Input
                    value={content.buttonConfig?.url || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          buttonConfig: {
                            ...content.buttonConfig,
                            url: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder='Leave empty for auto-generated URLs'
                    className='bg-gray-700 text-white border-gray-600'
                  />
                </div>
              </div>
            </div>
          </div>
        );


      case SectionType.ABOUT:
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white'>Title (English)</Label>
              <Input
                value={content.title?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Title (Arabic)</Label>
              <Input
                value={content.title?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Subtitle (English)</Label>
              <Input
                value={content.subtitle?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      subtitle: { ...content.subtitle, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English subtitle'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Subtitle (Arabic)</Label>
              <Input
                value={content.subtitle?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      subtitle: { ...content.subtitle, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic subtitle'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Content (English)</Label>
              <Textarea
                value={content.content?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      content: { ...content.content, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English content'
                rows={4}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Content (Arabic)</Label>
              <Textarea
                value={content.content?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      content: { ...content.content, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic content'
                rows={4}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Background Image</Label>
              <div className='flex gap-2'>
                <Input
                  value={content.backgroundImage || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: { ...content, backgroundImage: e.target.value },
                    })
                  }
                  placeholder='Background image URL'
                  className='bg-gray-700 text-white border-gray-600'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onImageSelect('backgroundImage')}
                  className='border-gray-600 text-gray-300 hover:bg-gray-700'
                >
                  <ImageIcon className='h-4 w-4' />
                </Button>
              </div>
              {content.backgroundImage && (
                <div className='mt-2'>
                  <Image
                    width={100}
                    height={100}
                    src={content.backgroundImage}
                    alt='Background Preview'
                    className='w-32 h-24 object-cover rounded border'
                  />
                </div>
              )}
            </div>
            <div>
              <Label className='text-white'>Video URL</Label>
              <div className='flex gap-2'>
                <Input
                  value={content.videoUrl || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: { ...content, videoUrl: e.target.value },
                    })
                  }
                  placeholder='Video URL'
                  className='bg-gray-700 text-white border-gray-600'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onImageSelect('videoUrl')}
                  className='border-gray-600 text-gray-300 hover:bg-gray-700'
                >
                  <Video className='h-4 w-4' />
                </Button>
              </div>
              {content.videoUrl && (
                <div className='mt-2'>
                  <video
                    src={content.videoUrl}
                    className='w-32 h-24 object-cover rounded border'
                    controls
                    muted
                  />
                </div>
              )}
            </div>
          </div>
        );

      case SectionType.ACTIONS:
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white'>Title (English)</Label>
              <Input
                value={content.title?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Title (Arabic)</Label>
              <Input
                value={content.title?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (English)</Label>
              <Textarea
                value={content.description?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        en: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter English description'
                rows={3}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (Arabic)</Label>
              <Textarea
                value={content.description?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter Arabic description'
                rows={3}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Action URL</Label>
              <div className='flex gap-2'>
                <Input
                  value={content.actionHref || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: { ...content, actionHref: e.target.value },
                    })
                  }
                  placeholder='Enter action URL'
                  className='bg-gray-700 text-white border-gray-600'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onImageSelect('actionHref')}
                  className='border-gray-600 text-gray-300 hover:bg-gray-700'
                >
                  <Link className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        );

      case SectionType.NUMBERS:
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white'>Title (English)</Label>
              <Input
                value={content.title?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Title (Arabic)</Label>
              <Input
                value={content.title?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Number</Label>
              <Input
                type='number'
                value={content.number || 0}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      number: parseInt(e.target.value) || 0,
                    },
                  })
                }
                placeholder='Enter number'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (English)</Label>
              <Textarea
                value={content.description?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        en: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter English description'
                rows={3}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (Arabic)</Label>
              <Textarea
                value={content.description?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter Arabic description'
                rows={3}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
          </div>
        );

      case SectionType.OUR_MISSION:
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white'>Title (English)</Label>
              <Input
                value={content.title?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Title (Arabic)</Label>
              <Input
                value={content.title?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (English)</Label>
              <Textarea
                value={content.description?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        en: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter English description'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (Arabic)</Label>
              <Textarea
                value={content.description?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter Arabic description'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Button text (English)</Label>
              <Textarea
                value={content.buttonText?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      buttonText: {
                        ...content.buttonText,
                        en: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter English button Text'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Button text (Arabic)</Label>
              <Textarea
                value={content.buttonText?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      buttonText: {
                        ...content.buttonText,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter Arabic button Text'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Image URL</Label>
              <div className='flex gap-2'>
                <Input
                  value={content.imageUrl || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: { ...content, imageUrl: e.target.value },
                    })
                  }
                  placeholder='Image URL'
                  className='bg-gray-700 text-white border-gray-600'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onImageSelect('imageUrl')}
                  className='border-gray-600 text-gray-300 hover:bg-gray-700'
                >
                  <ImageIcon className='h-4 w-4' />
                </Button>
              </div>
              {content.imageUrl && (
                <div className='mt-2'>
                  <Image
                    width={100}
                    height={100}
                    src={content.imageUrl}
                    alt='Preview'
                    className='w-32 h-24 object-cover rounded border'
                  />
                </div>
              )}
            </div>
          </div>
        );

      case SectionType.BLOGS:
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white'>Title (English)</Label>
              <Input
                value={content.title?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Title (Arabic)</Label>
              <Input
                value={content.title?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (English)</Label>
              <Textarea
                value={content.description?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        en: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter English description'
                rows={3}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (Arabic)</Label>
              <Textarea
                value={content.description?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter Arabic description'
                rows={3}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Maximum Items to Display</Label>
              <Input
                type='number'
                value={content.maxItems || 6}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      maxItems: parseInt(e.target.value) || 6,
                    },
                  })
                }
                placeholder='Number of blogs to display'
                min='1'
                max='20'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div className='space-y-2'>
              <Label className='text-white'>Display Options</Label>
              <div className='space-y-2'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={content.showFeaturedOnly || false}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          showFeaturedOnly: e.target.checked,
                        },
                      })
                    }
                    className='rounded'
                  />
                  <span className='text-sm text-gray-300'>
                    Show only featured blogs
                  </span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={content.showUniversityBlogs || false}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          showUniversityBlogs: e.target.checked,
                        },
                      })
                    }
                    className='rounded'
                  />
                  <span className='text-sm text-gray-300'>
                    Show university blogs
                  </span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={content.showCollegeBlogs || false}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          showCollegeBlogs: e.target.checked,
                        },
                      })
                    }
                    className='rounded'
                  />
                  <span className='text-sm text-gray-300'>
                    Show college blogs
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case SectionType.PROGRAMS_SECTION:
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white'>Title (English)</Label>
              <Input
                value={content.title?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Title (Arabic)</Label>
              <Input
                value={content.title?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Subtitle (English)</Label>
              <Input
                value={content.subtitle?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      subtitle: { ...content.subtitle, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English subtitle'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Subtitle (Arabic)</Label>
              <Input
                value={content.subtitle?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      subtitle: { ...content.subtitle, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic subtitle'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (English)</Label>
              <Textarea
                value={content.description?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        en: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter English description'
                rows={4}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (Arabic)</Label>
              <Textarea
                value={content.description?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter Arabic description'
                rows={4}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Button Text (English)</Label>
              <Input
                value={content.buttonText?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      buttonText: { ...content.buttonText, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English button text'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Button Text (Arabic)</Label>
              <Input
                value={content.buttonText?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      buttonText: { ...content.buttonText, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic button text'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Maximum Items to Display</Label>
              <Input
                type='number'
                value={content.maxItems || 6}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      maxItems: parseInt(e.target.value) || 6,
                    },
                  })
                }
                placeholder='Number of programs to display'
                min='1'
                max='20'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Filter by College (Optional)</Label>
              <Select
                value={content.collageId || ''}
                onValueChange={value =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      collageId: value === 'all' ? '' : value,
                    },
                  })
                }
              >
                <SelectTrigger className='bg-gray-700 text-white border-gray-600'>
                  <SelectValue placeholder='Select a college (or leave empty for all programs)' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Programs (No Filter)</SelectItem>
                  {collegesLoading ? (
                    <SelectItem value='loading' disabled>
                      Loading colleges...
                    </SelectItem>
                  ) : (
                    colleges.map(college => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name?.en || college.name?.ar || college.slug}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className='text-xs text-gray-400 mt-1'>
                Select a specific college to show only programs from that
                college, or leave as "All Programs" to show programs from all
                colleges.
              </p>
            </div>
          </div>
        );

      case SectionType.STUDENT_UNION:
      case SectionType.EGYPT_STUDENT_GROUP:
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white'>Title (English)</Label>
              <Input
                value={content.title?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Title (Arabic)</Label>
              <Input
                value={content.title?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      title: { ...content.title, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic title'
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (English)</Label>
              <Textarea
                value={content.description?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        en: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter English description'
                rows={3}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Description (Arabic)</Label>
              <Textarea
                value={content.description?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      description: {
                        ...content.description,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                placeholder='Enter Arabic description'
                rows={3}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
            <div>
              <Label className='text-white'>Items (one per line)</Label>
              <Textarea
                value={content.items?.join('\n') || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      items: e.target.value
                        .split('\n')
                        .filter(item => item.trim()),
                    },
                  })
                }
                placeholder='Enter items, one per line'
                rows={4}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
          </div>
        );

      case SectionType.PRESIDENT:
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white'>Custom Content (JSON)</Label>
              <Textarea
                value={JSON.stringify(content, null, 2)}
                onChange={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({
                      ...formData,
                      content: parsed,
                    });
                  } catch (error) {
                    // Invalid JSON, keep the text as is
                    setFormData({
                      ...formData,
                      content: e.target.value,
                    });
                  }
                }}
                placeholder='Enter custom content as JSON'
                rows={6}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
          </div>
        );

      default:
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white'>Custom Content (JSON)</Label>
              <Textarea
                value={JSON.stringify(content, null, 2)}
                onChange={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({
                      ...formData,
                      content: parsed,
                    });
                  } catch (error) {
                    // Invalid JSON, keep the text as is
                    setFormData({
                      ...formData,
                      content: e.target.value,
                    });
                  }
                }}
                placeholder='Enter custom content as JSON'
                rows={6}
                className='bg-gray-700 text-white border-gray-600'
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Section Type */}
      <div>
        <Label className='text-white'>Section Type</Label>
        <Select value={formData.type} onValueChange={onTypeChange}>
          <SelectTrigger className='bg-gray-700 text-white border-gray-600'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sectionTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Order */}
      <div>
        <Label className='text-white'>Order</Label>
        <Input
          type='number'
          value={formData.order}
          onChange={e =>
            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
          }
          className='bg-gray-700 text-white border-gray-600'
        />
      </div>

      {/* Dynamic Content Fields */}
      {renderContentFields()}

      {/* Submit Button */}
      <div className='flex justify-end gap-2'>
        <Button
          type='button'
          variant='outline'
          onClick={() => { }}
          className='border-gray-600 text-gray-300 hover:bg-gray-700'
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} className='bg-blue-600 hover:bg-blue-700'>
          <Save className='h-4 w-4 mr-2' />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
