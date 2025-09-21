'use client';
import { CollegeService } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import React from 'react'
import { CollegeConfig, CollegeType, Page, Section, Statistic, University, User } from '@/types';
import { useUser } from '@/contexts/userContext';
import { useAuthStatus } from '@/hooks/use-auth';
interface CollegeResponse {
    id: string;
    slug: string;
    name: Record<string, any>;
    description?: Record<string, any>;
    config?: CollegeConfig;
    type: CollegeType;
    createdById?: string;
    universityId?: string;
    createdAt: string; // ISO string for JSON serialization
    updatedAt: string; // ISO string for JSON serialization
}
interface CollegeWithRelationsResponse extends CollegeResponse {
    User?: User[]; // Will be properly typed when imported
    sections?: Section[]; // Will be properly typed when imported
    statistics?: Statistic[]; // Will be properly typed when imported
    createdBy?: User; // Will be properly typed when imported
    University?: University; // Will be properly typed when imported
    Page?: Page[]; // Will be properly typed when imported
}
function CollagePage() {
    const params = useParams();
    const { slug } = params as { slug: string };
    const { canViewCollage } = useAuthStatus();
    // const locale = useLocale();
    const { data: collage, isLoading, isError } = useQuery({
        queryKey: ['collage', slug],
        queryFn: () => CollegeService.getCollegeBySlug(slug),
    });
    console.log('collage', collage);
    const collageData = collage as unknown as CollegeWithRelationsResponse;
    if (!canViewCollage(collageData?.id || '', slug)) {
        return <div>You are not authorized to view this collage</div>
    }
    return (
        <>

        </>
    )
}

export default CollagePage