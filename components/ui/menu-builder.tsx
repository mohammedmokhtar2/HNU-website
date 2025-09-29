'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Minus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Check,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageService } from '@/services/pageService';
import { Page } from '@/types/page';

interface BaseContent {
  ar: string;
  en: string;
}

interface MenuItem {
  id: string;
  title: BaseContent;
  href: string;
  linkType?: 'page' | 'external'; // Add linkType to distinguish between page links and external links
  pageId?: string; // Add pageId to store the selected page ID
  submenu?: MenuItem[];
}

interface MenuBuilderProps {
  value: MenuItem[];
  onChange: (menuItems: MenuItem[]) => void;
  universityId?: string; // Add universityId for fetching pages
}

export function MenuBuilder({
  value,
  onChange,
  universityId,
}: MenuBuilderProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [availablePages, setAvailablePages] = useState<Page[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Fetch available pages when component mounts or universityId changes
  useEffect(() => {
    const fetchPages = async () => {
      if (!universityId) return;

      setLoadingPages(true);
      try {
        const response = await PageService.getPagesByUniversity(universityId);
        setAvailablePages(response || []);
      } catch (error) {
        console.error('Error fetching pages:', error);
        setAvailablePages([]);
      } finally {
        setLoadingPages(false);
      }
    };

    fetchPages();
  }, [universityId]);

  const getPageTitle = (title: any) => {
    if (typeof title === 'object' && title !== null) {
      return title.en || title.ar || 'Untitled Page';
    }
    return title || 'Untitled Page';
  };

  const getMenuTitle = (title: BaseContent, locale: 'ar' | 'en' = 'en') => {
    return title[locale] || title.en || title.ar || 'Untitled';
  };

  const addMenuItem = (parentId?: string) => {
    const newItem: MenuItem = {
      id: generateId(),
      title: { ar: 'عنصر قائمة جديد', en: 'New Menu Item' },
      href: '#',
      linkType: 'external',
      submenu: [],
    };

    if (parentId) {
      const updatedItems = value.map(item =>
        item.id === parentId
          ? { ...item, submenu: [...(item.submenu || []), newItem] }
          : item
      );
      onChange(updatedItems);
    } else {
      onChange([...value, newItem]);
    }
    setEditingItem(newItem.id);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updateItem = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.submenu) {
          return { ...item, submenu: updateItem(item.submenu) };
        }
        return item;
      });
    };
    onChange(updateItem(value));
  };

  const deleteMenuItem = (id: string) => {
    const deleteItem = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter(item => item.id !== id)
        .map(item => {
          if (item.submenu) {
            return { ...item, submenu: deleteItem(item.submenu) };
          }
          return item;
        });
    };
    onChange(deleteItem(value));
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isEditing = editingItem === item.id;

    return (
      <div key={item.id} className='border rounded-lg mb-2'>
        <div
          className={cn(
            'flex items-center gap-2 p-3',
            level > 0 && 'ml-4 bg-transparent'
          )}
        >
          {hasSubmenu && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => toggleExpanded(item.id)}
              className='h-6 w-6 p-0'
            >
              {isExpanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </Button>
          )}

          {!hasSubmenu && <div className='w-6' />}

          {isEditing ? (
            <div className='flex-1 space-y-3'>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <Label className='text-xs text-gray-600'>
                    Menu Title (English)
                  </Label>
                  <Input
                    value={item.title.en}
                    onChange={e =>
                      updateMenuItem(item.id, {
                        title: { ...item.title, en: e.target.value },
                      })
                    }
                    className='mt-1'
                    placeholder='English title'
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-600'>
                    Menu Title (Arabic)
                  </Label>
                  <Input
                    value={item.title.ar}
                    onChange={e =>
                      updateMenuItem(item.id, {
                        title: { ...item.title, ar: e.target.value },
                      })
                    }
                    className='mt-1'
                    placeholder='العنوان بالعربية'
                    dir='rtl'
                  />
                </div>
              </div>

              <div>
                <Label className='text-xs text-gray-600 flex items-center gap-1'>
                  Link Type
                  <div className='flex gap-1'>
                    <button
                      type='button'
                      onClick={() =>
                        updateMenuItem(item.id, { linkType: 'page' })
                      }
                      className={cn(
                        'px-2 py-1 text-xs rounded',
                        item.linkType === 'page'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      )}
                    >
                      <FileText className='h-3 w-3 inline mr-1' />
                      Page
                    </button>
                    <button
                      type='button'
                      onClick={() =>
                        updateMenuItem(item.id, { linkType: 'external' })
                      }
                      className={cn(
                        'px-2 py-1 text-xs rounded',
                        item.linkType === 'external'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      )}
                    >
                      <ExternalLink className='h-3 w-3 inline mr-1' />
                      External
                    </button>
                  </div>
                </Label>
              </div>

              {item.linkType === 'page' ? (
                <div>
                  <Label className='text-xs text-gray-600'>Select Page</Label>
                  <Select
                    value={item.pageId || ''}
                    onValueChange={pageId => {
                      const selectedPage = availablePages.find(
                        p => p.id === pageId
                      );
                      if (selectedPage) {
                        updateMenuItem(item.id, {
                          pageId: pageId,
                          href: `/pages/${selectedPage.slug}`,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className='mt-1'>
                      <SelectValue
                        placeholder={
                          loadingPages ? 'Loading pages...' : 'Select a page'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePages.map(page => (
                        <SelectItem key={page.id} value={page.id}>
                          <div className='flex items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            <span>{getPageTitle(page.title)}</span>
                            <span className='text-xs text-gray-500'>
                              ({page.slug})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      {availablePages.length === 0 && !loadingPages && (
                        <SelectItem value='' disabled>
                          No pages available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label className='text-xs text-gray-600'>External URL</Label>
                  <Input
                    value={item.href}
                    onChange={e =>
                      updateMenuItem(item.id, { href: e.target.value })
                    }
                    className='mt-1'
                    placeholder='https://example.com'
                  />
                </div>
              )}

              <div className='flex gap-2'>
                <Button size='sm' onClick={() => setEditingItem(null)}>
                  <Check className='h-4 w-4 mr-1' />
                  Save
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <div className='flex flex-col'>
                    <span className='font-medium'>
                      {getMenuTitle(item.title, 'en')}
                    </span>
                    <span className='text-sm text-gray-600' dir='rtl'>
                      {getMenuTitle(item.title, 'ar')}
                    </span>
                  </div>
                  {item.linkType === 'page' && (
                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'>
                      <FileText className='h-3 w-3 mr-1' />
                      Page
                    </span>
                  )}
                  {item.linkType === 'external' && (
                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'>
                      <ExternalLink className='h-3 w-3 mr-1' />
                      External
                    </span>
                  )}
                </div>
                <div className='text-sm text-gray-500'>{item.href}</div>
                {item.linkType === 'page' && item.pageId && (
                  <div className='text-xs text-blue-600'>
                    Page:{' '}
                    {availablePages.find(p => p.id === item.pageId)?.slug ||
                      'Unknown page'}
                  </div>
                )}
              </div>
              <div className='flex gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setEditingItem(item.id)}
                >
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => addMenuItem(item.id)}
                >
                  <Plus className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => deleteMenuItem(item.id)}
                  className='text-red-500 hover:text-red-700'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </>
          )}
        </div>

        {hasSubmenu && isExpanded && (
          <div className='ml-6'>
            {item.submenu?.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Menu Builder
          <Button onClick={() => addMenuItem()}>
            <Plus className='h-4 w-4 mr-2' />
            Add Menu Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {value.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              No menu items yet. Click "Add Menu Item" to get started.
            </div>
          ) : (
            value.map(item => renderMenuItem(item))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
