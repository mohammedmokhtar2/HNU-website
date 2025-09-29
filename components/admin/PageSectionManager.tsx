'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Star,
  Building2,
  GraduationCap,
  Crown,
  BarChart3,
  Users,
  FileText,
  Mail,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { ImageSelectorModal } from '@/components/ui/image-selector-modal';
import {
  PageSection,
  CreatePageSectionInput,
  UpdatePageSectionInput,
  PageSectionContentUnion,
  HeroContentOne,
  HeroContentTwo,
  AboutContentOne,
  AboutContentTwo,
  ContactContent,
  BlogsContent,
  PresidentContent,
  StudentActivitiesContent,
  StudentUnionsContent,
  ForEgyptGroupContent,
  OurHistoryContent,
  CustomContent,
} from '@/types/pageSections';
import { PageSectionType } from '@/types/enums';
import { PageSectionService } from '@/services/pageSectionService';
import { getContentForPageSectionType } from '@/utils/pageContentUtils';

interface PageSectionManagerProps {
  pageId: string;
  onSectionsChange?: (sections: PageSection[]) => void;
}

const pageSectionTypeIcons = {
  [PageSectionType.HERO1]: Star,
  [PageSectionType.HERO2]: Star,
  [PageSectionType.ABOUT1]: Building2,
  [PageSectionType.ABOUT2]: Building2,
  [PageSectionType.CONTACT]: Mail,
  [PageSectionType.BLOGS]: FileText,
  [PageSectionType.PRESIDENT]: Crown,
  [PageSectionType.STUDENT_ACTIVITIES]: Users,
  [PageSectionType.STUDENT_UNIONS]: Users,
  [PageSectionType.FOR_EGYPT_GROUP]: Users,
  [PageSectionType.OUR_HISTORY]: Menu,
  [PageSectionType.CUSTOM]: FileText,
};

const pageSectionTypeLabels = {
  [PageSectionType.HERO1]: 'Hero Style 1',
  [PageSectionType.HERO2]: 'Hero Style 2',
  [PageSectionType.ABOUT1]: 'About Style 1',
  [PageSectionType.ABOUT2]: 'About Style 2',
  [PageSectionType.CONTACT]: 'Contact',
  [PageSectionType.BLOGS]: 'Blogs',
  [PageSectionType.PRESIDENT]: 'President',
  [PageSectionType.STUDENT_ACTIVITIES]: 'Student Activities',
  [PageSectionType.STUDENT_UNIONS]: 'Student Unions',
  [PageSectionType.FOR_EGYPT_GROUP]: 'For Egypt Group',
  [PageSectionType.OUR_HISTORY]: 'Our History',
  [PageSectionType.CUSTOM]: 'Custom',
};

// Sortable Page Section Item Component
function SortablePageSectionItem({
  section,
  onEdit,
  onDelete,
}: {
  section: PageSection;
  onEdit: (section: PageSection) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon =
    pageSectionTypeIcons[section.type as keyof typeof pageSectionTypeIcons] ||
    FileText;

  const getContentPreview = (content: any, type: PageSectionType) => {
    switch (type) {
      case PageSectionType.HERO1:
      case PageSectionType.HERO2:
        return content?.title?.en || content?.title?.ar || 'Hero Section';
      case PageSectionType.ABOUT1:
      case PageSectionType.ABOUT2:
        return (
          content?.description?.en ||
          content?.description?.ar ||
          'About Section'
        );
      case PageSectionType.CONTACT:
        return 'Contact Section';
      case PageSectionType.BLOGS:
        return 'Blogs Section';
      case PageSectionType.PRESIDENT:
        return content?.name?.en || content?.name?.ar || 'President Section';
      case PageSectionType.STUDENT_ACTIVITIES:
        return 'Student Activities Section';
      case PageSectionType.STUDENT_UNIONS:
        return 'Student Unions Section';
      case PageSectionType.FOR_EGYPT_GROUP:
        return 'For Egypt Group Section';
      case PageSectionType.OUR_HISTORY:
        return 'Our History Section';
      default:
        return 'Custom Section';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'hover:shadow-md transition-shadow',
        isDragging && 'opacity-50'
      )}
    >
      <CardContent className='p-6'>
        <div className='flex items-center gap-4'>
          {/* Drag Handle */}
          <div
            className='cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600'
            {...attributes}
            {...listeners}
          >
            <GripVertical className='h-5 w-5' />
          </div>

          {/* Section Info */}
          <div className='flex-1'>
            <div className='flex items-center gap-3'>
              <Icon className='h-5 w-5 text-blue-500' />
              <div>
                <h3 className='font-medium text-gray-300'>
                  {pageSectionTypeLabels[section.type]}
                </h3>
                <p className='text-sm text-gray-500'>
                  {getContentPreview(section.content, section.type)}
                </p>
                <div className='flex items-center gap-2 mt-1'>
                  <span className='text-xs text-gray-400'>
                    Order: {section.order}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={() => onEdit(section)}>
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onDelete(section.id)}
              className='text-red-600 hover:text-red-700'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PageSectionManager({
  pageId,
  onSectionsChange,
}: PageSectionManagerProps) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<PageSection | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageField, setImageField] = useState<string>('image');
  const { success, error: showError } = useToast();

  // Use refs to store the latest callback functions to avoid stale closures
  const onSectionsChangeRef = useRef(onSectionsChange);
  const showErrorRef = useRef(showError);

  // Update refs when props change
  useEffect(() => {
    onSectionsChangeRef.current = onSectionsChange;
  }, [onSectionsChange]);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  // Form state - temporarily using any for form flexibility
  const [formData, setFormData] = useState<{
    type: PageSectionType;
    title: { ar: string; en: string };
    content: any;
    order: number;
  }>({
    type: PageSectionType.HERO1,
    title: { ar: '', en: '' },
    content: getContentForPageSectionType(PageSectionType.HERO1),
    order: 0,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadSections = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PageSectionService.getPageSectionsByPage(pageId);
      setSections(data);
      onSectionsChangeRef.current?.(data);
    } catch (error) {
      console.error('Error loading page sections:', error);
      showErrorRef.current('Failed to load page sections');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  // Memoize the section IDs for drag and drop to prevent unnecessary re-renders
  const sectionIds = useMemo(() => sections.map(s => s.id), [sections]);

  const handleCreate = async () => {
    try {
      const newSection = await PageSectionService.createPageSection({
        type: formData.type,
        title: formData.title,
        content: formData.content,
        order: formData.order,
        pageId,
      });
      setSections([...sections, newSection]);
      setIsCreateDialogOpen(false);
      resetForm();
      success('Page section created successfully');
    } catch (error) {
      console.error('Error creating page section:', error);
      showError('Failed to create page section');
    }
  };

  const handleUpdate = async () => {
    if (!editingSection) return;

    try {
      const updatedSection = await PageSectionService.updatePageSection(
        editingSection.id,
        {
          type: formData.type,
          title: formData.title,
          content: formData.content,
          order: formData.order,
        }
      );
      setSections(
        sections.map(s => (s.id === editingSection.id ? updatedSection : s))
      );
      setIsEditDialogOpen(false);
      setEditingSection(null);
      resetForm();
      success('Page section updated successfully');
    } catch (error) {
      console.error('Error updating page section:', error);
      showError('Failed to update page section');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await PageSectionService.deletePageSection(id);
      setSections(sections.filter(s => s.id !== id));
      success('Page section deleted successfully');
    } catch (error) {
      console.error('Error deleting page section:', error);
      showError('Failed to delete page section');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over?.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);

      try {
        // Update order for all affected sections
        const updatePromises = newSections.map((section, index) =>
          PageSectionService.updatePageSection(section.id, { order: index })
        );
        await Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating section order:', error);
        showError('Failed to update section order');
        loadSections(); // Reload to get correct order
      }
    }
  };

  const openEditDialog = (section: PageSection) => {
    setEditingSection(section);
    setFormData({
      type: section.type,
      title:
        typeof section.title === 'object' ? section.title : { ar: '', en: '' },
      content: section.content,
      order: section.order,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: PageSectionType.HERO1,
      title: { ar: '', en: '' },
      content: getContentForPageSectionType(PageSectionType.HERO1),
      order: sections.length,
    });
  };

  const handleImageSelect = (url: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [imageField]: url,
      },
    }));
    setShowImageModal(false);
  };

  const openImageModal = (field: string) => {
    setImageField(field);
    setShowImageModal(true);
  };

  const handleTypeChange = (newType: PageSectionType) => {
    setFormData({
      ...formData,
      type: newType,
      content: getContentForPageSectionType(newType),
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-500'>Loading sections...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-white'>Page Sections</h3>
          <p className='text-sm text-gray-500'>
            Manage the sections that will appear on this page
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}
          className='bg-blue-600 hover:bg-blue-700 text-white'
        >
          <Plus className='h-4 w-4 mr-2 ' />
          Add Section
        </Button>
      </div>

      {/* Sections List with Drag and Drop */}
      <div className='space-y-4'>
        {sections.length === 0 ? (
          <Card className='border-dashed'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <FileText className='h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-lg font-medium text-white mb-2'>
                No sections yet
              </h3>
              <p className='text-sm text-gray-500 mb-4'>
                Add your first section to get started
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setIsCreateDialogOpen(true);
                }}
                className='bg-blue-600 hover:bg-blue-700 text-white'
              >
                <Plus className='h-4 w-4 mr-2' />
                Add First Section
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              {sections.map(section => (
                <SortablePageSectionItem
                  key={section.id}
                  section={section}
                  onEdit={openEditDialog}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
          </DialogHeader>
          <PageSectionForm
            formData={formData}
            setFormData={setFormData}
            onTypeChange={handleTypeChange}
            onSubmit={handleCreate}
            onImageSelect={openImageModal}
            submitLabel='Create Section'
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          <PageSectionForm
            formData={formData}
            setFormData={setFormData}
            onTypeChange={handleTypeChange}
            onSubmit={handleUpdate}
            onImageSelect={openImageModal}
            submitLabel='Update Section'
          />
        </DialogContent>
      </Dialog>

      {/* Image Selector Modal */}
      <ImageSelectorModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onSelect={handleImageSelect}
        currentValue={(formData.content as any)?.[imageField] || ''}
      />
    </div>
  );
}

interface PageSectionFormProps {
  formData: {
    type: PageSectionType;
    title: { ar: string; en: string };
    content: any;
    order: number;
  };
  setFormData: (data: any) => void;
  onTypeChange: (type: PageSectionType) => void;
  onSubmit: () => void;
  onImageSelect: (field: string) => void;
  submitLabel: string;
}

function PageSectionForm({
  formData,
  setFormData,
  onTypeChange,
  onSubmit,
  onImageSelect,
  submitLabel,
}: PageSectionFormProps) {
  const renderContentFields = () => {
    const { type, content } = formData;

    switch (type) {
      case PageSectionType.HERO1:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Title</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
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
                    placeholder='Enter title in english'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
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
                    placeholder='ادخل العنوان باللغة العربية'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
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
                    placeholder='Description'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
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
                    placeholder='الوصف'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Image</Label>
              <div className='space-y-3 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>Image URL</Label>
                  <Input
                    value={content.imageUrl || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          imageUrl: e.target.value,
                        },
                      })
                    }
                    placeholder='https://example.com/image.jpg'
                  />
                </div>
                <div className='flex items-center gap-4'>
                  {content.imageUrl && (
                    <Image
                      src={content.imageUrl}
                      alt='Preview'
                      width={80}
                      height={80}
                      className='w-20 h-20 object-cover rounded'
                    />
                  )}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => onImageSelect('imageUrl')}
                  >
                    {content.imageUrl
                      ? 'Change from Gallery'
                      : 'Select from Gallery'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case PageSectionType.HERO2:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Hero Title</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
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
                    placeholder='Title'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
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
                    placeholder='العنوان'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Background Image</Label>
              <div className='space-y-3 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>Image URL</Label>
                  <Input
                    value={content.backgroundImage || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          backgroundImage: e.target.value,
                        },
                      })
                    }
                    placeholder='https://example.com/background.jpg'
                  />
                </div>
                <div className='flex items-center gap-4'>
                  {content.backgroundImage && (
                    <Image
                      src={content.backgroundImage}
                      alt='Preview'
                      width={80}
                      height={80}
                      className='w-20 h-20 object-cover rounded'
                    />
                  )}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => onImageSelect('backgroundImage')}
                  >
                    {content.backgroundImage
                      ? 'Change from Gallery'
                      : 'Select from Gallery'}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Buttons</Label>
              <div className='space-y-3 mt-2'>
                {content.buttons?.map((button: any, index: number) => (
                  <div key={index} className='border p-3 rounded-lg space-y-2'>
                    <div className='flex justify-between items-center'>
                      <Label className='text-sm font-medium'>
                        Button {index + 1}
                      </Label>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const newButtons = content.buttons.filter(
                            (_: any, i: number) => i !== index
                          );
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              buttons: newButtons,
                            },
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <div>
                        <Label className='text-xs'>English</Label>
                        <Input
                          value={button.text?.en || ''}
                          onChange={e => {
                            const newButtons = [...content.buttons];
                            newButtons[index] = {
                              ...newButtons[index],
                              text: {
                                ...newButtons[index].text,
                                en: e.target.value,
                              },
                            };
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                buttons: newButtons,
                              },
                            });
                          }}
                          placeholder='Button Text'
                        />
                      </div>
                      <div>
                        <Label className='text-xs'>Arabic</Label>
                        <Input
                          value={button.text?.ar || ''}
                          onChange={e => {
                            const newButtons = [...content.buttons];
                            newButtons[index] = {
                              ...newButtons[index],
                              text: {
                                ...newButtons[index].text,
                                ar: e.target.value,
                              },
                            };
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                buttons: newButtons,
                              },
                            });
                          }}
                          placeholder='نص الزر'
                        />
                      </div>
                    </div>
                    <Input
                      value={button.url || ''}
                      onChange={e => {
                        const newButtons = [...content.buttons];
                        newButtons[index] = {
                          ...newButtons[index],
                          url: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            buttons: newButtons,
                          },
                        });
                      }}
                      placeholder='Button URL'
                    />
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    const newButtons = [
                      ...(content.buttons || []),
                      {
                        text: { ar: '', en: '' },
                        url: '',
                      },
                    ];
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        buttons: newButtons,
                      },
                    });
                  }}
                >
                  Add Button
                </Button>
              </div>
            </div>
          </div>
        );

      case PageSectionType.ABOUT1:
      case PageSectionType.ABOUT2:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Title</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
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
                    placeholder='About Title'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
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
                    placeholder='عنوان القسم'
                  />
                </div>
              </div>
            </div>

            {content.subtitle !== undefined && (
              <div>
                <Label>Subtitle</Label>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                  <div>
                    <Label className='text-xs text-gray-500'>English</Label>
                    <Input
                      value={content.subtitle?.en || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            subtitle: {
                              ...content.subtitle,
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder='Subtitle'
                    />
                  </div>
                  <div>
                    <Label className='text-xs text-gray-500'>Arabic</Label>
                    <Input
                      value={content.subtitle?.ar || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            subtitle: {
                              ...content.subtitle,
                              ar: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder='العنوان الفرعي'
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Description</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
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
                    placeholder='Description'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
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
                    placeholder='الوصف'
                  />
                </div>
              </div>
            </div>

            {type === PageSectionType.ABOUT1 && (
              <>
                <div>
                  <Label>Content</Label>
                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div>
                      <Label className='text-xs text-gray-500'>English</Label>
                      <Input
                        value={content.content?.en || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              content: {
                                ...content.content,
                                en: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='Detailed content'
                      />
                    </div>
                    <div>
                      <Label className='text-xs text-gray-500'>Arabic</Label>
                      <Input
                        value={content.content?.ar || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              content: {
                                ...content.content,
                                ar: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='المحتوى التفصيلي'
                      />
                    </div>
                  </div>
                </div>

                {content.ButtonText !== undefined && (
                  <div>
                    <Label>Button Text</Label>
                    <div className='grid grid-cols-2 gap-4 mt-2'>
                      <div>
                        <Label className='text-xs text-gray-500'>English</Label>
                        <Input
                          value={content.ButtonText?.en || ''}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                ButtonText: {
                                  ...content.ButtonText,
                                  en: e.target.value,
                                },
                              },
                            })
                          }
                          placeholder='Learn More'
                        />
                      </div>
                      <div>
                        <Label className='text-xs text-gray-500'>Arabic</Label>
                        <Input
                          value={content.ButtonText?.ar || ''}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                ButtonText: {
                                  ...content.ButtonText,
                                  ar: e.target.value,
                                },
                              },
                            })
                          }
                          placeholder='اعرف المزيد'
                        />
                      </div>
                    </div>
                  </div>
                )}

                {content.ButtonUrl !== undefined && (
                  <div>
                    <Label>Button URL</Label>
                    <Input
                      value={content.ButtonUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            ButtonUrl: e.target.value,
                          },
                        })
                      }
                      placeholder='/about'
                    />
                  </div>
                )}
              </>
            )}

            {type === PageSectionType.ABOUT2 &&
              content.buttons !== undefined && (
                <div>
                  <Label>Buttons</Label>
                  <div className='space-y-3 mt-2'>
                    {content.buttons?.map((button: any, index: number) => (
                      <div
                        key={index}
                        className='border p-3 rounded-lg space-y-2'
                      >
                        <div className='flex justify-between items-center'>
                          <Label className='text-sm font-medium'>
                            Button {index + 1}
                          </Label>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const newButtons = content.buttons.filter(
                                (_: any, i: number) => i !== index
                              );
                              setFormData({
                                ...formData,
                                content: {
                                  ...content,
                                  buttons: newButtons,
                                },
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                          <div>
                            <Label className='text-xs'>English</Label>
                            <Input
                              value={button.text?.en || ''}
                              onChange={e => {
                                const newButtons = [...content.buttons];
                                newButtons[index] = {
                                  ...newButtons[index],
                                  text: {
                                    ...newButtons[index].text,
                                    en: e.target.value,
                                  },
                                };
                                setFormData({
                                  ...formData,
                                  content: {
                                    ...content,
                                    buttons: newButtons,
                                  },
                                });
                              }}
                              placeholder='Button Text'
                            />
                          </div>
                          <div>
                            <Label className='text-xs'>Arabic</Label>
                            <Input
                              value={button.text?.ar || ''}
                              onChange={e => {
                                const newButtons = [...content.buttons];
                                newButtons[index] = {
                                  ...newButtons[index],
                                  text: {
                                    ...newButtons[index].text,
                                    ar: e.target.value,
                                  },
                                };
                                setFormData({
                                  ...formData,
                                  content: {
                                    ...content,
                                    buttons: newButtons,
                                  },
                                });
                              }}
                              placeholder='نص الزر'
                            />
                          </div>
                        </div>
                        <Input
                          value={button.url || ''}
                          onChange={e => {
                            const newButtons = [...content.buttons];
                            newButtons[index] = {
                              ...newButtons[index],
                              url: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                buttons: newButtons,
                              },
                            });
                          }}
                          placeholder='Button URL'
                        />
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        const newButtons = [
                          ...(content.buttons || []),
                          {
                            text: { ar: '', en: '' },
                            url: '',
                          },
                        ];
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            buttons: newButtons,
                          },
                        });
                      }}
                    >
                      Add Button
                    </Button>
                  </div>
                </div>
              )}

            {type === PageSectionType.ABOUT2 && (
              <>
                <div>
                  <Label>Left Section Title One</Label>
                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div>
                      <Label className='text-xs text-gray-500'>English</Label>
                      <Input
                        value={content.leftTitleOne?.en || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              leftTitleOne: {
                                ...content.leftTitleOne,
                                en: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='Left Title One'
                      />
                    </div>
                    <div>
                      <Label className='text-xs text-gray-500'>Arabic</Label>
                      <Input
                        value={content.leftTitleOne?.ar || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              leftTitleOne: {
                                ...content.leftTitleOne,
                                ar: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='العنوان الأيسر الأول'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Left Section Description One</Label>
                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div>
                      <Label className='text-xs text-gray-500'>English</Label>
                      <Input
                        value={content.leftDescriptionOne?.en || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              leftDescriptionOne: {
                                ...content.leftDescriptionOne,
                                en: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='Left Description One'
                      />
                    </div>
                    <div>
                      <Label className='text-xs text-gray-500'>Arabic</Label>
                      <Input
                        value={content.leftDescriptionOne?.ar || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              leftDescriptionOne: {
                                ...content.leftDescriptionOne,
                                ar: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='الوصف الأيسر الأول'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Left Section Title Two</Label>
                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div>
                      <Label className='text-xs text-gray-500'>English</Label>
                      <Input
                        value={content.leftTitleTwo?.en || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              leftTitleTwo: {
                                ...content.leftTitleTwo,
                                en: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='Left Title Two'
                      />
                    </div>
                    <div>
                      <Label className='text-xs text-gray-500'>Arabic</Label>
                      <Input
                        value={content.leftTitleTwo?.ar || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              leftTitleTwo: {
                                ...content.leftTitleTwo,
                                ar: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='العنوان الأيسر الثاني'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Left Section Description Two</Label>
                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div>
                      <Label className='text-xs text-gray-500'>English</Label>
                      <Input
                        value={content.leftDescriptionTwo?.en || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              leftDescriptionTwo: {
                                ...content.leftDescriptionTwo,
                                en: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='Left Description Two'
                      />
                    </div>
                    <div>
                      <Label className='text-xs text-gray-500'>Arabic</Label>
                      <Input
                        value={content.leftDescriptionTwo?.ar || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              leftDescriptionTwo: {
                                ...content.leftDescriptionTwo,
                                ar: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder='الوصف الأيسر الثاني'
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {content.imageUrl !== undefined && (
              <div>
                <Label>Image</Label>
                <div className='space-y-3 mt-2'>
                  <div>
                    <Label className='text-xs text-gray-500'>Image URL</Label>
                    <Input
                      value={content.imageUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            imageUrl: e.target.value,
                          },
                        })
                      }
                      placeholder='https://example.com/image.jpg'
                    />
                  </div>
                  <div className='flex items-center gap-4'>
                    {content.imageUrl && (
                      <Image
                        src={content.imageUrl}
                        alt='Preview'
                        width={80}
                        height={80}
                        className='w-20 h-20 object-cover rounded'
                      />
                    )}
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => onImageSelect('imageUrl')}
                    >
                      {content.imageUrl
                        ? 'Change from Gallery'
                        : 'Select from Gallery'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case PageSectionType.OUR_HISTORY:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Title</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
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
                    placeholder='Our History Title'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
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
                    placeholder='عنوان قسم تاريخنا'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
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
                    placeholder='Description'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
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
                    placeholder='الوصف'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Images</Label>
              <div className='space-y-3 mt-2'>
                {(content.images || []).map((imgUrl: string, index: number) => (
                  <div key={index} className='flex items-center gap-4'>
                    {imgUrl && (
                      <Image
                        src={imgUrl}
                        alt={`Preview ${index + 1}`}
                        width={80}
                        height={80}
                        className='w-20 h-20 object-cover rounded'
                      />
                    )}
                    <Input
                      value={imgUrl}
                      onChange={e => {
                        const newImages = [...(content.images || [])];
                        newImages[index] = e.target.value;
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            images: newImages,
                          },
                        });
                      }}
                      placeholder='https://example.com/image.jpg'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        const newImages = (content.images || []).filter(
                          (_: any, i: number) => i !== index
                        );
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            images: newImages,
                          },
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    const newImages = [...(content.images || []), ''];
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        images: newImages,
                      },
                    });
                  }}
                >
                  Add Image
                </Button>
              </div>
            </div>

            <div>
              <Label>Map Section Title</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
                    value={content.MapSectionTitle?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          MapSectionTitle: {
                            ...content.MapSectionTitle,
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder='Our Location'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
                    value={content.MapSectionTitle?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          MapSectionTitle: {
                            ...content.MapSectionTitle,
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder='موقعنا'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Map URL</Label>
              <Input
                value={content.mapUrl || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      mapUrl: e.target.value,
                    },
                  })
                }
                placeholder='Google Maps Embed URL'
              />
            </div>
          </div>
        );

      case PageSectionType.CONTACT:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Contact Title</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
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
                    placeholder='Contact Us'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
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
                    placeholder='تواصل معنا'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Contact Description</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
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
                    placeholder='Get in touch with us'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
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
                    placeholder='تواصل معنا'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={content.email || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      email: e.target.value,
                    },
                  })
                }
                placeholder='contact@university.edu'
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={content.phone || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      phone: e.target.value,
                    },
                  })
                }
                placeholder='+20 xxx xxx xxxx'
              />
            </div>

            <div>
              <Label>Address</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
                    value={content.address?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          address: { ...content.address, en: e.target.value },
                        },
                      })
                    }
                    placeholder='University Address'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
                    value={content.address?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          address: { ...content.address, ar: e.target.value },
                        },
                      })
                    }
                    placeholder='عنوان الجامعة'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Map URL</Label>
              <Input
                value={content.mapUrl || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      mapUrl: e.target.value,
                    },
                  })
                }
                placeholder='Google Maps Embed URL'
              />
            </div>
          </div>
        );

      case PageSectionType.BLOGS:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Blog Title</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
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
                    placeholder='Latest News & Blogs'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
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
                    placeholder='آخر الأخبار والمقالات'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Blog Description</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
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
                    placeholder='Stay updated with our latest posts'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
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
                    placeholder='ابق محدثاً بآخر منشوراتنا'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Show Featured Posts</Label>
              <Select
                value={content.showFeatured ? 'true' : 'false'}
                onValueChange={value =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      showFeatured: value === 'true',
                    },
                  })
                }
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='true'>Yes</SelectItem>
                  <SelectItem value='false'>No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Posts Limit</Label>
              <Input
                type='number'
                value={content.postsLimit || 6}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      postsLimit: parseInt(e.target.value) || 6,
                    },
                  })
                }
                placeholder='6'
              />
            </div>
          </div>
        );

      case PageSectionType.PRESIDENT:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Name</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
                    value={content.Name?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          Name: { ...content.Name, en: e.target.value },
                        },
                      })
                    }
                    placeholder='President Name'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
                    value={content.Name?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          Name: { ...content.Name, ar: e.target.value },
                        },
                      })
                    }
                    placeholder='اسم الرئيس'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Role</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
                    value={content.Role?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          Role: { ...content.Role, en: e.target.value },
                        },
                      })
                    }
                    placeholder='President Role'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
                    value={content.Role?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          Role: { ...content.Role, ar: e.target.value },
                        },
                      })
                    }
                    placeholder='دور الرئيس'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div>
                  <Label className='text-xs text-gray-500'>English</Label>
                  <Input
                    value={content.Title?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          Title: { ...content.Title, en: e.target.value },
                        },
                      })
                    }
                    placeholder='President Title'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500'>Arabic</Label>
                  <Input
                    value={content.Title?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          Title: { ...content.Title, ar: e.target.value },
                        },
                      })
                    }
                    placeholder='عنوان الرئيس'
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>President Image</Label>
              <Input
                type='text'
                value={content.PresidentImageUrl || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      PresidentImageUrl: e.target.value,
                    },
                  })
                }
                placeholder='https://example.com/president.jpg'
              />
            </div>

            <div>
              <Label>Images</Label>
              <div className='space-y-3 mt-2'>
                {(content.ImagesUrl || []).map(
                  (imgUrl: string, index: number) => (
                    <div key={index} className='flex items-center gap-4'>
                      {imgUrl && (
                        <Image
                          src={imgUrl}
                          alt={`Preview ${index + 1}`}
                          width={80}
                          height={80}
                          className='w-20 h-20 object-cover rounded'
                        />
                      )}
                      <Input
                        value={imgUrl}
                        onChange={e => {
                          const newImages = [...(content.ImagesUrl || [])];
                          newImages[index] = e.target.value;
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              ImagesUrl: newImages,
                            },
                          });
                        }}
                        placeholder='https://example.com/image.jpg'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const newImages = (content.ImagesUrl || []).filter(
                            (_: any, i: number) => i !== index
                          );
                          setFormData({
                            ...formData,
                            content: {
                              ...content,
                              ImagesUrl: newImages,
                            },
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )
                )}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    const newImages = [...(content.ImagesUrl || []), ''];
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        ImagesUrl: newImages,
                      },
                    });
                  }}
                >
                  Add Image
                </Button>
              </div>
            </div>

            <div>
              <Label>Paragraphs</Label>
              <div className='space-y-3 mt-2'>
                {(content.Paragraphs || []).map(
                  (para: { en: string; ar: string }, index: number) => (
                    <div
                      key={index}
                      className='grid grid-cols-2 gap-4 items-start'
                    >
                      {/* English Paragraph */}
                      <div>
                        <Label className='text-xs text-gray-500'>English</Label>
                        <textarea
                          value={para.en}
                          onChange={e => {
                            const newParagraphs = [
                              ...(content.Paragraphs || []),
                            ];
                            newParagraphs[index] = {
                              ...newParagraphs[index],
                              en: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                Paragraphs: newParagraphs,
                              },
                            });
                          }}
                          placeholder='Enter paragraph in English'
                          className='w-full border rounded p-2'
                        />
                      </div>

                      {/* Arabic Paragraph */}
                      <div>
                        <Label className='text-xs text-gray-500'>Arabic</Label>
                        <textarea
                          value={para.ar}
                          onChange={e => {
                            const newParagraphs = [
                              ...(content.Paragraphs || []),
                            ];
                            newParagraphs[index] = {
                              ...newParagraphs[index],
                              ar: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                Paragraphs: newParagraphs,
                              },
                            });
                          }}
                          placeholder='أدخل الفقرة بالعربية'
                          className='w-full border rounded p-2'
                        />
                      </div>

                      {/* Remove Button */}
                      <div className='col-span-2'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            const newParagraphs = (
                              content.Paragraphs || []
                            ).filter(
                              (_: { en: string; ar: string }, i: number) =>
                                i !== index
                            );
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                Paragraphs: newParagraphs,
                              },
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )
                )}

                {/* Add New Paragraph */}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    const newParagraphs = [
                      ...(content.Paragraphs || []),
                      { en: '', ar: '' },
                    ];
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        Paragraphs: newParagraphs,
                      },
                    });
                  }}
                >
                  Add Paragraph
                </Button>
              </div>
            </div>

            <div>
              <Label>President Paragraphs</Label>
              <div className='space-y-3 mt-2'>
                {(content.PresidentParagraphs || []).map(
                  (para: { en: string; ar: string }, index: number) => (
                    <div
                      key={index}
                      className='grid grid-cols-2 gap-4 items-start'
                    >
                      {/* English Paragraph */}
                      <div>
                        <Label className='text-xs text-gray-500'>English</Label>
                        <textarea
                          value={para.en}
                          onChange={e => {
                            const newParagraphs = [
                              ...(content.PresidentParagraphs || []),
                            ];
                            newParagraphs[index] = {
                              ...newParagraphs[index],
                              en: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                PresidentParagraphs: newParagraphs,
                              },
                            });
                          }}
                          placeholder='Enter president paragraph in English'
                          className='w-full border rounded p-2'
                        />
                      </div>

                      {/* Arabic Paragraph */}
                      <div>
                        <Label className='text-xs text-gray-500'>Arabic</Label>
                        <textarea
                          value={para.ar}
                          onChange={e => {
                            const newParagraphs = [
                              ...(content.PresidentParagraphs || []),
                            ];
                            newParagraphs[index] = {
                              ...newParagraphs[index],
                              ar: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                PresidentParagraphs: newParagraphs,
                              },
                            });
                          }}
                          placeholder='أدخل فقرة الرئيس بالعربية'
                          className='w-full border rounded p-2'
                        />
                      </div>

                      {/* Remove Button */}
                      <div className='col-span-2'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            const newParagraphs = (
                              content.PresidentParagraphs || []
                            ).filter(
                              (_: { en: string; ar: string }, i: number) =>
                                i !== index
                            );
                            setFormData({
                              ...formData,
                              content: {
                                ...content,
                                PresidentParagraphs: newParagraphs,
                              },
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )
                )}

                {/* Add New Paragraph */}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    const newParagraphs = [
                      ...(content.PresidentParagraphs || []),
                      { en: '', ar: '' },
                    ];
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        PresidentParagraphs: newParagraphs,
                      },
                    });
                  }}
                >
                  Add Paragraph
                </Button>
              </div>
            </div>
          </div>
        );

      case PageSectionType.STUDENT_ACTIVITIES:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Student Activities</Label>
              <p className='text-sm text-gray-500'>
                This section will display student activities. Activities
                management requires additional implementation.
              </p>
            </div>
          </div>
        );

      case PageSectionType.STUDENT_UNIONS:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Student Unions</Label>
              <p className='text-sm text-gray-500'>
                This section will display student unions. Unions management
                requires additional implementation.
              </p>
            </div>
          </div>
        );

      case PageSectionType.FOR_EGYPT_GROUP:
        return (
          <div className='space-y-4'>
            <div>
              <Label>For Egypt Group</Label>
              <p className='text-sm text-gray-500'>
                This section will display For Egypt Group information. Members
                and activities management requires additional implementation.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Custom Content</Label>
              <p className='text-sm text-gray-500'>
                This section type requires custom implementation
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Section Type */}
      <div>
        <Label className='text-sm font-medium'>Section Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: PageSectionType) => onTypeChange(value)}
        >
          <SelectTrigger className='mt-1'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(pageSectionTypeLabels).map(([type, label]) => (
              <SelectItem key={type} value={type}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content Fields */}
      {renderContentFields()}

      {/* Order */}
      <div>
        <Label className='text-sm font-medium'>Order</Label>
        <Input
          type='number'
          value={formData.order}
          onChange={e =>
            setFormData({
              ...formData,
              order: parseInt(e.target.value) || 0,
            })
          }
          className='mt-1'
        />
      </div>

      {/* Submit Button */}
      <Button onClick={onSubmit} className='w-full'>
        {submitLabel}
      </Button>
    </div>
  );
}