'use client';

import React from 'react';
import { SectionService } from '@/services/section.service';
import { useQuery } from '@tanstack/react-query';
import { SectionSkeleton } from '@/components/ui/skeleton';
import { isPresidentMessageContent } from '@/types/section';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Quote } from 'lucide-react';

interface PresidentSectionProps {
  sectionId: string;
}

export function PresidentSection({ sectionId }: PresidentSectionProps) {
  const locale = useLocale();
  const {
    data: section,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['section', sectionId],
    queryFn: () => SectionService.getSectionById(sectionId),
  });

  if (isLoading) {
    return <SectionSkeleton />;
  }

  if (error || !section) {
    return (
      <div className='py-16 text-center'>
        <p className='text-gray-500'>Failed to load president section</p>
      </div>
    );
  }

  const content = section.content;

  // Validate content structure
  if (!isPresidentMessageContent(content)) {
    return (
      <div className='py-16 text-center'>
        <p className='text-gray-500'>Invalid president section content</p>
      </div>
    );
  }

  const isRTL = locale === 'ar';
  const currentLocale = locale as 'ar' | 'en';

  return (
    <section className='py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10' />
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-30 -z-10' />

      <div className='container mx-auto px-4 max-w-6xl'>
        {/* Section Title */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            {content.title[currentLocale]}
          </h2>
          <div className='w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full' />
        </div>

        {/* President Message Card */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div
            className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${isRTL ? 'md:grid-flow-dense' : ''
              }`}
          >
            {/* President Image */}
            <div
              className={`relative ${isRTL ? 'md:col-start-2' : ''
                } p-8 md:p-12`}
            >
              <div className='relative aspect-square max-w-md mx-auto'>
                {/* Decorative frame */}
                <div className='absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-blue-600 rounded-tl-3xl' />
                <div className='absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-purple-600 rounded-br-3xl' />

                {/* President Image */}
                {content.imageUrl ? (
                  <div className='relative w-full h-full rounded-2xl overflow-hidden shadow-lg'>
                    <Image
                      src={content.imageUrl}
                      alt={content.presidentName[currentLocale]}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, 50vw'
                    />
                  </div>
                ) : (
                  <div className='w-full h-full rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center'>
                    <div className='text-center'>
                      <div className='w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center mb-4'>
                        <Quote className='w-16 h-16 text-gray-400' />
                      </div>
                      <p className='text-gray-500 text-sm'>No image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* President Info */}
              <div className='mt-8 text-center'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  {content.presidentName[currentLocale]}
                </h3>
                <p className='text-lg text-blue-600 font-semibold'>
                  {content.presidentPosition[currentLocale]}
                </p>
                {/* Signature if available */}
                {content.signature && (
                  <div className='mt-4'>
                    <Image
                      src={content.signature}
                      alt='Signature'
                      width={120}
                      height={60}
                      className='mx-auto'
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Message Content */}
            <div className={`p-8 md:p-12 ${isRTL ? 'md:col-start-1' : ''}`}>
              <div className='relative'>
                {/* Quote icon */}
                <Quote className='absolute -top-4 -left-4 w-12 h-12 text-blue-200 opacity-50' />

                {/* Message text */}
                <div
                  className={`relative prose prose-lg max-w-none ${isRTL ? 'prose-rtl' : ''
                    }`}
                >
                  <div
                    className='text-gray-700 leading-relaxed whitespace-pre-line'
                    dangerouslySetInnerHTML={{
                      __html: content.message[currentLocale],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
