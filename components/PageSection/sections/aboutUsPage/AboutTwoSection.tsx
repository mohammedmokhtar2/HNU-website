'use client';

import { PageSection } from '@/types/pageSections';
import type { AboutContentTwo } from '@/types/pageSections';
import { Button } from '@/components/ui/button';

interface AboutTwoSectionProps {
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

export function AboutTwoSection({
  section,
  locale,
  getLocalizedContent,
}: AboutTwoSectionProps) {
  const content = section.content as AboutContentTwo;

  if (!content) {
    return (
      <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500'>Content not available</p>
      </div>
    );
  }

  const title = getLocalizedContent(content.title);
  const subtitle = getLocalizedContent(content.subtitle);
  const description = getLocalizedContent(content.description) || '';

  const buttons = content.buttons || [];

  const leftTitleOne = getLocalizedContent(content.leftTitleOne);
  const leftDescriptionOne = getLocalizedContent(content.leftDescriptionOne);
  const leftTitleTwo = getLocalizedContent(content.leftTitleTwo);
  const leftDescriptionTwo = getLocalizedContent(content.leftDescriptionTwo);

  return (
    <section
      className='relative py-20 px-6 lg:px-24'
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch'>
        {/* النص الأساسي */}
        <div className='flex flex-col justify-center h-full'>
          {title && (
            <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 mb-6'>
              {title}
            </h1>
          )}

          {subtitle && (
            <h2 className='text-2xl md:text-3xl font-semibold text-gray-700 mb-4'>
              {subtitle}
            </h2>
          )}

          {description.split('\n\n').map((para, idx) => (
            <p key={idx} className='mb-4 leading-relaxed text-gray-600'>
              {para}
            </p>
          ))}

          {buttons[0] && (
            <Button
              size='lg'
              className='bg-slate-800 hover:bg-slate-700 text-white font-bold mt-6'
            >
              {getLocalizedContent(buttons[0].text)}
            </Button>
          )}
        </div>

        {/* الجزء الأيمن (العناوين الفرعية) */}
        <div className='flex flex-col justify-center h-full space-y-10'>
          <div>
            {leftTitleOne && (
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                {leftTitleOne}
              </h3>
            )}
            {leftDescriptionOne && (
              <p className='text-gray-600 text-sm'>{leftDescriptionOne}</p>
            )}
          </div>

          <div>
            {leftTitleTwo && (
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                {leftTitleTwo}
              </h3>
            )}
            {leftDescriptionTwo && (
              <p className='text-gray-600 text-sm'>{leftDescriptionTwo}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
