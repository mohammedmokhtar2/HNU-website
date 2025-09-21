'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CollegeService } from '@/services';
import { DynamicCollegePage } from '@/components/sections/DynamicCollegePage';
import { CollegeProvider } from '@/contexts/CollegeContext';
import { PageSkeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// this page is for a specific collage including
/*
- collage meta info
- programs in this collages
- dynamic sections
*/

function CollagePage() {
  const params = useParams();
  const locale = useLocale();
  const slug = params.slug as string;

  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollege = async () => {
      try {
        setLoading(true);
        setError(null);

        const college = await CollegeService.getCollegeBySlug(slug);
        console.log('Loaded college:', college);

        if (college) {
          console.log('Setting collegeId to:', college.id);
          setCollegeId(college.id);
        } else {
          console.log('No college found with slug:', slug);
          setError('College not found');
        }
      } catch (error) {
        console.error('Error loading college:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load college data'
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadCollege();
    }
  }, [slug]);

  // Show loading state only on initial load
  if (loading) {
    return <PageSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center max-w-md mx-auto p-8'>
          <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-6' />
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            College Not Found
          </h2>
          <p className='text-gray-600 mb-6'>{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className='flex items-center gap-2 mx-auto'
          >
            <RefreshCw className='h-4 w-4' />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show dynamic college page if college is found
  if (collegeId) {
    return (
      <ErrorBoundary>
        <CollegeProvider collegeId={collegeId}>
          <DynamicCollegePage collegeId={collegeId} />
        </CollegeProvider>
      </ErrorBoundary>
    );
  }

  // Fallback
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center max-w-md mx-auto p-8'>
        <div className='h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center'>
          <AlertCircle className='h-8 w-8 text-gray-400' />
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          No College Found
        </h2>
        <p className='text-gray-600'>
          The requested college could not be found.
        </p>
      </div>
    </div>
  );
}

export default CollagePage;
