'use client';

import React from 'react';
import { SectionService } from '@/services/section.service';
import { useQuery } from '@tanstack/react-query';
import { SectionSkeleton } from '@/components/ui/skeleton';

interface NumbersSectionProps {
    sectionId: string;
}

export function NumbersSection({ sectionId }: NumbersSectionProps) {
    const { data: section, isLoading, error } = useQuery({
        queryKey: ['section', sectionId],
        queryFn: () => SectionService.getSectionById(sectionId),
    });

    if (isLoading) {
        return <SectionSkeleton />;
    }

    if (error || !section) {
        return (
            <div className="py-16 text-center">
                <p className="text-gray-500">Failed to load numbers section</p>
            </div>
        );
    }

    const content = section.content as any;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {content?.title?.en || content?.title?.ar || 'Numbers'}
                    </h2>
                    <div className="text-6xl font-bold text-blue-600 mb-4">
                        {content?.number || 0}
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {content?.description?.en || content?.description?.ar || ''}
                    </p>
                </div>
            </div>
        </section>
    );
}
