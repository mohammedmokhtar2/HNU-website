'use client';

import { useEffect, useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useUniversity } from '@/contexts/UniversityContext';
import { PageService } from '@/services/pageService';
import { PageSectionService } from '@/services/pageSectionService';
import { Page } from '@/types/page';
import { PageSection } from '@/types/pageSections';
import { PageSectionType } from '@/types/enums';
import { notFound } from 'next/navigation';

// Section Components
import { HeroOneSection } from './sections/aboutUsPage/HeroOneSection';
import { AboutOneSection } from './sections/aboutUsPage/AboutOneSection';
import { HeroTwoSection } from './sections/aboutUsPage/HeroTwoSection';
import { AboutTwoSection } from './sections/aboutUsPage/AboutTwoSection';
import { OurHistorySection } from './sections/ourHistoryPage/ourHistoryPage';
import { PresidentSection } from './sections/presidentPage/aboutPresident';
import { PresidentMessageSection } from './sections/presidentMessage/PresidentMessage';
import { ForEgyptGroupSection } from './sections/forEgypt/ForEgypt';
import { StudentUnionsSection } from './sections/studentUnion/StudentUnion';

interface PageRendererProps {
  pageSlug: string;
}

interface PageRendererData {
  page: Page | null;
  sections: PageSection[];
  loading: boolean;
  error: string | null;
}

export function PageRenderer({ pageSlug }: PageRendererProps) {
  const locale = useLocale() as 'ar' | 'en';
  const {
    university,
    loading: universityLoading,
    error: universityError,
  } = useUniversity();

  const [data, setData] = useState<PageRendererData>({
    page: null,
    sections: [],
    loading: true,
    error: null,
  });

  const aboutOneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      console.log('PageRenderer Debug Info:');
      console.log('pageSlug:', pageSlug);
      console.log('university:', university);
      console.log('universityLoading:', universityLoading);

      // Wait for university loading to complete
      if (universityLoading) {
        console.log('Still loading university data, waiting...');
        return;
      }

      // If loading is done but no university found, show error
      if (!university?.id) {
        console.log('No university found after loading completed');
        setData(prev => ({
          ...prev,
          loading: false,
          error: universityError || 'University not found',
        }));
        return;
      }

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        console.log('Fetching pages for university:', university.id);

        // Fetch all pages for the university
        const pages = await PageService.getPagesByUniversity(university.id);
        console.log('All pages:', pages);

        const foundPage = pages?.find((p: Page) => p.slug === pageSlug);
        console.log('Looking for slug:', pageSlug);
        console.log('Found page:', foundPage);

        if (!foundPage) {
          console.log('Page not found, calling notFound()');
          notFound();
          return;
        }

        // Fetch sections for the page
        console.log('Fetching sections for page:', foundPage.id);
        const sections = await PageSectionService.getPageSectionsByPage(
          foundPage.id
        );
        console.log(' Found sections:', sections);

        // Sort sections by order
        const sortedSections = sections.sort(
          (a: PageSection, b: PageSection) => a.order - b.order
        );

        setData({
          page: foundPage,
          sections: sortedSections,
          loading: false,
          error: null,
        });
        console.log('PageRenderer data set successfully');
      } catch (error) {
        console.error('Error fetching page data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load page data',
        }));
      }
    };

    fetchPageData();
  }, [pageSlug, university, universityLoading, universityError]);

  // Show loading state if university is still loading
  if (universityLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto'></div>
          <p className='text-lg text-gray-600'>
            {locale === 'ar' ? 'جاري تحميل البيانات ...' : 'Loading data...'}
          </p>
        </div>
      </div>
    );
  }

  // Loading state for page data
  if (data.loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto'></div>
          <p className='text-lg text-gray-600'>
            {locale === 'ar' ? 'جاري تحميل البيانات...' : 'Loading data...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (data.error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <h1 className='text-2xl font-bold text-red-600'>
            {locale === 'ar' ? 'خطأ' : 'Error'}
          </h1>
          <p className='text-gray-600'>{data.error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          >
            {locale === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // No page found
  if (!data.page) {
    return notFound();
  }

  // Helper function to get content in current locale
  const getLocalizedContent = (content: any) => {
    if (typeof content === 'object' && content !== null) {
      return content[locale] || content.en || content.ar || '';
    }
    return content || '';
  };

  // Render individual section based on type
  const renderSection = (section: PageSection) => {
    const sectionProps = {
      section,
      locale,
      getLocalizedContent,
    };

    switch (section.type) {
      case PageSectionType.HERO1:
        return (
          <HeroOneSection
            key={section.id}
            {...sectionProps}
            scrollTarget={aboutOneRef}
          />
        );

      case PageSectionType.HERO2:
        return <HeroTwoSection key={section.id} {...sectionProps} />;

      case PageSectionType.ABOUT1:
        return (
          <AboutOneSection
            key={section.id}
            {...sectionProps}
            ref={aboutOneRef}
          />
        );

      case PageSectionType.ABOUT2:
        return <AboutTwoSection key={section.id} {...sectionProps} />;

      case PageSectionType.OUR_HISTORY:
        return <OurHistorySection key={section.id} {...sectionProps} />;

      case PageSectionType.PRESIDENT:
        return <PresidentSection key={section.id} {...sectionProps} />;

      case PageSectionType.PRESIDENT_MESSAGE:
        return <PresidentMessageSection key={section.id} {...sectionProps} />;

      case PageSectionType.STUDENT_UNIONS:
        return <StudentUnionsSection key={section.id} {...sectionProps} />;

      case PageSectionType.FOR_EGYPT_GROUP:
        return <ForEgyptGroupSection key={section.id} {...sectionProps} />;

      case PageSectionType.CONTACT:
        // return <ContactSection {...sectionProps} />;
        return (
          <div key={section.id} className='bg-blue-100 p-8 text-center'>
            <h2 className='text-2xl font-bold mb-4'>
              Contact Section (Coming Soon)
            </h2>
            <p>Section ID: {section.id}</p>
          </div>
        );

      case PageSectionType.BLOGS:
        // return <BlogsSection {...sectionProps} />;
        return (
          <div key={section.id} className='bg-green-100 p-8 text-center'>
            <h2 className='text-2xl font-bold mb-4'>
              Blogs Section (Coming Soon)
            </h2>
            <p>Section ID: {section.id}</p>
          </div>
        );

      case PageSectionType.STUDENT_ACTIVITIES:
        // return <StudentActivitiesSection {...sectionProps} />;
        return (
          <div key={section.id} className='bg-purple-100 p-8 text-center'>
            <h2 className='text-2xl font-bold mb-4'>
              Student Activities Section (Coming Soon)
            </h2>
            <p>Section ID: {section.id}</p>
          </div>
        );

      case PageSectionType.CUSTOM:
        // return <CustomSection {...sectionProps} />;
        return (
          <div key={section.id} className='bg-red-100 p-8 text-center'>
            <h2 className='text-2xl font-bold mb-4'>
              Custom Section (Coming Soon)
            </h2>
            <p>Section ID: {section.id}</p>
          </div>
        );

      default:
        return (
          <div
            key={section.id}
            className='bg-gray-500 p-8 text-center text-white'
          >
            <h2 className='text-2xl font-bold mb-4'>Unknown Section Type</h2>
            <p>Type: {section.type}</p>
            <p>Section ID: {section.id}</p>
          </div>
        );
    }
  };

  return (
    <div className='min-h-screen'>
      {/* Render all sections */}
      <div className='w-full'>
        {data.sections.length > 0 ? (
          data.sections.map(section => renderSection(section))
        ) : (
          <div className='text-center py-16'>
            <h2 className='text-xl text-gray-600'>
              {locale === 'ar'
                ? 'لا توجد أقسام في هذه الصفحة بعد'
                : 'No sections in this page yet'}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
