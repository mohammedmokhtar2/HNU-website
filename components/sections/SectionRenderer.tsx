'use client';

import React, { useMemo, Suspense } from 'react';
import { Section } from '@/types/section';
import { SectionType } from '@/types/enums';
import { AboutSection } from './AboutSection';
import { HeroSection } from './HeroSection';
import { useLocale } from 'next-intl';
import { SectionSkeleton } from '@/components/ui/skeleton';

interface SectionRendererProps {
  section: Section;
  locale: string;
}

// Lazy load components for better performance
const LazyHeroSection = React.lazy(() =>
  import('./HeroSection').then(module => ({ default: module.HeroSection }))
);

const LazyAboutSection = React.lazy(() =>
  import('./AboutSection').then(module => ({ default: module.AboutSection }))
);

export const SectionRenderer = React.memo(
  ({ section, locale }: SectionRendererProps) => {
    const renderSection = useMemo(() => {
      switch (section.type) {
        case SectionType.HERO:
          return <LazyHeroSection section={section} locale={locale} />;
        case SectionType.ABOUT:
          return <LazyAboutSection sectionId={section.id} />;
        default:
          return (
            <div className='p-8 text-center text-gray-500'>
              <p>Unknown section type: {section.type}</p>
            </div>
          );
      }
    }, [section, locale]);

    return (
      <div data-section-type={section.type} data-section-id={section.id}>
        <Suspense fallback={<SectionSkeleton />}>{renderSection}</Suspense>
      </div>
    );
  }
);

SectionRenderer.displayName = 'SectionRenderer';
