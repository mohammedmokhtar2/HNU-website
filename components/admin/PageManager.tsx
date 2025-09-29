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
  FolderOpen,
  Eye,
  Settings,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCollege } from '@/contexts/CollegeContext';
import { Page, CreatePageInput, UpdatePageInput } from '@/types/page';
import { PageService } from '@/services/pageService';
import { PageSectionManager } from './PageSectionManager';

interface PageManagerProps {
  universityId: string;
  onPagesChange?: (pages: Page[]) => void;
}

// Sortable Page Item Component
function SortablePageItem({
  page,
  onEdit,
  onDelete,
  onViewSections,
}: {
  page: Page;
  onEdit: (page: Page) => void;
  onDelete: (id: string) => void;
  onViewSections: (page: Page) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPageTitle = (title: any) => {
    if (typeof title === 'object' && title !== null) {
      return title.en || title.ar || 'Untitled Page';
    }
    return title || 'Untitled Page';
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

          {/* Page Info */}
          <div className='flex-1'>
            <div className='flex items-center gap-3'>
              <FolderOpen className='h-5 w-5 text-blue-500' />
              <div>
                <h3 className='font-medium text-gray-300'>
                  {getPageTitle(page.title)}
                </h3>
                <p className='text-sm text-gray-500'>Slug: /{page.slug}</p>
                <div className='flex items-center gap-2 mt-1'>
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      page.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {page.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onViewSections(page)}
              className='bg-blue-50 text-white hover:bg-blue-100'
            >
              <Settings className='h-4 w-4 mr-1' />
              Manage Sections
            </Button>
            <Button variant='outline' size='sm' onClick={() => onEdit(page)}>
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onDelete(page.id)}
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

export function PageManager({ universityId, onPagesChange }: PageManagerProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPageForSections, setSelectedPageForSections] =
    useState<Page | null>(null);
  const { success, error: showError } = useToast();

  const collegeContext = useCollege();
  const colleges = collegeContext.colleges.map(college => ({
    id: college.id,
    name: college.name.en || college.name.ar || '',
  }));

  // Use refs to store the latest callback functions to avoid stale closures
  const onPagesChangeRef = useRef(onPagesChange);
  const showErrorRef = useRef(showError);

  // Update refs when props change
  useEffect(() => {
    onPagesChangeRef.current = onPagesChange;
  }, [onPagesChange]);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  // Form state
  const [formData, setFormData] = useState<{
    title: { ar: string; en: string };
    slug: string;
    isActive: boolean;
    collageId?: string;
  }>({
    title: { ar: '', en: '' },
    slug: '',
    isActive: true,
    collageId: undefined,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadPages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PageService.getPagesByUniversity(universityId);
      setPages(data);
      onPagesChangeRef.current?.(data);
    } catch (error) {
      console.error('Error loading pages:', error);
      showErrorRef.current('Failed to load pages');
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Memoize the page IDs for drag and drop to prevent unnecessary re-renders
  const pageIds = useMemo(() => pages.map(p => p.id), [pages]);

  const handleCreate = async () => {
    try {
      const newPageData: CreatePageInput = {
        title: formData.title,
        slug: formData.slug,
        isActive: formData.isActive,
        collageId: formData.collageId,
        universityId,
      };

      const newPage = await PageService.createPage(newPageData);
      setPages([...pages, newPage]);
      setIsCreateDialogOpen(false);
      resetForm();
      success('Page created successfully');
    } catch (error) {
      console.error('Error creating page:', error);
      showError('Failed to create page');
    }
  };

  const handleUpdate = async () => {
    if (!editingPage) return;

    try {
      const updateData: UpdatePageInput = {
        title: formData.title,
        slug: formData.slug,
        isActive: formData.isActive,
        collageId: formData.collageId,
      };

      const updatedPage = await PageService.updatePage(
        editingPage.id,
        updateData
      );
      setPages(pages.map(p => (p.id === editingPage.id ? updatedPage : p)));
      setIsEditDialogOpen(false);
      setEditingPage(null);
      resetForm();
      success('Page updated successfully');
    } catch (error) {
      console.error('Error updating page:', error);
      showError('Failed to update page');
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this page? This will also delete all its sections.'
      )
    )
      return;

    try {
      await PageService.deletePage(id);
      setPages(pages.filter(p => p.id !== id));
      success('Page deleted successfully');
    } catch (error) {
      console.error('Error deleting page:', error);
      showError('Failed to delete page');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = pages.findIndex(page => page.id === active.id);
      const newIndex = pages.findIndex(page => page.id === over?.id);

      const newPages = arrayMove(pages, oldIndex, newIndex);
      setPages(newPages);

      try {
        // Update order for all affected pages
        const updatePromises = newPages.map((page, index) =>
          PageService.updatePage(page.id, { order: index })
        );
        await Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating page order:', error);
        showError('Failed to update page order');
        loadPages(); // Reload to get correct order
      }
    }
  };

  const openEditDialog = (page: Page) => {
    setEditingPage(page);
    const pageTitle = (page.title as { ar?: string; en?: string }) || {};
    setFormData({
      title: {
        ar: pageTitle.ar || '',
        en: pageTitle.en || '',
      },
      slug: page.slug,
      isActive: page.isActive ?? true,
      collageId: page.collageId,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: { ar: '', en: '' },
      slug: '',
      isActive: true,
      collageId: undefined,
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleViewSections = (page: Page) => {
    setSelectedPageForSections(page);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-500'>Loading pages...</div>
      </div>
    );
  }

  if (selectedPageForSections) {
    // We'll create a placeholder for now since PageSectionManager doesn't exist yet
    return (
      <div className='space-y-4'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            onClick={() => setSelectedPageForSections(null)}
          >
            ← Back to Pages
          </Button>
          <div>
            <h3 className='text-lg font-semibold'>
              Managing Sections for:{' '}
              {typeof selectedPageForSections.title === 'object'
                ? selectedPageForSections.title.en ||
                  selectedPageForSections.title.ar
                : selectedPageForSections.title}
            </h3>
            <p className='text-sm text-gray-500'>
              Slug: /{selectedPageForSections.slug}
            </p>
          </div>
        </div>
        <PageSectionManager
          pageId={selectedPageForSections.id}
          onSectionsChange={() => {}} // Handle if needed
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-white'>Pages Management</h3>
          <p className='text-sm text-gray-500'>
            Create and manage university pages with their sections
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}
          className='bg-blue-600 hover:bg-blue-700 text-white'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add New Page
        </Button>
      </div>

      {/* Pages List with Drag and Drop */}
      <div className='space-y-4'>
        {pages.length === 0 ? (
          <Card className='border-dashed'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <FolderOpen className='h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No pages yet
              </h3>
              <p className='text-sm text-gray-500 mb-4'>
                Create your first page to get started
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setIsCreateDialogOpen(true);
                }}
                className='bg-blue-600 hover:bg-blue-700'
              >
                <Plus className='h-4 w-4 mr-2' />
                Create First Page
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
              items={pageIds}
              strategy={verticalListSortingStrategy}
            >
              {pages.map(page => (
                <SortablePageItem
                  key={page.id}
                  page={page}
                  onEdit={openEditDialog}
                  onDelete={handleDelete}
                  onViewSections={handleViewSections}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          <PageForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreate}
            submitLabel='Create Page'
            colleges={colleges}
            onSlugGenerate={generateSlug}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
          </DialogHeader>
          <PageForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            submitLabel='Update Page'
            colleges={colleges}
            onSlugGenerate={generateSlug}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PageFormProps {
  formData: {
    title: { ar: string; en: string };
    slug: string;
    isActive: boolean;
    collageId?: string;
  };
  setFormData: (data: any) => void;
  onSubmit: () => void;
  submitLabel: string;
  colleges: Array<{ id: string; name: string }>;
  onSlugGenerate: (title: string) => string;
}

function PageForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel,
  colleges,
  onSlugGenerate,
}: PageFormProps) {
  const handleTitleChange = (lang: 'ar' | 'en', value: string) => {
    const newTitle = { ...formData.title, [lang]: value };
    setFormData({ ...formData, title: newTitle });

    // Auto-generate slug from English title
    if (lang === 'en' && value && !formData.slug) {
      setFormData({
        ...formData,
        title: newTitle,
        slug: onSlugGenerate(value),
      });
    }
  };

  return (
    <div className='space-y-6'>
      {/* Page Title */}
      <div className='space-y-4'>
        <Label className='text-sm font-medium'>Page Title</Label>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label className='text-xs text-gray-500'>English</Label>
            <Input
              value={formData.title.en}
              onChange={e => handleTitleChange('en', e.target.value)}
              placeholder='About Us'
              className='mt-1'
            />
          </div>
          <div>
            <Label className='text-xs text-gray-500'>Arabic</Label>
            <Input
              value={formData.title.ar}
              onChange={e => handleTitleChange('ar', e.target.value)}
              placeholder='عن الجامعة'
              className='mt-1'
            />
          </div>
        </div>
      </div>

      {/* Slug */}
      <div>
        <Label className='text-sm font-medium'>Page Slug</Label>
        <div className='flex items-center mt-1'>
          <span className='text-sm text-gray-500 mr-1'>/</span>
          <Input
            value={formData.slug}
            onChange={e => setFormData({ ...formData, slug: e.target.value })}
            placeholder='about-us'
            className='flex-1'
          />
        </div>
        <p className='text-xs text-gray-500 mt-1'>
          This will be used in the URL. Use lowercase letters, numbers, and
          hyphens only.
        </p>
      </div>

      {/* College Selection */}
      <div>
        <Label className='text-sm font-medium'>College (Optional)</Label>
        <Select
          value={formData.collageId || 'none'}
          onValueChange={value =>
            setFormData({
              ...formData,
              collageId: value === 'none' ? undefined : value,
            })
          }
        >
          <SelectTrigger className='mt-1'>
            <SelectValue placeholder='Select a college (optional)' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='none'>No specific college</SelectItem>
            {colleges.map(college => (
              <SelectItem key={college.id} value={college.id}>
                {college.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div>
        <Label className='text-sm font-medium'>Status</Label>
        <Select
          value={formData.isActive.toString()}
          onValueChange={value =>
            setFormData({ ...formData, isActive: value === 'true' })
          }
        >
          <SelectTrigger className='mt-1'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='true'>Active</SelectItem>
            <SelectItem value='false'>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        className='w-full'
        disabled={!formData.title.en && !formData.title.ar}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
