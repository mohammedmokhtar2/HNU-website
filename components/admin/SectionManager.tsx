'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SectionService } from '@/services/section.service';
import {
  Section,
  HeroContent,
  AboutContent,
  ActionsContent,
  NumbersContent,
  StudentUnionContent,
  EgyptStudentGroupContent,
  getContentForSectionType,
  isHeroContent,
  isAboutContent,
  isActionsContent,
  isNumbersContent,
  isStudentUnionContent,
  isEgyptStudentGroupContent,
} from '@/types/section';
import { SectionType } from '@/types/enums';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Menu,
  Building2,
  Users,
  BarChart3,
  GraduationCap,
  Crown,
  Star,
  Link,
  Hash,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ImageSelectorModal } from '@/components/ui/image-selector-modal';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

interface SectionManagerProps {
  universityId: string;
  onSectionsChange?: (sections: Section[]) => void;
}

const sectionTypeIcons = {
  [SectionType.HEADER]: Menu,
  [SectionType.HERO]: Star,
  [SectionType.ABOUT]: Building2,
  [SectionType.ACTIONS]: GraduationCap,
  [SectionType.NUMBERS]: BarChart3,
  [SectionType.STUDENT_UNION]: Users,
  [SectionType.EGYPT_STUDENT_GROUP]: Users,
  [SectionType.CUSTOM]: FileText,
};

const sectionTypeLabels = {
  [SectionType.HEADER]: 'Header',
  [SectionType.HERO]: 'Hero',
  [SectionType.ABOUT]: 'About',
  [SectionType.ACTIONS]: 'Actions',
  [SectionType.NUMBERS]: 'Numbers',
  [SectionType.STUDENT_UNION]: 'Student Union',
  [SectionType.EGYPT_STUDENT_GROUP]: 'Egypt Student Group',
  [SectionType.CUSTOM]: 'Custom',
};

// Sortable Section Item Component
function SortableSectionItem({
  section,
  onEdit,
  onDelete,
}: {
  section: Section;
  onEdit: (section: Section) => void;
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

  const Icon = sectionTypeIcons[section.type] || FileText;

  const getContentPreview = (content: any, type: SectionType) => {
    switch (type) {
      case SectionType.HERO:
        if (isHeroContent(content)) {
          return content.title?.en || content.title?.ar || 'Hero Section';
        }
        break;
      case SectionType.ABOUT:
        if (isAboutContent(content)) {
          return content.content?.en || content.content?.ar || 'About Section';
        }
        break;
      case SectionType.ACTIONS:
        if (isActionsContent(content)) {
          return content.title?.en || content.title?.ar || 'Actions Section';
        }
        break;
      case SectionType.NUMBERS:
        if (isNumbersContent(content)) {
          return `${content.title?.en || content.title?.ar || 'Numbers'}: ${content.number}`;
        }
        break;
      case SectionType.STUDENT_UNION:
      case SectionType.EGYPT_STUDENT_GROUP:
        if (
          isStudentUnionContent(content) ||
          isEgyptStudentGroupContent(content)
        ) {
          return content.title?.en || content.title?.ar || 'Student Section';
        }
        break;
      default:
        return 'Custom Section';
    }
    return 'Section Content';
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
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div
                {...attributes}
                {...listeners}
                className='cursor-move p-1 hover:bg-gray-100 rounded'
              >
                <GripVertical className='h-4 w-4 text-gray-400' />
              </div>
              <Icon className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='font-medium text-gray-900'>
                  {getContentPreview(section.content, section.type)}
                </h3>
                <Badge variant='outline' className='text-xs'>
                  {sectionTypeLabels[section.type]}
                </Badge>
                <Badge variant='secondary' className='text-xs'>
                  Order: {section.order}
                </Badge>
              </div>
              <p className='text-sm text-gray-600'>
                {section.type} section content
              </p>
              {/* Media Preview */}
              <div className='mt-2 space-y-2'>
                {/* Image Preview for HERO sections */}
                {section.type === 'HERO' &&
                  (section.content as any)?.imageUrl && (
                    <div className='flex items-center gap-2'>
                      <Image
                        width={100}
                        height={100}
                        src={(section.content as any).imageUrl}
                        alt='Preview'
                        className='w-16 h-12 object-cover rounded border'
                      />
                      <span className='text-xs text-gray-500'>Image</span>
                    </div>
                  )}
                {/* Background Image Preview for ABOUT sections */}
                {section.type === 'ABOUT' &&
                  (section.content as any)?.backgroundImage && (
                    <div className='flex items-center gap-2'>
                      <Image
                        width={100}
                        height={100}
                        src={(section.content as any).backgroundImage}
                        alt='Preview'
                        className='w-16 h-12 object-cover rounded border'
                      />
                      <span className='text-xs text-gray-500'>
                        Background Image
                      </span>
                    </div>
                  )}
                {/* Video Preview */}
                {((section.type === 'HERO' &&
                  (section.content as any)?.videoUrl) ||
                  (section.type === 'ABOUT' &&
                    (section.content as any)?.videoUrl)) && (
                  <div className='flex items-center gap-2'>
                    <video
                      width={100}
                      height={100}
                      src={(section.content as any).videoUrl}
                      className='w-16 h-12 object-cover rounded border'
                      muted
                    />
                    <span className='text-xs text-gray-500'>Video</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='sm' onClick={() => onEdit(section)}>
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
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

export function SectionManager({
  universityId,
  onSectionsChange,
}: SectionManagerProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
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

  // Form state - now properly typed
  const [formData, setFormData] = useState<{
    type: SectionType;
    content: any;
    order: number;
  }>({
    type: SectionType.HERO,
    content: getContentForSectionType(SectionType.HERO),
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
      const data = await SectionService.getSectionsByUniversity(universityId);
      setSections(data);
      onSectionsChangeRef.current?.(data);
    } catch (error) {
      console.error('Error loading sections:', error);
      showErrorRef.current('Failed to load sections');
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  // Memoize the section IDs for drag and drop to prevent unnecessary re-renders
  const sectionIds = useMemo(() => sections.map(s => s.id), [sections]);

  const handleCreate = async () => {
    try {
      const newSection = await SectionService.createSection({
        type: formData.type,
        content: formData.content,
        order: formData.order,
        universityId,
      });
      setSections([...sections, newSection]);
      setIsCreateDialogOpen(false);
      resetForm();
      success('Section created successfully');
    } catch (error) {
      console.error('Error creating section:', error);
      showError('Failed to create section');
    }
  };

  const handleUpdate = async () => {
    if (!editingSection) return;

    try {
      const updatedSection = await SectionService.updateSection(
        editingSection.id,
        {
          type: formData.type,
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
      success('Section updated successfully');
    } catch (error) {
      console.error('Error updating section:', error);
      showError('Failed to update section');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await SectionService.deleteSection(id);
      setSections(sections.filter(s => s.id !== id));
      success('Section deleted successfully');
    } catch (error) {
      console.error('Error deleting section:', error);
      showError('Failed to delete section');
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
        const reorderData = newSections.map((section, index) => ({
          id: section.id,
          order: index,
        }));
        await SectionService.reorderSections(reorderData);
        success('Sections reordered successfully');
      } catch (error) {
        console.error('Error reordering sections:', error);
        showError('Failed to reorder sections');
        // Revert on error
        loadSections();
      }
    }
  };

  const openEditDialog = (section: Section) => {
    setEditingSection(section);
    setFormData({
      type: section.type,
      content: section.content,
      order: section.order,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: SectionType.HERO,
      content: getContentForSectionType(SectionType.HERO),
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

  const handleTypeChange = (newType: SectionType) => {
    setFormData({
      ...formData,
      type: newType,
      content: getContentForSectionType(newType),
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-gray-300'>Loading sections...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Sections Management
          </h2>
          <p className='text-gray-600'>
            Manage university sections and their content
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className='bg-blue-600 hover:bg-blue-700'
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Create New Section</DialogTitle>
            </DialogHeader>
            <SectionForm
              formData={formData}
              setFormData={setFormData}
              onTypeChange={handleTypeChange}
              onSubmit={handleCreate}
              onImageSelect={openImageModal}
              submitLabel='Create Section'
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Sections List with Drag and Drop */}
      <div className='space-y-4'>
        {sections.length === 0 ? (
          <Card className='p-8 text-center'>
            <FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No sections found
            </h3>
            <p className='text-gray-600 mb-4'>
              Create your first section to get started
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className='bg-blue-600 hover:bg-blue-700'
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Section
            </Button>
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
                <SortableSectionItem
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          <SectionForm
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

interface SectionFormProps {
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

function SectionForm({
  formData,
  setFormData,
  onTypeChange,
  onSubmit,
  onImageSelect,
  submitLabel,
}: SectionFormProps) {
  const renderContentFields = () => {
    const { type, content } = formData;

    switch (type) {
      case SectionType.HERO:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Title (English)</Label>
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
              />
            </div>
            <div>
              <Label>Title (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Content (English)</Label>
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
              />
            </div>
            <div>
              <Label>Content (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Image URL</Label>
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
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onImageSelect('imageUrl')}
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
              <Label>Video URL</Label>
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
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onImageSelect('videoUrl')}
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

      case SectionType.ABOUT:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Title (English)</Label>
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
              />
            </div>
            <div>
              <Label>Title (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Subtitle (English)</Label>
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
              />
            </div>
            <div>
              <Label>Subtitle (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Content (English)</Label>
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
              />
            </div>
            <div>
              <Label>Content (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Background Image</Label>
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
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onImageSelect('backgroundImage')}
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
              <Label>Video URL</Label>
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
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onImageSelect('videoUrl')}
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
              <Label>Title (English)</Label>
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
              />
            </div>
            <div>
              <Label>Title (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Description (English)</Label>
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
              />
            </div>
            <div>
              <Label>Description (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Action URL</Label>
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
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => onImageSelect('actionHref')}
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
              <Label>Title (English)</Label>
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
              />
            </div>
            <div>
              <Label>Title (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Number</Label>
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
              />
            </div>
            <div>
              <Label>Description (English)</Label>
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
              />
            </div>
            <div>
              <Label>Description (Arabic)</Label>
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
              />
            </div>
          </div>
        );

      case SectionType.STUDENT_UNION:
      case SectionType.EGYPT_STUDENT_GROUP:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Title (English)</Label>
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
              />
            </div>
            <div>
              <Label>Title (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Description (English)</Label>
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
              />
            </div>
            <div>
              <Label>Description (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Items (one per line)</Label>
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
              />
            </div>
          </div>
        );

      default:
        return (
          <div className='space-y-4'>
            <div>
              <Label>Custom Content (JSON)</Label>
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
        <Label>Section Type</Label>
        <Select value={formData.type} onValueChange={onTypeChange}>
          <SelectTrigger>
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
        <Label>Order</Label>
        <Input
          type='number'
          value={formData.order}
          onChange={e =>
            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
          }
        />
      </div>

      {/* Dynamic Content Fields */}
      {renderContentFields()}

      {/* Submit Button */}
      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={() => {}}>
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
