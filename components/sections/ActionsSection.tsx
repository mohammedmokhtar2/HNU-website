'use client';

import React from 'react';
import { SectionService } from '@/services/section.service';
import { useQuery } from '@tanstack/react-query';
import { SectionSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ActionsSectionProps {
    sectionId: string;
}

export function ActionsSection({ sectionId }: ActionsSectionProps) {
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
                <p className="text-gray-500">Failed to load actions section</p>
            </div>
        );
    }

    const content = section.content as any;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {content?.title?.en || content?.title?.ar || 'Actions'}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        {content?.description?.en || content?.description?.ar || ''}
                    </p>
                    {content?.actionHref && (
                        <Button
                            asChild
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                        >
                            <a href={content.actionHref}>
                                Learn More
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}
