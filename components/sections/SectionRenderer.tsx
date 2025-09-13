'use client';

import React from 'react';
import { Section } from '@/types/section';
import { SectionType } from '@/types/enums';
import { AboutSection } from './AboutSection';
import { HeroSection } from './HeroSection';

interface SectionRendererProps {
  section: Section;
  locale: string;
}

export function SectionRenderer({ section, locale }: SectionRendererProps) {
  const renderSection = () => {
    switch (section.type) {
      case SectionType.HERO:
        return <HeroSection section={section} locale={locale} />;
      case SectionType.ABOUT:
        return <AboutSection sectionId={section.id} />;

      default:
        return (
          <div className='p-8 text-center text-gray-500'>
            <p>Unknown section type: {section.type}</p>
          </div>
        );
    }
  };

  return (
    <div data-section-type={section.type} data-section-id={section.id}>
      {renderSection()}
    </div>
  );
}
