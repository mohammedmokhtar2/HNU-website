'use client';

import { PageSection } from '@/types/pageSections';
import type { PresidentContent } from '@/types/pageSections';
import Image from 'next/image';

interface PresidentMessageSectionProps {
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

export function PresidentMessageSection({
  section,
  locale,
  getLocalizedContent,
}: PresidentMessageSectionProps) {
  const content = section.content as PresidentContent;

  if (!content) {
    return (
      <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500'>Content not available</p>
      </div>
    );
  }

  const isRTL = locale === 'ar';
  const title = getLocalizedContent(content.Title);
  const name = getLocalizedContent(content.Name);
  const role = getLocalizedContent(content.Role);
  const images = content.ImagesUrl || [];
  const firstImage = images[0] || content.PresidentImageUrl || '';
  const otherImages = images.slice(1);
  const paragraphs = (content.Paragraphs || []).map(p =>
    getLocalizedContent(p)
  );

  return (
    <div className='w-full'>
      {/* full-width hero image (first image) */}
      <section
        className='relative w-full min-h-[500px] md:h-[70vh] lg:h-[100vh]'
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className='absolute inset-0'>
          <Image
            src={firstImage}
            alt={title || name || 'hero'}
            fill
            className='object-cover'
          />
        </div>

        {/* Content Container */}
        <div className='relative z-10 container mx-auto px-6 py-20 h-full flex items-center'>
          <div
            className={`max-w-2xl ${
              locale === 'ar' ? 'text-right ml-auto' : 'text-left mr-auto'
            } p-6 rounded-xl`}
          >
            {/* Title */}
            {title && (
              <h4 className='text-3xl md:text-6xl font-bold text-white leading-snug'>
                {title}
              </h4>
            )}
          </div>
        </div>
      </section>

      {/* below: images column + paragraphs column */}
      <section
        className={`flex flex-col md:flex-row items-stretch w-full ${
          isRTL ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* text column */}
        <div className='md:w-2/3 p-6 flex flex-col justify-between'>
          <div
            className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}
          >
            <div className='w-full'>
              <div className='flex flex-col space-y-6'>
                {paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className={`text-lg leading-relaxed text-black ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {p}
                  </p>
                ))}

                {/* name + role inline with same style */}
                <p
                  className={`text-lg leading-relaxed text-black font-semibold ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {name}
                  <br />
                  {role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* images column */}
        <div className='md:w-1/3 flex flex-col px-4 mb-30 mr-15'>
          {otherImages.map((url, i) => (
            <div key={i}>
              <Image
                src={url}
                alt={`image-${i + 2}`}
                width={600}
                height={900}
                className={`block w-[100%] h-96 object-cover`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
