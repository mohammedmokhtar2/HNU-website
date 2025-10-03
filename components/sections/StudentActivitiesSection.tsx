'use client';

import React from 'react';
import { SectionService } from '@/services/section.service';
import { useQuery } from '@tanstack/react-query';
import { SectionSkeleton } from '@/components/ui/skeleton';
import { isStudentActivitiesContent } from '@/types/section';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Heart, CheckCircle, ArrowRight } from 'lucide-react';

interface StudentActivitiesSectionProps {
  sectionId: string;
}

export function StudentActivitiesSection({
  sectionId,
}: StudentActivitiesSectionProps) {
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
        <p className='text-gray-500'>
          Failed to load student activities section
        </p>
      </div>
    );
  }

  const content = section.content;

  // Validate content structure
  if (!isStudentActivitiesContent(content)) {
    return (
      <div className='py-16 text-center'>
        <p className='text-gray-500'>
          Invalid student activities section content
        </p>
      </div>
    );
  }

  const isRTL = locale === 'ar';
  const currentLocale = locale as 'ar' | 'en';

  return (
    <section className='py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-20 -z-10' />
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10' />

      <div className='container mx-auto px-4 max-w-[1400px]'>
        {/* Section Title */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            {content.title[currentLocale]}
          </h2>
          <div className='w-24 h-1 bg-gradient-to-r from-blue-700 to-yellow-600 mx-auto rounded-full' />
        </div>

        {/* Two-Column Layout */}
        <div className='grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch'>
          {/* Student Union Section */}
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 duration-300 flex flex-col h-full'>
            {/* Header with Icon */}
            <div className='bg-gradient-to-r from-blue-700 to-blue-700 p-6'>
              <div className='flex items-center gap-3'>
                <div className='bg-white/20 p-3 rounded-lg'>
                  <Users className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-white'>
                  {content.studentUnion.title[currentLocale]}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className='p-6 space-y-6 flex-1 flex flex-col'>

              {/* Image */}
              {content.studentUnion.imageUrl && (
                <div className='relative aspect-video rounded-lg overflow-hidden'>
                  <Image
                    src={content.studentUnion.imageUrl}
                    alt={content.studentUnion.title[currentLocale]}
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
              )}

              {/* Description */}
              <p className='text-gray-700 text-lg leading-relaxed'>
                {content.studentUnion.description[currentLocale]}
              </p>

              {/* Items List */}
              {content.studentUnion.items &&
                content.studentUnion.items.length > 0 && (
                  <div className='space-y-3'>
                    {content.studentUnion.items.map((item, index: number) => (
                      <div
                        key={index}
                        className='flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors'
                      >
                        <CheckCircle className='w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0' />
                        <span className='text-gray-800'>
                          {item[currentLocale]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {/* Learn More Button */}
              {content.studentUnion.link && (
                <div className='mt-auto pt-4'>
                  <Link
                    href={content.studentUnion.link}
                    className='inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 group'
                  >
                    <span>
                      {currentLocale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                    </span>
                    <ArrowRight
                      className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Student Family Section */}
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 duration-300 flex flex-col h-full'>
            {/* Header with Icon */}
            <div className='bg-gradient-to-r from-yellow-600 to-yellow-600 p-6'>
              <div className='flex items-center gap-3'>
                <div className='bg-white/20 p-3 rounded-lg'>
                  <Heart className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-white'>
                  {content.studentFamily.title[currentLocale]}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className='p-6 space-y-6 flex-1 flex flex-col'>

              {/* Image */}
              {content.studentFamily.imageUrl && (
                <div className='relative aspect-video rounded-lg overflow-hidden'>
                  <Image
                    src={content.studentFamily.imageUrl}
                    alt={content.studentFamily.title[currentLocale]}
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
              )}

              {/* Description */}
              <p className='text-gray-700 text-lg leading-relaxed'>
                {content.studentFamily.description[currentLocale]}
              </p>

              {/* Items List */}
              {content.studentFamily.items &&
                content.studentFamily.items.length > 0 && (
                  <div className='space-y-3'>
                    {content.studentFamily.items.map((item, index: number) => (
                      <div
                        key={index}
                        className='flex items-start gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors'
                      >
                        <CheckCircle className='w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                        <span className='text-gray-800'>
                          {item[currentLocale]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {/* Learn More Button */}
              {content.studentFamily.link && (
                <div className='mt-auto pt-4'>
                  <Link
                    href={content.studentFamily.link}
                    className='inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 group'
                  >
                    <span>
                      {currentLocale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                    </span>
                    <ArrowRight
                      className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
