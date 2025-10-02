'use client';

import React, { useMemo, Suspense } from 'react';
import { SectionRenderer } from './SectionRenderer';
import { useLocale } from 'next-intl';
import { useUniversity } from '@/contexts/UniversityContext';
import { PageSkeleton, SectionSkeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { programsSection, FactsAndNumbers, topNewsData } from '@/data';
import { CollageSection } from './CollagesSection';

interface DynamicHomePageProps {
  universityId: string;
}

// Lazy load additional components for better performance
const LazyProgramsSection = React.lazy(() =>
  import('../home/programsSection').then(module => ({
    default: module.default,
  }))
);

const LazyOurMissionSection = React.lazy(() =>
  import('../sections/OurMissionSection').then(module => ({
    default: module.OurMissionSection,
  }))
);

// const LazyFactsAndNumber = React.lazy(() =>
//   import('../home/FcatsAndNumber').then(module => ({ default: module.default }))
// );

// const LazyTopNews = React.lazy(() =>
//   import('../home/TopNews').then(module => ({ default: module.default }))
// );

// Lazy load college section
const LazyCollegeSection = React.lazy(() =>
  import('./CollagesSection').then(module => ({
    default: module.CollageSection,
  }))
);

// Memoized section component for better performance
const MemoizedSectionRenderer = React.memo(
  ({ section, locale }: { section: any; locale: string }) => (
    <ErrorBoundary
      fallback={
        <div className='py-16'>
          <div className='container mx-auto px-4'>
            <div className='text-center'>
              <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Section Error
              </h3>
              <p className='text-gray-600 mb-4'>
                Failed to load section: {section.type}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant='outline'
                className='flex items-center gap-2'
              >
                <RefreshCw className='h-4 w-4' />
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <SectionRenderer section={section} locale={locale} />
    </ErrorBoundary>
  )
);

MemoizedSectionRenderer.displayName = 'MemoizedSectionRenderer';

export function DynamicHomePage({ universityId }: DynamicHomePageProps) {
  const { sections, loading, error, isInitialLoad, refetch } = useUniversity();
  const locale = useLocale();

  // Memoize sorted sections to prevent unnecessary re-sorting
  const sortedSections = useMemo(() => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    console.log('📋 DynamicHomePage sections:', {
      total: sections.length,
      sorted: sorted.map(s => ({ id: s.id, type: s.type, order: s.order })),
    });
    return sorted;
  }, [sections]);

  // Memoize additional sections to prevent unnecessary re-renders
  const additionalSections = useMemo(
    () => (
      <>
        <div>
          {/* <Suspense fallback={<SectionSkeleton />}>
            <LazyFactsAndNumber {...FactsAndNumbers} local={locale} />
          </Suspense> */}
          {/* <Suspense fallback={<SectionSkeleton />}>
            <LazyTopNews {...topNewsData} local={locale} />
          </Suspense> */}
        </div>
      </>
    ),
    []
  );

  // Show skeleton only on initial load
  if (loading && isInitialLoad) {
    return <PageSkeleton />;
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center max-w-md mx-auto p-8'>
          <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-6' />
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Failed to Load Content
          </h2>
          <p className='text-gray-600 mb-6'>{error}</p>
          <Button onClick={refetch} className='flex items-center gap-2 mx-auto'>
            <RefreshCw className='h-4 w-4' />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (sections.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className='h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center'>
            <AlertCircle className='h-8 w-8 text-gray-400' />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            No Content Available
          </h2>
          <p className='text-gray-600'>
            This page doesn't have any content sections configured yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <Suspense fallback={<PageSkeleton />}>
        {sortedSections.map(section => (
          <MemoizedSectionRenderer
            key={section.id}
            section={section}
            locale={locale}
          />
        ))}
      </Suspense>
      {additionalSections}
    </div>
  );
}
