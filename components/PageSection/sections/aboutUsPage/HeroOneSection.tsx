'use client';

import { PageSection } from '@/types/pageSections';
import type { HeroContentOne } from '@/types/pageSections';
import Image from 'next/image';

interface HeroOneSectionProps {
  scrollTarget: React.RefObject<HTMLDivElement | null>;
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

export function HeroOneSection({
  section,
  locale,
  getLocalizedContent,
  scrollTarget,
}: HeroOneSectionProps) {
  // Type-safe content extraction
  const content = section.content as HeroContentOne;

  if (!content) {
    return (
      <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500'>Content not available</p>
      </div>
    );
  }

  const title = getLocalizedContent(content.title);
  const description = getLocalizedContent(content.description);
  const imageUrl = content.imageUrl;

  return (
    <section
      className='relative min-h-screen flex items-center justify-center'
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background Image */}
      {imageUrl && (
        <div className='absolute inset-0 z-0'>
          <Image
            src={imageUrl}
            alt={title || 'Hero background'}
            fill
            className='object-cover'
            priority
          />
        </div>
      )}

      {/* Content Container */}
      <div className='relative z-10 container mx-auto px-6 py-20 h-full flex items-center'>
        <div
          className={`max-w-2xl ${
            locale === 'ar' ? 'text-right ml-auto' : 'text-left mr-auto'
          } p-6 rounded-xl`}
        >
          {/* Title */}
          {title && (
            <h4 className='text-3xl md:text-4xl font-bold text-white mb-3 leading-snug'>
              {title}
            </h4>
          )}

          {/* Description */}
          {description && (
            <p className='text-sm md:text-lg text-gray-200 leading-relaxed'>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* React Refs + scrollIntoView. */}
      {/* Scroll Indicator */}
      <div
        onClick={() => {
          scrollTarget.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer'
      >
        <svg
          className='w-6 h-6 text-white'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path d='M19 14l-7 7m0 0l-7-7m7 7V3'></path>
        </svg>
      </div>
    </section>
  );
}
