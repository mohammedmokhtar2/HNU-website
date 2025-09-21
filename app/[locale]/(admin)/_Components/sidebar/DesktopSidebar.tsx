'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SidebarContent } from './SidebarContent';

interface DesktopSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  locale: string;
}

export function DesktopSidebar({
  collapsed,
  setCollapsed,
  locale,
}: DesktopSidebarProps) {
  return (
    <div
      className={cn(
        'relative hidden border-r border-gray-800 bg-gray-950 transition-all duration-300 lg:block',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <SidebarContent collapsed={collapsed} locale={locale} />

      {/* Collapse Toggle */}
      <Button
        variant='ghost'
        size='sm'
        className='absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-gray-700 bg-gray-950 p-0 shadow-md text-gray-300 hover:text-white hover:bg-gray-900'
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className='h-3 w-3' />
        ) : (
          <ChevronLeft className='h-3 w-3' />
        )}
        <span className='sr-only'>Toggle sidebar</span>
      </Button>
    </div>
  );
}
