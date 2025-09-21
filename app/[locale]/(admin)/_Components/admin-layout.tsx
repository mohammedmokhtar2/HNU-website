'use client';

import type React from 'react';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Header } from './header';
import { DesktopSidebar, MobileSidebar } from './sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const locale = useLocale();

  return (
    <div className='flex h-screen bg-gray-950'>
      {/* Desktop Sidebar */}
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        locale={locale}
      />

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden bg-gray-950'>
        {/* Header */}
        <Header />

        {/* Mobile Header */}
        <header className='flex h-16 items-center gap-4 border-b border-gray-800 bg-gray-950 px-4 lg:hidden'>
          <MobileSidebar locale={locale} />
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-4 md:p-6 bg-gray-950'>
          {children}
        </main>
      </div>
    </div>
  );
}
