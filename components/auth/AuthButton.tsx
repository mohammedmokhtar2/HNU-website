'use client';

import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';

export function AuthButton() {
  return (
    <div className='flex items-center space-x-4'>
      <SignedOut>
        <SignInButton mode='modal'>
          <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm'>
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode='modal'>
          <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm'>
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
