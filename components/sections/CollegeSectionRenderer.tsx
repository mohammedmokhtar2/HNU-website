'use client';

import React, { useMemo, Suspense } from 'react';
import { Section } from '@/types/section';
import { SectionType } from '@/types/enums';
import { AboutSection } from './AboutSection';
import { HeroSection } from './HeroSection';
import { useLocale } from 'next-intl';
import { SectionSkeleton } from '@/components/ui/skeleton';

interface CollegeSectionRendererProps {
  section: Section;
  locale: string;
  collageId: string;
}

// Lazy load components for better performance
const LazyHeroSection = React.lazy(() =>
  import('./HeroSection').then(module => ({ default: module.HeroSection }))
);

const LazyAboutSection = React.lazy(() =>
  import('./AboutSection').then(module => ({ default: module.AboutSection }))
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

const LazyNumbersSection = React.lazy(() =>
  import('./NumbersSection').then(module => ({
    default: module.NumbersSection,
  }))
);

const LazyActionsSection = React.lazy(() =>
  import('./ActionsSection').then(module => ({
    default: module.ActionsSection,
  }))
);

const LazyStudentUnionSection = React.lazy(() =>
  import('./StudentUnionSection').then(module => ({
    default: module.StudentUnionSection,
  }))
);

const LazyEgyptStudentGroupSection = React.lazy(() =>
  import('./EgyptStudentGroupSection').then(module => ({
    default: module.EgyptStudentGroupSection,
  }))
);

const LazyPresidentSection = React.lazy(() =>
  import('./PresidentSection').then(module => ({
    default: module.PresidentSection,
  }))
);

const LazyProgramsSection = React.lazy(() =>
  import('./ProgramsSectionWrapper').then(module => ({
    default: module.ProgramsSectionWrapper,
  }))
);

export const CollegeSectionRenderer = React.memo(
  ({ section, locale, collageId }: CollegeSectionRendererProps) => {
    const renderSection = useMemo(() => {
      switch (section.type) {
        case SectionType.HERO:
          return <LazyHeroSection section={section} locale={locale} />;
        case SectionType.ABOUT:
          return <LazyAboutSection sectionId={section.id} />;
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
        case SectionType.NUMBERS:
          return <LazyNumbersSection sectionId={section.id} />;
        case SectionType.ACTIONS:
          return <LazyActionsSection sectionId={section.id} />;
        case SectionType.STUDENT_UNION:
          return <LazyStudentUnionSection sectionId={section.id} />;
        case SectionType.EGYPT_STUDENT_GROUP:
          return <LazyEgyptStudentGroupSection sectionId={section.id} />;
        case SectionType.PRESIDENT:
          return <LazyPresidentSection sectionId={section.id} />;
        case SectionType.PROGRAMS_SECTION:
          return (
            <LazyProgramsSection sectionId={section.id} collageId={collageId} />
          );
        default:
          return (
            <div className='p-8 text-center text-gray-500'>
              <p>Unknown section type: {section.type}</p>
            </div>
          );
      }
    }, [section, locale, collageId]);

    return (
      <div data-section-type={section.type} data-section-id={section.id}>
        <Suspense fallback={<SectionSkeleton />}>{renderSection}</Suspense>
      </div>
    );
  }
);

CollegeSectionRenderer.displayName = 'CollegeSectionRenderer';
