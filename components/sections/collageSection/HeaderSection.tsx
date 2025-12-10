'use client';
import React, { useEffect, useState } from 'react';
import { Section } from '@/types/section';
import { useLocale } from 'next-intl';
import Image from 'next/image';

function HeaderSection({
  sectionId,
  sections,
}: {
  sectionId: string;
  sections: any;
}) {
  const locale = useLocale();
  const section = sections.find((s: any) => s.id === sectionId);

  // Helper function to safely access content properties
  const getContentValue = (
    content: any,
    key: string,
    lang: 'ar' | 'en' = 'en'
  ) => {
    if (content && content[key] && typeof content[key] === 'object') {
      return content[key][lang] || content[key].en || content[key].ar || '';
    }
    return content?.[key] || '';
  };

  const mappedHeaderSection = {
    logo: section?.collage.config.logoUrl,
    collageName: getContentValue(section?.collage.name, locale),
    uniName:
      getContentValue(section?.universty, locale) || locale === 'ar'
        ? 'جامعة حلوان الاهليه'
        : 'Helwan National Universty',
    // Add other properties as needed
  };

  // console.log("mappedHeroSection from the header section 22", );
  // console.log("section from the header section 22", section , "mappedHeroSection", mappedHeroSection);

  return (
    <div className='w-full bg-white p-6 md:p-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          {/* Right Section - Logo and English Text */}
          <div className='flex flex-col items-center space-y-4'>
            {/* Logo */}
            <div className='w-20 h-20 md:w-24 md:h-24 bg-blue-900 rounded-full flex items-center justify-center'>
              {mappedHeaderSection.logo ? (
                <Image
                  width={40}
                  height={40}
                  src={mappedHeaderSection.logo}
                  alt='College Logo'
                  className='w-16 h-16 md:w-20 md:h-20 rounded-full object-contain'
                />
              ) : (
                <div className='w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center'>
                  <div className='w-8 h-8 md:w-12 md:h-12 bg-blue-900 rounded-full flex items-center justify-center'>
                    <div className='w-4 h-4 md:w-6 md:h-6 bg-white rounded-full'></div>
                  </div>
                </div>
              )}
            </div>

            {/* English Acronym */}
            <h3 className='text-xl md:text-2xl font-bold text-gray-600'>
              "HNU"
            </h3>
          </div>

          {/* Vertical Divider */}
          <div className='hidden md:block w-px h-24 bg-gray-300'></div>

          {/* Left Section - Arabic Text */}
          <div className='flex-1 text-center md:text-right'>
            <div className='space-y-2'>
              {/* College Name */}
              <h1
                className={`text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight ${locale === 'ar' ? 'text-right!' : 'text-left!'}`}
              >
                {mappedHeaderSection.collageName ||
                  (locale === 'ar'
                    ? 'كلية الآداب والعلوم'
                    : 'College of Arts and Sciences')}
              </h1>

              {/* Divider Line */}
              <div className='w-full md:w-auto h-px bg-gray-300 my-3'></div>

              {/* University Name */}
              <h2
                className={`text-lg md:text-xl text-gray-600 font-medium ${locale === 'ar' ? 'text-right!' : 'text-left!'}`}
              >
                {mappedHeaderSection.uniName}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderSection;
