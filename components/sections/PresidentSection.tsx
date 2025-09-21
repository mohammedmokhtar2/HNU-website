'use client';

import React from 'react';
import { SectionService } from '@/services/section.service';
import { useQuery } from '@tanstack/react-query';
import { SectionSkeleton } from '@/components/ui/skeleton';

interface PresidentSectionProps {
    sectionId: string;
}

export function PresidentSection({ sectionId }: PresidentSectionProps) {
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
                <p className="text-gray-500">Failed to load president section</p>
            </div>
        );
    }

    const content = section.content as any;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        President Section
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <pre className="text-left text-sm text-gray-600 bg-white p-4 rounded-lg overflow-auto">
                            {JSON.stringify(content, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
