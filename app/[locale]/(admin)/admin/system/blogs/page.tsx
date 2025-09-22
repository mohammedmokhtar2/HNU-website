'use client';

import React from 'react';
import { BlogProvider } from '@/contexts/BlogContext';
import { UniversityProvider } from '@/contexts/UniversityContext';
import { CollegeProvider } from '@/contexts/CollegeContext';
import { UserProvider } from '@/contexts/userContext';
import { EventConfigProvider } from '@/contexts/EventConfigContext';
import { QueryClientProviderWrapper } from '@/contexts/QueryClientProvider';
import { BlogManagementPage } from '@/components/admin/blog/BlogManagementPage';

export default function AdminBlogsPage() {
  return (
    <QueryClientProviderWrapper>
      <UserProvider>
        <UniversityProvider>
          <CollegeProvider>
            <EventConfigProvider>
              <BlogProvider>
                <BlogManagementPage />
              </BlogProvider>
            </EventConfigProvider>
          </CollegeProvider>
        </UniversityProvider>
      </UserProvider>
    </QueryClientProviderWrapper>
  );
}
