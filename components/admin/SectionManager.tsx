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
  ContactUsContent,
  PresidentMessageContent,
  StudentActivitiesContent,
  getContentForSectionType,
  isHeroContent,
  isAboutContent,
  isActionsContent,
  isNumbersContent,
  isStudentUnionContent,
  isEgyptStudentGroupContent,
  isProgramsSectionContent,
  isContactUsContent,
  isPresidentMessageContent,
  isStudentActivitiesContent,
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
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ImageSelectorModal } from '@/components/ui/image-selector-modal';
import { useQueryClient } from '@tanstack/react-query';
import { useBlogsAndEvents, getBlogTitle } from '@/hooks/use-blogs-events';
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

import { useCollege } from '@/contexts/CollegeContext';
interface SectionManagerProps {
  universityId: string;
  onSectionsChange?: (sections: Section[]) => void;
}

const sectionTypeIcons = {
  [SectionType.HEADER]: Menu,
  [SectionType.HERO]: Star,
  [SectionType.ABOUT]: Building2,
  [SectionType.ACTIONS]: GraduationCap,
  [SectionType.OUR_MISSION]: Crown,
  [SectionType.NUMBERS]: BarChart3,
  [SectionType.STUDENT_UNION]: Users,
  [SectionType.COLLEGES_SECTION]: Building2,
  [SectionType.EGYPT_STUDENT_GROUP]: Users,
  [SectionType.PRESIDENT]: Crown,
  [SectionType.BLOGS]: FileText,
  [SectionType.CUSTOM]: FileText,
  [SectionType.PROGRAMS_SECTION]: Building2,
  [SectionType.CONTACT_US]: Mail,
  [SectionType.STUDENT_ACTIVITIES]: Users,
};

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
  [SectionType.PRESIDENT]: "President's Message",
  [SectionType.BLOGS]: 'Blogs',
  [SectionType.CUSTOM]: 'Custom',
  [SectionType.PROGRAMS_SECTION]: 'Programs Section',
  [SectionType.CONTACT_US]: 'Contact Us',
  [SectionType.STUDENT_ACTIVITIES]: 'Student Activities',
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

  const Icon =
    sectionTypeIcons[section.type as keyof typeof sectionTypeIcons] || FileText;

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
      case SectionType.OUR_MISSION:
        if (
          content &&
          typeof content.title === 'object' &&
          typeof content.description === 'object' &&
          typeof content.buttonText === 'object' &&
          typeof content.imageUrl === 'string'
        ) {
          return `${content.title?.en || content.title?.ar || 'Our Mission'}: ${content.description?.en || content.description?.ar || ''}: ${content.buttonText?.en || content.buttonText?.ar || 'Read more'}}`;
        }
        break;
      case SectionType.COLLEGES_SECTION:
        if (
          content &&
          typeof content.title === 'object' &&
          typeof content.subtitle === 'object' &&
          typeof content.description === 'object' &&
          typeof content.buttonText === 'object' &&
          Array.isArray(content.collegeIds)
        ) {
          return `${content.title?.en || content.title?.ar || 'College Programs'}: ${content.subtitle?.en || content.subtitle?.ar || 'Studying at Helwan National University'}: ${content.description?.en || content.description?.ar || ''}: ${content.buttonText?.en || content.buttonText?.ar || 'View all Programs'}`;
        }
        break;
      case SectionType.BLOGS:
        if (
          content &&
          typeof content.title === 'object' &&
          typeof content.description === 'object'
        ) {
          return `${content.title?.en || content.title?.ar || 'Blogs'}: ${content.description?.en || content.description?.ar || 'Latest blog posts'}`;
        }
        break;
      case SectionType.CONTACT_US:
        if (
          content &&
          typeof content.title === 'object' &&
          typeof content.subtitle === 'object'
        ) {
          return `${content.title?.en || content.title?.ar || 'Contact Us'}: ${content.subtitle?.en || content.subtitle?.ar || 'Get in touch with us'}`;
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
      case SectionType.PROGRAMS_SECTION:
        if (isProgramsSectionContent(content)) {
          return `${content.title?.en || content.title?.ar || 'Programs'}: ${content.subtitle?.en || content.subtitle?.ar || 'Our Programs'}: ${content.description?.en || content.description?.ar || ''}: ${content.buttonText?.en || content.buttonText?.ar || 'View all Programs'}`;
        }
        break;
      case SectionType.PRESIDENT:
        if (
          content &&
          typeof content.title === 'object' &&
          typeof content.presidentName === 'object'
        ) {
          return `${content.title?.en || content.title?.ar || "President's Message"} - ${content.presidentName?.en || content.presidentName?.ar || 'President'}`;
        }
        return 'President Section';
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
                  {
                    sectionTypeLabels[
                    section.type as keyof typeof sectionTypeLabels
                    ]
                  }
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
  const queryClient = useQueryClient();

  const collegeContext = useCollege();
  const colleges = collegeContext.colleges.map(college => ({
    id: college.id,
    name: college.name.en || college.name.ar || '', // Choose the language you want to display
  }));
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
      // Clean content object by removing any properties with dots in their names
      // These are invalid properties created by previous image upload attempts
      const cleanContent = { ...formData.content };
      const keysToRemove = Object.keys(cleanContent).filter(key =>
        key.includes('.')
      );

      if (keysToRemove.length > 0) {
        console.log('🧹 Cleaning invalid properties:', keysToRemove);
        keysToRemove.forEach(key => {
          delete cleanContent[key];
        });
      }

      console.log('📤 Sending section data:', {
        type: formData.type,
        contentKeys: Object.keys(cleanContent),
        order: formData.order,
      });

      const newSection = await SectionService.createSection({
        type: formData.type,
        content: cleanContent,
        order: formData.order,
        universityId,
      });
      setSections([...sections, newSection]);

      // Invalidate queries to refresh the section on the frontend
      queryClient.invalidateQueries({ queryKey: ['section', newSection.id] });
      queryClient.invalidateQueries({ queryKey: ['sections'] });

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
      // Clean content object by removing any properties with dots in their names
      const cleanContent = { ...formData.content };
      const keysToRemove = Object.keys(cleanContent).filter(key =>
        key.includes('.')
      );

      if (keysToRemove.length > 0) {
        console.log('🧹 Cleaning invalid properties:', keysToRemove);
        keysToRemove.forEach(key => {
          delete cleanContent[key];
        });
      }

      const updatedSection = await SectionService.updateSection(
        editingSection.id,
        {
          type: formData.type,
          content: cleanContent,
          order: formData.order,
        }
      );
      setSections(
        sections.map(s => (s.id === editingSection.id ? updatedSection : s))
      );

      // Invalidate queries to refresh the section on the frontend
      queryClient.invalidateQueries({
        queryKey: ['section', editingSection.id],
      });
      queryClient.invalidateQueries({ queryKey: ['sections'] });

      setIsEditDialogOpen(false);
      setEditingSection(null);
      resetForm();
      success('Section updated successfully');
    } catch (error) {
      console.error('Error updating section:', error);
      showError('Failed to update section');
    }
  };

  //   const handleUpdate = async () => {
  //   if (!editingSection) return;

  //   try {
  //     const updatedSection = await PageSectionService.updatePageSection(
  //       editingSection.id,
  //       {
  //         type: formData.type,
  //         title: formData.title,
  //         content: formData.content,
  //         order: formData.order,
  //       }
  //     );
  //     setSections(
  //       sections.map(s => (s.id === editingSection.id ? updatedSection : s))
  //     );
  //     setIsEditDialogOpen(false);
  //     setEditingSection(null);
  //     resetForm();
  //     success('Page section updated successfully');
  //   } catch (error) {
  //     console.error('Error updating page section:', error);
  //     showError('Failed to update page section');
  //   }
  // };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await SectionService.deleteSection(id);
      setSections(sections.filter(s => s.id !== id));

      // Invalidate queries to remove deleted section from cache
      queryClient.invalidateQueries({ queryKey: ['section', id] });
      queryClient.invalidateQueries({ queryKey: ['sections'] });

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
    setFormData(prev => {
      // Handle nested field paths (e.g., "studentUnion.imageUrl", "studentFamily.head.imageUrl")
      if (imageField.includes('.')) {
        const parts = imageField.split('.');
        const updatedContent = { ...prev.content };

        // Navigate through the nested structure
        let current: any = updatedContent;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          } else {
            current[parts[i]] = { ...current[parts[i]] };
          }
          current = current[parts[i]];
        }

        // Set the final value
        current[parts[parts.length - 1]] = url;

        return {
          ...prev,
          content: updatedContent,
        };
      }

      // Handle simple field paths (backward compatibility)
      return {
        ...prev,
        content: {
          ...prev.content,
          [imageField]: url,
        },
      };
    });
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
          <h2 className='text-2xl font-bold text-white'>Sections Management</h2>
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
              colleges={colleges}
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
            colleges={colleges}
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
  colleges: Array<{ id: string; name: string }>;
}

function SectionForm({
  formData,
  setFormData,
  onTypeChange,
  onSubmit,
  onImageSelect,
  submitLabel,
  colleges,
}: SectionFormProps) {
  // Fetch blogs and events for the dropdowns
  const { blogs, events, isLoading: loadingBlogsEvents } = useBlogsAndEvents();

  const renderContentFields = () => {
    const { type, content } = formData;

    switch (type) {
      case SectionType.HERO:
        return (
          <div className='space-y-4'>
            {/* Display Type Selector */}
            <div>
              <Label>Display Type</Label>
              <Select
                value={content.displayType || 'default'}
                onValueChange={value =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      displayType: value as 'default' | 'blog' | 'event',
                      // Clear linked IDs when changing display type
                      linkedBlogId:
                        value === 'blog' ? content.linkedBlogId : undefined,
                      linkedEventId:
                        value === 'event' ? content.linkedEventId : undefined,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select display type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='default'>
                    Default (Static Content)
                  </SelectItem>
                  <SelectItem value='blog'>Link to Blog</SelectItem>
                  <SelectItem value='event'>Link to Event</SelectItem>
                </SelectContent>
              </Select>
              <p className='text-xs text-gray-500 mt-1'>
                Choose what to display in the hero section
              </p>
            </div>

            {/* Conditional rendering based on display type */}
            {content.displayType === 'blog' && (
              <div className='bg-blue-50 p-4 rounded-lg space-y-4'>
                <div>
                  <Label>Select Blog</Label>
                  <Select
                    value={content.linkedBlogId || ''}
                    onValueChange={value =>
                      setFormData({
                        ...formData,
                        content: { ...content, linkedBlogId: value },
                      })
                    }
                  >
                    <SelectTrigger>
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
                            {getBlogTitle(blog, 'en')} |{' '}
                            {getBlogTitle(blog, 'ar')}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-gray-500 mt-1'>
                    The blog&apos;s image and description will be displayed
                  </p>
                </div>
              </div>
            )}

            {content.displayType === 'event' && (
              <div className='bg-green-50 p-4 rounded-lg space-y-4'>
                <div>
                  <Label>Select Event</Label>
                  <Select
                    value={content.linkedEventId || ''}
                    onValueChange={value =>
                      setFormData({
                        ...formData,
                        content: { ...content, linkedEventId: value },
                      })
                    }
                  >
                    <SelectTrigger>
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
                            {getBlogTitle(event, 'en')} |{' '}
                            {getBlogTitle(event, 'ar')}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-gray-500 mt-1'>
                    The event&apos;s image and description will be displayed
                  </p>
                </div>
              </div>
            )}

            {/* Default content fields (shown only when displayType is 'default' or not set) */}
            {(!content.displayType || content.displayType === 'default') && (
              <>
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
              </>
            )}

            {/* Custom button configuration (shown for all display types) */}
            <div className='border-t pt-4'>
              <h4 className='font-medium mb-3'>Button Configuration</h4>
              <div className='space-y-3'>
                <div>
                  <Label>Button Text (English) - Optional</Label>
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
                    placeholder='e.g., View Blog, Read More'
                  />
                </div>
                <div>
                  <Label>Button Text (Arabic) - Optional</Label>
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
                    placeholder='مثال: عرض المدونة، اقرأ المزيد'
                  />
                </div>
                <div>
                  <Label>Custom Button URL - Optional</Label>
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
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    If empty, will auto-navigate to the selected blog/event
                    page
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case SectionType.COLLEGES_SECTION:
        // colleges يجب أن تكون متاحة من الأعلى (props أو context)
        // مثال: const colleges = useCollegesContext() أو تأتي من props
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
              <Label>Button Text (English)</Label>
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
              />
            </div>
            <div>
              <Label>Button Text (Arabic)</Label>
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
              />
            </div>
            <div>
              <Label>Select Colleges</Label>
              <div className='flex flex-col gap-2'>
                {colleges.map(college => (
                  <label key={college.id} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={
                        content.collegeIds?.includes(college.id) || false
                      }
                      onChange={e => {
                        const checked = e.target.checked;
                        let newIds = content.collegeIds
                          ? [...content.collegeIds]
                          : [];
                        if (checked) {
                          newIds.push(college.id);
                        } else {
                          newIds = newIds.filter(id => id !== college.id);
                        }
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            collegeIds: newIds,
                          },
                        });
                      }}
                    />
                    {college.name}
                  </label>
                ))}
              </div>
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
      case SectionType.OUR_MISSION:
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
              />
            </div>
            {/* add button text in 2 language */}
            <div>
              <Label>Button text (English)</Label>
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
              />
            </div>
            <div>
              <Label>Button text (Arabic)</Label>
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
          </div>
        );
      case SectionType.BLOGS:
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
              <Label>Maximum Items to Display</Label>
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
              />
            </div>
            <div className='space-y-2'>
              <Label>Display Options</Label>
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
                  />
                  <span className='text-sm'>Show only featured blogs</span>
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
                  />
                  <span className='text-sm'>Show university blogs</span>
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
                  />
                  <span className='text-sm'>Show college blogs</span>
                </label>
              </div>
            </div>
          </div>
        );

      case SectionType.CONTACT_US:
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
              <Label>Form Title (English)</Label>
              <Input
                value={content.formTitle?.en || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      formTitle: { ...content.formTitle, en: e.target.value },
                    },
                  })
                }
                placeholder='Enter English form title'
              />
            </div>
            <div>
              <Label>Form Title (Arabic)</Label>
              <Input
                value={content.formTitle?.ar || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      formTitle: { ...content.formTitle, ar: e.target.value },
                    },
                  })
                }
                placeholder='Enter Arabic form title'
              />
            </div>
            <div>
              <Label>Admin Email</Label>
              <Input
                type='email'
                value={content.adminEmail || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: {
                      ...content,
                      adminEmail: e.target.value,
                    },
                  })
                }
                placeholder='admin@university.edu'
              />
            </div>
            {/* add image url */}
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
            <div className='space-y-2'>
              <Label>Contact Information</Label>
              <div className='space-y-2'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={content.showContactInfo || false}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          showContactInfo: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className='text-sm'>Show contact information</span>
                </label>
              </div>
            </div>
            {content.showContactInfo && (
              <div className='space-y-4 border-t pt-4'>
                <h4 className='font-medium'>Contact Information</h4>
                <div>
                  <Label>Phone (English)</Label>
                  <Input
                    value={content.contactInfo?.phone?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            phone: {
                              ...content.contactInfo?.phone,
                              en: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Enter English phone'
                  />
                </div>
                <div>
                  <Label>Phone (Arabic)</Label>
                  <Input
                    value={content.contactInfo?.phone?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            phone: {
                              ...content.contactInfo?.phone,
                              ar: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Enter Arabic phone'
                  />
                </div>
                <div>
                  <Label>Address (English)</Label>
                  <Textarea
                    value={content.contactInfo?.address?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            address: {
                              ...content.contactInfo?.address,
                              en: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Enter English address'
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Address (Arabic)</Label>
                  <Textarea
                    value={content.contactInfo?.address?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            address: {
                              ...content.contactInfo?.address,
                              ar: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Enter Arabic address'
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Contact Email (English)</Label>
                  <Input
                    type='email'
                    value={content.contactInfo?.email?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            email: {
                              ...content.contactInfo?.email,
                              en: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Enter English contact email'
                  />
                </div>
                <div>
                  <Label>Contact Email (Arabic)</Label>
                  <Input
                    type='email'
                    value={content.contactInfo?.email?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            email: {
                              ...content.contactInfo?.email,
                              ar: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Enter Arabic contact email'
                  />
                </div>
              </div>
            )}
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
      case SectionType.PRESIDENT:
        return (
          <div className='space-y-4'>
            {/* Title */}
            <div className='grid grid-cols-2 gap-4'>
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
                  placeholder="e.g., President's Message"
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
                  placeholder='مثال: رسالة الرئيس'
                  dir='rtl'
                />
              </div>
            </div>

            {/* President Name */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>President Name (English)</Label>
                <Input
                  value={content.presidentName?.en || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        presidentName: {
                          ...content.presidentName,
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder='e.g., Dr. John Smith'
                />
              </div>
              <div>
                <Label>President Name (Arabic)</Label>
                <Input
                  value={content.presidentName?.ar || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        presidentName: {
                          ...content.presidentName,
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder='مثال: د. محمد أحمد'
                  dir='rtl'
                />
              </div>
            </div>

            {/* President Position */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Position (English)</Label>
                <Input
                  value={content.presidentPosition?.en || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        presidentPosition: {
                          ...content.presidentPosition,
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder='e.g., University President'
                />
              </div>
              <div>
                <Label>Position (Arabic)</Label>
                <Input
                  value={content.presidentPosition?.ar || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        presidentPosition: {
                          ...content.presidentPosition,
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder='مثال: رئيس الجامعة'
                  dir='rtl'
                />
              </div>
            </div>

            {/* President Image */}
            <div>
              <Label>President Image</Label>
              <div className='flex gap-2'>
                <Input
                  value={content.imageUrl || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: { ...content, imageUrl: e.target.value },
                    })
                  }
                  placeholder='Enter image URL or click to select'
                  readOnly
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onImageSelect('imageUrl')}
                >
                  <ImageIcon className='h-4 w-4' />
                </Button>
              </div>
              {content.imageUrl && (
                <div className='mt-2'>
                  <Image
                    src={content.imageUrl}
                    alt='President'
                    width={150}
                    height={150}
                    className='rounded-lg object-cover'
                  />
                </div>
              )}
            </div>

            {/* Signature Image (Optional) */}
            <div>
              <Label>Signature Image (Optional)</Label>
              <div className='flex gap-2'>
                <Input
                  value={content.signature || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: { ...content, signature: e.target.value },
                    })
                  }
                  placeholder='Enter signature image URL or click to select'
                  readOnly
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onImageSelect('signature')}
                >
                  <ImageIcon className='h-4 w-4' />
                </Button>
              </div>
              {content.signature && (
                <div className='mt-2'>
                  <Image
                    src={content.signature}
                    alt='Signature'
                    width={120}
                    height={60}
                    className='object-contain'
                  />
                </div>
              )}
            </div>

            {/* Message */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Message (English)</Label>
                <Textarea
                  value={content.message?.en || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        message: { ...content.message, en: e.target.value },
                      },
                    })
                  }
                  placeholder='Enter the president message in English...'
                  rows={8}
                  className='font-serif'
                />
              </div>
              <div>
                <Label>Message (Arabic)</Label>
                <Textarea
                  value={content.message?.ar || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      content: {
                        ...content,
                        message: { ...content.message, ar: e.target.value },
                      },
                    })
                  }
                  placeholder='أدخل رسالة الرئيس بالعربية...'
                  rows={8}
                  dir='rtl'
                  className='font-serif'
                />
              </div>
            </div>
          </div>
        );
      case SectionType.STUDENT_ACTIVITIES:
        return (
          <div className='space-y-6'>
            {/* Main Title */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Section Title (English)</Label>
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
                  placeholder='e.g., Student Activities'
                />
              </div>
              <div>
                <Label>Section Title (Arabic)</Label>
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
                  placeholder='مثال: الأنشطة الطلابية'
                />
              </div>
            </div>

            {/* Student Union Section */}
            <div className='p-4 bg-white border-2 border-blue-300 rounded-lg space-y-4'>
              <h4 className='font-semibold text-blue-700 text-lg bg-blue-100 -m-4 mb-4 p-4 rounded-t-md'>
                Student Union
              </h4>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Title (English)
                  </Label>
                  <Input
                    className='text-gray-900'
                    value={content.studentUnion?.title?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentUnion: {
                            ...content.studentUnion,
                            title: {
                              ...content.studentUnion?.title,
                              en: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Student Union'
                  />
                </div>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Title (Arabic)
                  </Label>
                  <Input
                    className='text-gray-900'
                    value={content.studentUnion?.title?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentUnion: {
                            ...content.studentUnion,
                            title: {
                              ...content.studentUnion?.title,
                              ar: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='اتحاد الطلاب'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Description (English)
                  </Label>
                  <Textarea
                    className='text-gray-900'
                    value={content.studentUnion?.description?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentUnion: {
                            ...content.studentUnion,
                            description: {
                              ...content.studentUnion?.description,
                              en: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Description...'
                    rows={3}
                  />
                </div>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Description (Arabic)
                  </Label>
                  <Textarea
                    className='text-gray-900'
                    value={content.studentUnion?.description?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentUnion: {
                            ...content.studentUnion,
                            description: {
                              ...content.studentUnion?.description,
                              ar: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='الوصف...'
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label className='text-gray-800 font-medium'>Image URL</Label>
                <div className='flex gap-2'>
                  <Input
                    className='text-gray-900'
                    value={content.studentUnion?.imageUrl || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentUnion: {
                            ...content.studentUnion,
                            imageUrl: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder='Image URL'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => onImageSelect('studentUnion.imageUrl')}
                  >
                    <ImageIcon className='h-4 w-4' />
                  </Button>
                </div>
                {content.studentUnion?.imageUrl && (
                  <div className='mt-2'>
                    <Image
                      width={150}
                      height={100}
                      src={content.studentUnion.imageUrl}
                      alt='Student Union'
                      className='rounded-lg object-cover'
                    />
                  </div>
                )}
              </div>

              {/* Items List */}
              <div>
                <Label className='text-gray-800 font-medium'>Items</Label>
                <div className='space-y-3'>
                  {(content.studentUnion?.items || []).map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className='border border-blue-200 rounded-lg p-3 bg-blue-50/30'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm font-semibold text-blue-800'>
                            Item {index + 1}
                          </span>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const newItems = (
                                content.studentUnion?.items || []
                              ).filter((_: any, i: number) => i !== index);
                              setFormData({
                                ...formData,
                                content: {
                                  ...content,
                                  studentUnion: {
                                    ...content.studentUnion,
                                    items: newItems,
                                  },
                                },
                              });
                            }}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                          <div>
                            <Label className='text-xs text-gray-700'>
                              English
                            </Label>
                            <Input
                              className='text-gray-900'
                              value={item?.en || ''}
                              onChange={e => {
                                const newItems = [
                                  ...(content.studentUnion?.items || []),
                                ];
                                newItems[index] = {
                                  ...newItems[index],
                                  en: e.target.value,
                                };
                                setFormData({
                                  ...formData,
                                  content: {
                                    ...content,
                                    studentUnion: {
                                      ...content.studentUnion,
                                      items: newItems,
                                    },
                                  },
                                });
                              }}
                              placeholder='Enter item in English'
                            />
                          </div>
                          <div>
                            <Label className='text-xs text-gray-700'>
                              Arabic
                            </Label>
                            <Input
                              className='text-gray-900'
                              value={item?.ar || ''}
                              onChange={e => {
                                const newItems = [
                                  ...(content.studentUnion?.items || []),
                                ];
                                newItems[index] = {
                                  ...newItems[index],
                                  ar: e.target.value,
                                };
                                setFormData({
                                  ...formData,
                                  content: {
                                    ...content,
                                    studentUnion: {
                                      ...content.studentUnion,
                                      items: newItems,
                                    },
                                  },
                                });
                              }}
                              placeholder='أدخل العنصر بالعربية'
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const newItems = [
                        ...(content.studentUnion?.items || []),
                        { en: '', ar: '' },
                      ];
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentUnion: {
                            ...content.studentUnion,
                            items: newItems,
                          },
                        },
                      });
                    }}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Add Item
                  </Button>
                </div>
              </div>

              {/* Head Member */}
              <div className='border-t-2 border-blue-200 pt-4 mt-4'>
                <Label className='text-base font-bold mb-3 block text-blue-800 bg-blue-50 px-3 py-2 rounded'>
                  👤 Head Member
                </Label>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-gray-800 font-medium'>
                      Name (English)
                    </Label>
                    <Input
                      className='text-gray-900'
                      value={content.studentUnion?.head?.name?.en || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentUnion: {
                              ...content.studentUnion,
                              head: {
                                ...content.studentUnion?.head,
                                name: {
                                  ...content.studentUnion?.head?.name,
                                  en: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                      placeholder='John Doe'
                    />
                  </div>
                  <div>
                    <Label className='text-gray-800 font-medium'>
                      Name (Arabic)
                    </Label>
                    <Input
                      className='text-gray-900'
                      value={content.studentUnion?.head?.name?.ar || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentUnion: {
                              ...content.studentUnion,
                              head: {
                                ...content.studentUnion?.head,
                                name: {
                                  ...content.studentUnion?.head?.name,
                                  ar: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                      placeholder='جون دو'
                    />
                  </div>
                </div>
                <div className='mt-3'>
                  <Label className='text-gray-800 font-medium'>Photo URL</Label>
                  <div className='flex gap-2'>
                    <Input
                      className='text-gray-900'
                      value={content.studentUnion?.head?.imageUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentUnion: {
                              ...content.studentUnion,
                              head: {
                                ...content.studentUnion?.head,
                                imageUrl: e.target.value,
                              },
                            },
                          },
                        })
                      }
                      placeholder='Image URL'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        onImageSelect('studentUnion.head.imageUrl')
                      }
                    >
                      <ImageIcon className='h-4 w-4' />
                    </Button>
                  </div>
                  {content.studentUnion?.head?.imageUrl && (
                    <div className='mt-2'>
                      <Image
                        width={80}
                        height={80}
                        src={content.studentUnion.head.imageUrl}
                        alt='Head'
                        className='rounded-full object-cover'
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Vice Member */}
              <div className='border-t-2 border-blue-200 pt-4 mt-4'>
                <Label className='text-base font-bold mb-3 block text-blue-800 bg-blue-50 px-3 py-2 rounded'>
                  👤 Vice Head Member
                </Label>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-gray-800 font-medium'>
                      Name (English)
                    </Label>
                    <Input
                      className='text-gray-900'
                      value={content.studentUnion?.vice?.name?.en || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentUnion: {
                              ...content.studentUnion,
                              vice: {
                                ...content.studentUnion?.vice,
                                name: {
                                  ...content.studentUnion?.vice?.name,
                                  en: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                      placeholder='Jane Smith'
                    />
                  </div>
                  <div>
                    <Label>Name (Arabic)</Label>
                    <Input
                      value={content.studentUnion?.vice?.name?.ar || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentUnion: {
                              ...content.studentUnion,
                              vice: {
                                ...content.studentUnion?.vice,
                                name: {
                                  ...content.studentUnion?.vice?.name,
                                  ar: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                      placeholder='جين سميث'
                    />
                  </div>
                </div>
                <div className='mt-3'>
                  <Label className='text-gray-800 font-medium'>Photo URL</Label>
                  <div className='flex gap-2'>
                    <Input
                      className='text-gray-900'
                      value={content.studentUnion?.vice?.imageUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentUnion: {
                              ...content.studentUnion,
                              vice: {
                                ...content.studentUnion?.vice,
                                imageUrl: e.target.value,
                              },
                            },
                          },
                        })
                      }
                      placeholder='Image URL'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        onImageSelect('studentUnion.vice.imageUrl')
                      }
                    >
                      <ImageIcon className='h-4 w-4' />
                    </Button>
                  </div>
                  {content.studentUnion?.vice?.imageUrl && (
                    <div className='mt-2'>
                      <Image
                        width={80}
                        height={80}
                        src={content.studentUnion.vice.imageUrl}
                        alt='Vice'
                        className='rounded-full object-cover'
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Link */}
              <div className='border-t-2 border-blue-200 pt-4 mt-4'>
                <Label className='text-base font-bold mb-3 block text-blue-800 bg-blue-50 px-3 py-2 rounded'>
                  🔗 Page Link
                </Label>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Link URL (e.g., /student-union)
                  </Label>
                  <Input
                    className='text-gray-900'
                    value={content.studentUnion?.link || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentUnion: {
                            ...content.studentUnion,
                            link: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder='/student-union'
                  />
                </div>
              </div>
            </div>

            {/* Student Family Section */}
            <div className='p-4 bg-white border-2 border-purple-300 rounded-lg space-y-4'>
              <h4 className='font-semibold text-purple-700 text-lg bg-purple-100 -m-4 mb-4 p-4 rounded-t-md'>
                Student Family
              </h4>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Title (English)
                  </Label>
                  <Input
                    className='text-gray-900'
                    value={content.studentFamily?.title?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentFamily: {
                            ...content.studentFamily,
                            title: {
                              ...content.studentFamily?.title,
                              en: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Student Family'
                  />
                </div>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Title (Arabic)
                  </Label>
                  <Input
                    className='text-gray-900'
                    value={content.studentFamily?.title?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentFamily: {
                            ...content.studentFamily,
                            title: {
                              ...content.studentFamily?.title,
                              ar: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='الأسر الطلابية'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Description (English)
                  </Label>
                  <Textarea
                    className='text-gray-900'
                    value={content.studentFamily?.description?.en || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentFamily: {
                            ...content.studentFamily,
                            description: {
                              ...content.studentFamily?.description,
                              en: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='Description...'
                    rows={3}
                  />
                </div>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Description (Arabic)
                  </Label>
                  <Textarea
                    className='text-gray-900'
                    value={content.studentFamily?.description?.ar || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentFamily: {
                            ...content.studentFamily,
                            description: {
                              ...content.studentFamily?.description,
                              ar: e.target.value,
                            },
                          },
                        },
                      })
                    }
                    placeholder='الوصف...'
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label className='text-gray-800 font-medium'>Image URL</Label>
                <div className='flex gap-2'>
                  <Input
                    className='text-gray-900'
                    value={content.studentFamily?.imageUrl || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentFamily: {
                            ...content.studentFamily,
                            imageUrl: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder='Image URL'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => onImageSelect('studentFamily.imageUrl')}
                  >
                    <ImageIcon className='h-4 w-4' />
                  </Button>
                </div>
                {content.studentFamily?.imageUrl && (
                  <div className='mt-2'>
                    <Image
                      width={150}
                      height={100}
                      src={content.studentFamily.imageUrl}
                      alt='Student Family'
                      className='rounded-lg object-cover'
                    />
                  </div>
                )}
              </div>

              {/* Items List */}
              <div>
                <Label className='text-gray-800 font-medium'>Items</Label>
                <div className='space-y-3'>
                  {(content.studentFamily?.items || []).map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className='border border-purple-200 rounded-lg p-3 bg-purple-50/30'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm font-semibold text-purple-800'>
                            Item {index + 1}
                          </span>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const newItems = (
                                content.studentFamily?.items || []
                              ).filter((_: any, i: number) => i !== index);
                              setFormData({
                                ...formData,
                                content: {
                                  ...content,
                                  studentFamily: {
                                    ...content.studentFamily,
                                    items: newItems,
                                  },
                                },
                              });
                            }}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                          <div>
                            <Label className='text-xs text-gray-700'>
                              English
                            </Label>
                            <Input
                              className='text-gray-900'
                              value={item?.en || ''}
                              onChange={e => {
                                const newItems = [
                                  ...(content.studentFamily?.items || []),
                                ];
                                newItems[index] = {
                                  ...newItems[index],
                                  en: e.target.value,
                                };
                                setFormData({
                                  ...formData,
                                  content: {
                                    ...content,
                                    studentFamily: {
                                      ...content.studentFamily,
                                      items: newItems,
                                    },
                                  },
                                });
                              }}
                              placeholder='Enter item in English'
                            />
                          </div>
                          <div>
                            <Label className='text-xs text-gray-700'>
                              Arabic
                            </Label>
                            <Input
                              className='text-gray-900'
                              value={item?.ar || ''}
                              onChange={e => {
                                const newItems = [
                                  ...(content.studentFamily?.items || []),
                                ];
                                newItems[index] = {
                                  ...newItems[index],
                                  ar: e.target.value,
                                };
                                setFormData({
                                  ...formData,
                                  content: {
                                    ...content,
                                    studentFamily: {
                                      ...content.studentFamily,
                                      items: newItems,
                                    },
                                  },
                                });
                              }}
                              placeholder='أدخل العنصر بالعربية'
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const newItems = [
                        ...(content.studentFamily?.items || []),
                        { en: '', ar: '' },
                      ];
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentFamily: {
                            ...content.studentFamily,
                            items: newItems,
                          },
                        },
                      });
                    }}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Add Item
                  </Button>
                </div>
              </div>

              {/* Head Member */}
              <div className='border-t-2 border-purple-200 pt-4 mt-4'>
                <Label className='text-base font-bold mb-3 block text-purple-800 bg-purple-50 px-3 py-2 rounded'>
                  👤 Head Member
                </Label>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-gray-800 font-medium'>
                      Name (English)
                    </Label>
                    <Input
                      className='text-gray-900'
                      value={content.studentFamily?.head?.name?.en || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentFamily: {
                              ...content.studentFamily,
                              head: {
                                ...content.studentFamily?.head,
                                name: {
                                  ...content.studentFamily?.head?.name,
                                  en: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                      placeholder='John Doe'
                    />
                  </div>
                  <div>
                    <Label className='text-gray-800 font-medium'>
                      Name (Arabic)
                    </Label>
                    <Input
                      className='text-gray-900'
                      value={content.studentFamily?.head?.name?.ar || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentFamily: {
                              ...content.studentFamily,
                              head: {
                                ...content.studentFamily?.head,
                                name: {
                                  ...content.studentFamily?.head?.name,
                                  ar: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                      placeholder='جون دو'
                    />
                  </div>
                </div>
                <div className='mt-3'>
                  <Label className='text-gray-800 font-medium'>Photo URL</Label>
                  <div className='flex gap-2'>
                    <Input
                      className='text-gray-900'
                      value={content.studentFamily?.head?.imageUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentFamily: {
                              ...content.studentFamily,
                              head: {
                                ...content.studentFamily?.head,
                                imageUrl: e.target.value,
                              },
                            },
                          },
                        })
                      }
                      placeholder='Image URL'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        onImageSelect('studentFamily.head.imageUrl')
                      }
                    >
                      <ImageIcon className='h-4 w-4' />
                    </Button>
                  </div>
                  {content.studentFamily?.head?.imageUrl && (
                    <div className='mt-2'>
                      <Image
                        width={80}
                        height={80}
                        src={content.studentFamily.head.imageUrl}
                        alt='Head'
                        className='rounded-full object-cover'
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Vice Member */}
              <div className='border-t-2 border-purple-200 pt-4 mt-4'>
                <Label className='text-base font-bold mb-3 block text-purple-800 bg-purple-50 px-3 py-2 rounded'>
                  👤 Vice Head Member
                </Label>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-gray-800 font-medium'>
                      Name (English)
                    </Label>
                    <Input
                      className='text-gray-900'
                      value={content.studentFamily?.vice?.name?.en || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentFamily: {
                              ...content.studentFamily,
                              vice: {
                                ...content.studentFamily?.vice,
                                name: {
                                  ...content.studentFamily?.vice?.name,
                                  en: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                      placeholder='Jane Smith'
                    />
                  </div>
                  <div>
                    <Label className='text-gray-800 font-medium'>
                      Name (Arabic)
                    </Label>
                    <Input
                      className='text-gray-900'
                      value={content.studentFamily?.vice?.name?.ar || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentFamily: {
                              ...content.studentFamily,
                              vice: {
                                ...content.studentFamily?.vice,
                                name: {
                                  ...content.studentFamily?.vice?.name,
                                  ar: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                      placeholder='جين سميث'
                    />
                  </div>
                </div>
                <div className='mt-3'>
                  <Label className='text-gray-800 font-medium'>Photo URL</Label>
                  <div className='flex gap-2'>
                    <Input
                      className='text-gray-900'
                      value={content.studentFamily?.vice?.imageUrl || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          content: {
                            ...content,
                            studentFamily: {
                              ...content.studentFamily,
                              vice: {
                                ...content.studentFamily?.vice,
                                imageUrl: e.target.value,
                              },
                            },
                          },
                        })
                      }
                      placeholder='Image URL'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        onImageSelect('studentFamily.vice.imageUrl')
                      }
                    >
                      <ImageIcon className='h-4 w-4' />
                    </Button>
                  </div>
                  {content.studentFamily?.vice?.imageUrl && (
                    <div className='mt-2'>
                      <Image
                        width={80}
                        height={80}
                        src={content.studentFamily.vice.imageUrl}
                        alt='Vice'
                        className='rounded-full object-cover'
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Link */}
              <div className='border-t-2 border-purple-200 pt-4 mt-4'>
                <Label className='text-base font-bold mb-3 block text-purple-800 bg-purple-50 px-3 py-2 rounded'>
                  🔗 Page Link
                </Label>
                <div>
                  <Label className='text-gray-800 font-medium'>
                    Link URL (e.g., /student-family)
                  </Label>
                  <Input
                    className='text-gray-900'
                    value={content.studentFamily?.link || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        content: {
                          ...content,
                          studentFamily: {
                            ...content.studentFamily,
                            link: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder='/student-family'
                  />
                </div>
              </div>
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
        <Button type='button' variant='outline' onClick={() => { }}>
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
