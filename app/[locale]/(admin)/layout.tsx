'use client';
import type React from 'react';
import { MessageProvider, Providers } from '@/contexts';
import { AdminAuthGuard } from './_Components/AdminAuthGuard';
import { AdminLayout } from './_Components/admin-layout';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({
  children,
}: AdminLayoutWrapperProps) {
  return (
    <div className='relative admin-layout-wrapper min-h-screen'>
      <Providers>
        <AdminAuthGuard requireAdmin={true}>
          <MessageProvider>
            <AdminLayout>
              <div className='relative min-h-screen overflow-hidden'>
                {/* Main content container */}
                <div className='relative z-10 min-h-screen'>
                  <div className='min-h-screen'>{children}</div>
                </div>
              </div>
            </AdminLayout>
          </MessageProvider>
        </AdminAuthGuard>
      </Providers>
    </div>
  );
}
