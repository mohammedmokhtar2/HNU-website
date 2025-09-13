'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Eye, Edit } from 'lucide-react';

export function ViewModeToggle() {
  const { viewMode, toggleViewMode, isAdmin } = useViewMode();

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <Button
        onClick={toggleViewMode}
        variant={isAdmin ? 'default' : 'outline'}
        size='sm'
        className='flex items-center gap-2 shadow-lg'
      >
        {isAdmin ? (
          <>
            <Edit className='h-4 w-4' />
            Admin Mode
          </>
        ) : (
          <>
            <Eye className='h-4 w-4' />
            User Mode
          </>
        )}
      </Button>
      <Badge variant='secondary' className='absolute -top-2 -right-2 text-xs'>
        {viewMode}
      </Badge>
    </div>
  );
}
