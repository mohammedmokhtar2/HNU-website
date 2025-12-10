'use client';
import React, { Suspense } from 'react';
import { useLocale } from 'next-intl';
import { DynamicHomePage } from '@/components/sections/DynamicHomePage';
import { useUniversity } from '@/contexts/UniversityContext';
import { PageSkeleton } from '@/components/ui/skeleton';
import { AnimatedLoading } from '@/components/ui/animated-loading';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import HeroSection from '@/components/home/heroSection';
import AboutSection from '@/components/home/aboutSection';
import ProgramsSection from '@/components/home/programsSection';
import { CollageSection } from '@/components/sections/CollagesSection';
import {} from '@/components/sections/OurMissionSection';
import {
  heroSection,
  aboutSection,
  programsSection,
  FactsAndNumbers,
  topNewsData,
} from '@/data';
import FcatsAndNumber from '@/components/home/FcatsAndNumber';
import TopNews from '@/components/home/TopNews';

// Lazy load static components for better performance
const LazyHeroSection = React.lazy(() =>
  import('@/components/home/heroSection').then(module => ({
    default: module.default,
  }))
);

const LazyAboutSection = React.lazy(() =>
  import('@/components/home/aboutSection').then(module => ({
    default: module.default,
  }))
);

const LazyOurMissionSection = React.lazy(() =>
  import('@/components/sections/OurMissionSection').then(module => ({
    default: module.OurMissionSection,
  }))
);

const LazyCollegeSection = React.lazy(() =>
  import('@/components/sections/CollagesSection').then(module => ({
    default: module.CollageSection,
  }))
);

// const LazyFactsAndNumber = React.lazy(() =>
//   import('@/components/home/FcatsAndNumber').then(module => ({
//     default: module.default,
//   }))
// );

// const LazyTopNews = React.lazy(() =>
//   import('@/components/home/TopNews').then(module => ({
//     default: module.default,
//   }))
// );

// Memoized static content component
const StaticContent = React.memo(({ locale }: { locale: string }) => (
  <>
    <Suspense fallback={<PageSkeleton />}>
      <LazyHeroSection {...heroSection} local={locale} />
    </Suspense>
    <Suspense fallback={<PageSkeleton />}>
      <LazyAboutSection {...aboutSection} local={locale} />
    </Suspense>
    <div className='relative py-20 overflow-hidden'>
      {/* <Suspense fallback={<PageSkeleton />}>
          <CollegeProvider universityId={universityId || undefined}>
            <LazyCollegeSection universityId={universityId || undefined} />
          </CollegeProvider>
        </Suspense> */}

      {/* <Suspense fallback={<PageSkeleton />}>
          <LazyOurMissionSection />
        </Suspense> */}

      {/* <Suspense fallback={<PageSkeleton />}>
          <LazyFactsAndNumber {...FactsAndNumbers} local={locale} />
        </Suspense> */}
      {/* <Suspense fallback={<PageSkeleton />}>
          <LazyTopNews {...topNewsData} local={locale} />
        </Suspense> */}
    </div>
  </>
));

StaticContent.displayName = 'StaticContent';

function Home() {
  const locale = useLocale();
  const { loading, error, university, selectedUniversityId } = useUniversity();

  // Show loading state only on initial load
  if (loading) {
    return <AnimatedLoading onComplete={() => {}} duration={4000} />;
  }

  // Show error state with fallback to static content
  if (error) {
    console.warn('Falling back to static content due to error:', error);
    return (
      <ErrorBoundary>
        <StaticContent locale={locale} />
      </ErrorBoundary>
    );
  }

  // Use dynamic sections if university is available, otherwise fall back to static content
  if (university && selectedUniversityId) {
    return (
      <ErrorBoundary>
        <DynamicHomePage universityId={selectedUniversityId} />
      </ErrorBoundary>
    );
  }

  // Fallback to static content
  return (
    <ErrorBoundary>
      <StaticContent locale={locale} />
    </ErrorBoundary>
  );
}

export default Home;
