'use client';

import React from 'react';
import { SectionService } from '@/services/section.service';
import { useQuery } from '@tanstack/react-query';
import { SectionSkeleton } from '@/components/ui/skeleton';

interface EgyptStudentGroupSectionProps {
    sectionId: string;
}

export function EgyptStudentGroupSection({ sectionId }: EgyptStudentGroupSectionProps) {
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
                <p className="text-gray-500">Failed to load Egypt student group section</p>
            </div>
        );
    }

    const content = section.content as any;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {content?.title?.en || content?.title?.ar || 'Egypt Student Group'}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        {content?.description?.en || content?.description?.ar || ''}
                    </p>
                    {content?.items && content.items.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            {content.items.map((item: string, index: number) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">{item}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
