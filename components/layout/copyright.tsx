'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useUniversity } from '@/contexts/UniversityContext';
import { footerData } from '@/data';
import { LinkPreview } from '@/components/ui/link-preview';

export interface CopyrightProps {
  local: string;
}

function Copyright({ local }: CopyrightProps) {
  const footerT = useTranslations('footer');
  const pathname = usePathname();
  const { university } = useUniversity();

  // if the routes starts with /admin, then don't show the copyright
  if (
    pathname?.includes('/admin') ||
    pathname?.includes('/pages/student-union') ||
    pathname?.includes('pages/family-of-egypt')
  ) {
    return null;
  }

  return (
    <div className='py-6 sm:py-8 bg-gray-950'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 text-center lg:text-left'>
          <div>
            <p className='text-gray-500 text-sm sm:text-base'>
              © {footerT('date')} {footerT('university_name')}.{' '}
              {footerT('rights_reserved')}
            </p>
          </div>

          <div className='text-center lg:text-right'>
            <LinkPreview
              url='http://hnu-seven.vercel.app/en/pages/helwan-plus-team'
              className='text-gray-400 text-sm sm:text-base hover:text-blue-400 transition-colors duration-300 cursor-pointer'
            >
              {local === 'ar'
                ? footerData.development.credits.ar
                : footerData.development.credits.en}
            </LinkPreview>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Copyright;
