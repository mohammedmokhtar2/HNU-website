import { PageSection } from '@/types/pageSections';
import type { AboutContentOne } from '@/types/pageSections';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ForwardedRef, forwardRef } from 'react';

interface AboutOneSectionProps {
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

// 👇 forwardRef عشان نقدر نستقبل ref من برة
export const AboutOneSection = forwardRef<HTMLDivElement, AboutOneSectionProps>(
  (
    { section, locale, getLocalizedContent },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const content = section.content as AboutContentOne;

    if (!content) {
      return (
        <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
          <p className='text-gray-500'>Content not available</p>
        </div>
      );
    }

    const title = getLocalizedContent(content.title);
    const subtitle = getLocalizedContent(content.subtitle);
    const description = getLocalizedContent(content.description);
    const BottomContent = getLocalizedContent(content.content);
    const ButtonText = getLocalizedContent(content.ButtonText);
    const ButtonUrl = getLocalizedContent(content.ButtonUrl);
    const imageUrl = content.imageUrl;

    return (
      <section
        ref={ref}
        className='relative py-20 px-6 lg:px-24'
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Left side */}
          <div className='space-y-5'>
            {title && (
              <h4 className='text-slate-700 text-lg font-semibold'>{title}</h4>
            )}
            {subtitle && (
              <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900'>
                {subtitle}
              </h2>
            )}
            {description && (
              <p className='text-gray-700 text-sm leading-relaxed'>
                {description}
              </p>
            )}
            {ButtonText && ButtonUrl && (
              <Button asChild>
                <a
                  href={ButtonUrl}
                  className='font-semibold bg-slate-800 text-white hover:bg-slate-800/80'
                >
                  {ButtonText}
                </a>
              </Button>
            )}
          </div>

          {/* Right side */}
          {imageUrl && (
            <div className='flex justify-center lg:justify-end'>
              <Image
                src={imageUrl}
                alt={subtitle || 'About image'}
                width={700}
                height={400}
                className='rounded-3xl object-cover shadow-lg'
              />
            </div>
          )}
        </div>

        {BottomContent && (
          <div className='mt-16 max-w-9xl mx-auto'>
            <p className='text-gray-800 text-md md:text-sm leading-relaxed'>
              {BottomContent}
            </p>
          </div>
        )}
      </section>
    );
  }
);

AboutOneSection.displayName = 'AboutOneSection';
