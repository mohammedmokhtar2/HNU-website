'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Minus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  title: string;
  href: string;
  submenu?: MenuItem[];
}

interface MenuBuilderProps {
  value: MenuItem[];
  onChange: (menuItems: MenuItem[]) => void;
}

export function MenuBuilder({ value, onChange }: MenuBuilderProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addMenuItem = (parentId?: string) => {
    const newItem: MenuItem = {
      id: generateId(),
      title: 'New Menu Item',
      href: '#',
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
      return items.filter(item => {
        if (item.id === id) return false;
        if (item.submenu) {
          return { ...item, submenu: deleteItem(item.submenu) };
        }
        return true;
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
            level > 0 && 'ml-4 bg-gray-50'
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
            <div className='flex-1 flex gap-2'>
              <Input
                value={item.title}
                onChange={e =>
                  updateMenuItem(item.id, { title: e.target.value })
                }
                className='flex-1'
                placeholder='Menu title'
              />
              <Input
                value={item.href}
                onChange={e =>
                  updateMenuItem(item.id, { href: e.target.value })
                }
                className='flex-1'
                placeholder='URL'
              />
              <Button size='sm' onClick={() => setEditingItem(null)}>
                <Check className='h-4 w-4' />
              </Button>
            </div>
          ) : (
            <>
              <div className='flex-1'>
                <div className='font-medium'>{item.title}</div>
                <div className='text-sm text-gray-500'>{item.href}</div>
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
