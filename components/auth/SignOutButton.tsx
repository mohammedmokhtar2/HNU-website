'use client';

import { SignOutButton as ClerkSignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({ className, children }: SignOutButtonProps) {
  return (
    <ClerkSignOutButton redirectUrl='/'>
      {children || (
        <Button
          variant='ghost'
          className={`text-red-400 hover:text-red-300 hover:bg-gray-800 ${className || ''}`}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </Button>
      )}
    </ClerkSignOutButton>
  );
}
