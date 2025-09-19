'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { BlogProvider } from '@/contexts/BlogContext';
import { UniversityProvider } from '@/contexts/UniversityContext';
import { CollegeProvider } from '@/contexts/CollegeContext';
import { UserProvider } from '@/contexts/userContext';
import { QueryClientProviderWrapper } from '@/contexts/QueryClientProvider';
import { BlogManagementPage } from '@/components/admin/blog/BlogManagementPage';

export default function AdminUniversityBlogsPage() {
    const params = useParams();
    const universityId = params.universityId as string;

    return (
        <QueryClientProviderWrapper>
            <UserProvider>
                <UniversityProvider universityId={universityId}>
                    <CollegeProvider universityId={universityId}>
                        <BlogProvider initialParams={{ universityId }}>
                            <BlogManagementPage universityId={universityId} />
                        </BlogProvider>
                    </CollegeProvider>
                </UniversityProvider>
            </UserProvider>
        </QueryClientProviderWrapper>
    );
}
