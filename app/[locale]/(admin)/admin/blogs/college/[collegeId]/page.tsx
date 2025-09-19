'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { BlogProvider } from '@/contexts/BlogContext';
import { UniversityProvider } from '@/contexts/UniversityContext';
import { CollegeProvider } from '@/contexts/CollegeContext';
import { UserProvider } from '@/contexts/userContext';
import { QueryClientProviderWrapper } from '@/contexts/QueryClientProvider';
import { BlogManagementPage } from '@/components/admin/blog/BlogManagementPage';

export default function AdminCollegeBlogsPage() {
    const params = useParams();
    const collegeId = params.collegeId as string;

    return (
        <QueryClientProviderWrapper>
            <UserProvider>
                <UniversityProvider>
                    <CollegeProvider collegeId={collegeId}>
                        <BlogProvider initialParams={{ collageId: collegeId }}>
                            <BlogManagementPage collegeId={collegeId} />
                        </BlogProvider>
                    </CollegeProvider>
                </UniversityProvider>
            </UserProvider>
        </QueryClientProviderWrapper>
    );
}
