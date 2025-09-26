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

const LazyCollegeSection = React.lazy(() =>
  import('./CollagesSection').then(module => ({
    default: module.CollageSection,
  }))
);

const LazyOurMissionSection = React.lazy(() =>
  import('./OurMissionSection').then(module => ({
    default: module.OurMissionSection,
  }))
);

const LazyBlogSection = React.lazy(() =>
  import('./BlogSection').then(module => ({
    default: module.BlogSection,
  }))
);

const LazyProgramsSection = React.lazy(() =>
  import('./ProgramsSectionWrapper').then(module => ({
    default: module.ProgramsSectionWrapper,
  }))
);

const LazyContactUsSection = React.lazy(() =>
  import('./ContactUsSection').then(module => ({
    default: module.ContactUsSection,
  }))
);

export const SectionRenderer = React.memo(
  ({ section, locale }: SectionRendererProps) => {
    const renderSection = useMemo(() => {
      switch (section.type) {
        case SectionType.HERO:
          return <LazyHeroSection section={section} locale={locale} />;
        case SectionType.ABOUT:
          return <LazyAboutSection sectionId={section.id} />;
        case SectionType.COLLEGES_SECTION:
          return <LazyCollegeSection sectionId={section.id} />;
        case SectionType.PROGRAMS_SECTION:
          return (
            <LazyProgramsSection
              sectionId={section.id}
              collageId={section.collageId}
            />
          );
        case SectionType.OUR_MISSION:
          return <LazyOurMissionSection sectionId={section.id} />;
        case SectionType.BLOGS:
          return (
            <LazyBlogSection
              sectionId={section.id}
              universityId={section.universityId}
              collegeId={section.collageId}
              locale={locale}
              content={section.content as any}
            />
          );
        case SectionType.CONTACT_US:
          return (
            <LazyContactUsSection
              sectionId={section.id}
              content={section.content as any}
            />
          );
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
