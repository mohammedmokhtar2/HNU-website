'use client';
import type React from 'react';
import { BlogProvider } from '@/contexts';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({
  children,
}: AdminLayoutWrapperProps) {
  return <BlogProvider>{children}</BlogProvider>;
}
