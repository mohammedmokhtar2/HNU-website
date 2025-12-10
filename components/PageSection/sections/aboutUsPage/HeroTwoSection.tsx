'use client';

import { PageSection } from '@/types/pageSections';
import type { HeroContentTwo } from '@/types/pageSections';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeroTwoSectionProps {
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

export function HeroTwoSection({
  section,
  locale,
  getLocalizedContent,
}: HeroTwoSectionProps) {
  const content = section.content as HeroContentTwo;

  if (!content) {
    return (
      <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500'>Content not available</p>
      </div>
    );
  }

  const title = getLocalizedContent(content.title);
  const imageUrl = content.backgroundImage;
  const buttons = content.buttons || [];

  // Helper to detect external URLs
  const isExternal = (url: string) => /^https?:\/\//.test(url);

  return (
    <section
      className='relative min-h-screen flex items-center'
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background image */}
      {imageUrl && (
        <div className='absolute inset-0 z-0'>
          <Image
            src={imageUrl}
            alt='Hero background'
            fill
            priority
            className='object-cover'
          />
        </div>
      )}

      {/* Content */}
      <div className='relative z-10 max-w-3xl px-6 lg:px-16 flex flex-col items-start'>
        {/* Title */}
        {title && (
          <h1 className='text-4xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-lg'>
            {title}
          </h1>
        )}

        {/* Buttons */}
        <div className='space-y-6'>
          {/* First button with background (custom color) */}
          {buttons[0] && (
            <Button
              asChild
              size='lg'
              className='bg-slate-800 hover:bg-slate-800/80 text-white font-bold'
            >
              <Link
                href={getLocalizedContent(buttons[0].url)}
                {...(isExternal(getLocalizedContent(buttons[0].url))
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {getLocalizedContent(buttons[0].text)}
              </Link>
            </Button>
          )}

          {/* Next buttons as link variant */}
          <div className='flex gap-6'>
            {buttons.slice(1).map((btn, idx) => {
              const url = getLocalizedContent(btn.url);
              return (
                <Button key={idx} asChild variant='link'>
                  <Link
                    href={url}
                    className='text-white font-bold hover:underline underline-offset-4'
                    {...(isExternal(url)
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {getLocalizedContent(btn.text)}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
