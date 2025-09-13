'use client';

import React from 'react';
import { SectionRenderer } from './SectionRenderer';
import { useLocale } from 'next-intl';
import { useUniversity } from '@/contexts/UniversityContext';

interface DynamicHomePageProps {
  universityId: string;
}

export function DynamicHomePage({ universityId }: DynamicHomePageProps) {
  const { sections, loading, error } = useUniversity();
  const locale = useLocale();

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-gray-300'>Loading page content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-red-400'>
          Error loading page content: {error}
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-gray-500'>No content available</div>
      </div>
    );
  }

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div>
      {sortedSections.map(section => (
        <SectionRenderer key={section.id} section={section} locale={locale} />
      ))}
    </div>
  );
}
