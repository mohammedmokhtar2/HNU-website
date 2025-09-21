'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarContent } from './SidebarContent';

interface MobileSidebarProps {
  locale: string;
}

export function MobileSidebar({ locale }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='lg:hidden text-gray-300 hover:text-white hover:bg-gray-900'
        >
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='w-64 p-0 bg-gray-950 border-gray-800'
      >
        <SidebarContent
          collapsed={false}
          onNavigate={() => setOpen(false)}
          locale={locale}
        />
      </SheetContent>
    </Sheet>
  );
}
