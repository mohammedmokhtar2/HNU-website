'use client';

import { PageSection } from '@/types/pageSections';
import type { OurHistoryContent } from '@/types/pageSections';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';

interface OurHistorySectionProps {
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

export function OurHistorySection({
  section,
  locale,
  getLocalizedContent,
}: OurHistorySectionProps) {
  const content = section.content as OurHistoryContent;

  // Memoize images
  const images = useMemo(() => content?.images || [], [content?.images]);

  const [currentImage, setCurrentImage] = useState(0);

  // Auto-change image every 10 seconds
  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images]);

  if (!content) {
    return (
      <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500'>Content not available</p>
      </div>
    );
  }

  const title = getLocalizedContent(content.title);
  const description = getLocalizedContent(content.description);
  const mapSectionTitle = getLocalizedContent(content.MapSectionTitle);
  const mapUrl = content.mapUrl;

  return (
    <section
      className='w-full flex flex-col items-center justify-center space-y-12'
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Hero: text + slider side by side */}
      <div className='flex flex-col md:flex-row items-center justify-center w-full md:space-x-8 md:space-x-reverse'>
        {/* Text side */}
        <div
          className={`md:w-1/2 flex flex-col justify-center space-y-4 text-center`}
        >
          <h2
            className={`text-3xl md:text-4xl font-bold text-black ${locale === 'ar' ? 'text-right' : 'text-left'}`}
          >
            {title}
          </h2>
          <p
            className={`mt-4 text-sm md:text-sm text-black w-[600px] ${locale === 'ar' ? 'text-right' : 'text-left'}`}
          >
            {description}
          </p>
        </div>

        {/* Slider side full width */}
        <div className='md:w-1/2 w-full mt-6 md:mt-0'>
          {images.length > 0 && (
            <div className='w-full h-[500px] md:h-[700px] lg:h-[800px] relative'>
              <Image
                src={images[currentImage]}
                alt={`Slide ${currentImage + 1}`}
                fill
                className='object-cover w-full h-full'
              />
            </div>
          )}

          {/* Dots navigation */}
          <div className='flex justify-center mt-4 space-x-2'>
            {images.map((_, index) => (
              <button
                type='button'
                aria-label={`Slide ${index + 1}`}
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImage ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Map section */}
      <div className='w-full text-center'>
        <h3 className='text-4xl font-semibold mb-4 text-black'>
          {mapSectionTitle}
        </h3>
        <iframe
          src={mapUrl}
          className='w-full h-[800px] border-0'
          allowFullScreen
          title='Map'
        />
      </div>
    </section>
  );
}
