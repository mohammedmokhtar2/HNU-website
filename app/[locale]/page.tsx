'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useLocale } from 'next-intl';
import { UniversityService } from '@/services/university.service';
import { DynamicHomePage } from '@/components/sections/DynamicHomePage';
import { UniversityProvider } from '@/contexts/UniversityContext';
import { PageSkeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import HeroSection from '@/components/home/heroSection';
import AboutSection from '@/components/home/aboutSection';
import ProgramsSection from '@/components/home/programsSection';
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

const LazyProgramsSection = React.lazy(() =>
  import('@/components/home/programsSection').then(module => ({
    default: module.default,
  }))
);

const LazyFactsAndNumber = React.lazy(() =>
  import('@/components/home/FcatsAndNumber').then(module => ({
    default: module.default,
  }))
);

const LazyTopNews = React.lazy(() =>
  import('@/components/home/TopNews').then(module => ({
    default: module.default,
  }))
);

// Memoized static content component
const StaticContent = React.memo(({ locale }: { locale: string }) => (
  <>
    <Suspense fallback={<PageSkeleton />}>
      <LazyHeroSection {...heroSection} local={locale} />
    </Suspense>
    <Suspense fallback={<PageSkeleton />}>
      <LazyAboutSection {...aboutSection} local={locale} />
    </Suspense>
    <div className='relative py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200 overflow-hidden'>
      <Suspense fallback={<PageSkeleton />}>
        <LazyProgramsSection {...programsSection} local={locale} />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <LazyFactsAndNumber {...FactsAndNumbers} local={locale} />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <LazyTopNews {...topNewsData} local={locale} />
      </Suspense>
    </div>
  </>
));

StaticContent.displayName = 'StaticContent';

function Home() {
  const locale = useLocale();
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [useDynamicSections, setUseDynamicSections] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUniversity = async () => {
      try {
        setLoading(true);
        setError(null);

        const universities = await UniversityService.getUniversities();
        if (universities && universities.length > 0) {
          setUniversityId(universities[0].id);
          // Check if university has sections configured
          setUseDynamicSections(true);
        }
      } catch (error) {
        console.error('Error loading university:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load university data'
        );
        setUseDynamicSections(false);
      } finally {
        setLoading(false);
      }
    };

    loadUniversity();
  }, []);

  // Show loading state only on initial load
  if (loading) {
    return <PageSkeleton />;
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

  // Use dynamic sections if available, otherwise fall back to static content
  if (useDynamicSections && universityId) {
    return (
      <ErrorBoundary>
        <UniversityProvider universityId={universityId}>
          <DynamicHomePage universityId={universityId} />
        </UniversityProvider>
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
