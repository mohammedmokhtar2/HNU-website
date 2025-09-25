'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUniversity } from '@/contexts/UniversityContext';
import { footerData } from '@/data';
import { useLocale } from 'next-intl';
import VisitorCountDisplay from '@/components/VisitorCountDisplay';

export interface FooterProps {
  local: string;
}

function Footer({ local }: FooterProps) {
  const footerT = useTranslations('footer');
  const pathname = usePathname();
  const { university } = useUniversity();
  const locale = useLocale();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  };

  const config = university?.config;

  // Get dynamic sections with fallback to legacy structure
  const quickLinksData = config?.footer?.quickLinks || [];
  const quickActionsData = config?.footer?.quickActions || [];

  // Merge legacy data with dynamic sections
  const dynamicSections = config?.footer?.dynamicSections || [];
  const allDynamicSections = [...dynamicSections];

  // Add Quick Actions as a dynamic section if they exist
  if (quickActionsData.length > 0) {
    allDynamicSections.push({
      id: 'quick_actions_section',
      title: { en: 'Quick Actions', ar: 'إجراءات سريعة' },
      type: 'quickActions' as const,
      items: quickActionsData.map(action => ({
        title: action.title,
        href: action.href,
      })),
    });
  }

  // if the routes starts with /admin, then show the admin header
  if (pathname.includes('/admin')) {
    return null;
  }

  return (
    <footer className='bg-gray-900 text-white'>
      {/* Main Footer Content */}
      <div className='py-8 bg-gray-900'>
        <div className='px-2 sm:px-4 lg:px-6 max-w-full mx-auto w-full'>
          {/* Top Section - Quick Links */}
          {quickLinksData.length > 0 && (
            <div className='mb-8 pb-6 border-b border-gray-800 w-full'>
              <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 w-full'>
                {/* Quick Links Title */}
                <div className='lg:col-span-1'>
                  <h3
                    className={`
    text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-4 
    text-center lg:text-left
    ${locale === 'ar' ? 'lg:text-right' : 'lg:text-left'}
  `}
                  >
                    {footerT('Quick_Links')}
                  </h3>
                </div>

                {/* Quick Links Items - Takes 4/5 of the width */}
                <div className='lg:col-span-4 w-full'>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full'>
                    {quickLinksData.map((item, index) => {
                      const content =
                        typeof item.title === 'object'
                          ? item.title[local as 'en' | 'ar'] || item.title.en
                          : item.title;
                      const isButton = item.style === 'button' || !item.style; // Default to button

                      if (item.href && !item.href.startsWith('#')) {
                        return (
                          <Link
                            key={index}
                            href={item.href}
                            className={
                              isButton
                                ? 'block bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-600 py-3 px-4 text-sm font-medium transition-all duration-300 rounded-full text-center border-2 border-white hover:border-blue-400 w-39'
                                : 'block text-gray-300 hover:text-purple-400 transition-all duration-300 text-center text-base font-medium py-2 px-3 hover:underline'
                            }
                          >
                            {content}
                          </Link>
                        );
                      }

                      return (
                        <button
                          key={index}
                          onClick={() =>
                            scrollToSection(item.href?.replace('#', '') || '')
                          }
                          className={
                            isButton
                              ? 'block bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-600 py-3 px-4 text-sm font-medium transition-all duration-300 rounded-full text-center w-full border-2 border-white hover:border-blue-400'
                              : 'block text-gray-300 hover:text-purple-400 transition-all duration-300 text-center text-base font-medium py-2 px-3 hover:underline'
                          }
                        >
                          {content}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Sections */}
          {allDynamicSections.length > 0 && (
            <div className='mb-8 pb-6 w-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full px-2'>
                {allDynamicSections.map((section, sectionIndex) => (
                  <div key={section.id || sectionIndex} className='w-full'>
                    <h3
                      className={`font-bold text-white mb-3 ${section.type === 'quickActions' ? 'text-xl' : 'text-lg'}`}
                    >
                      {typeof section.title === 'object'
                        ? section.title[local as 'en' | 'ar'] ||
                        section.title.en
                        : section.title}
                    </h3>

                    <div className='space-y-2'>
                      {section.items.map((item, itemIndex) => {
                        const itemTitle =
                          typeof item.title === 'object'
                            ? item.title[local as 'en' | 'ar'] || item.title.en
                            : item.title;

                        // Quick Actions style - simple text links, no borders or backgrounds
                        if (section.type === 'quickActions') {
                          if ('href' in item && item.href) {
                            if (item.href.startsWith('#')) {
                              return (
                                <button
                                  key={itemIndex}
                                  onClick={() =>
                                    scrollToSection(
                                      item.href?.replace('#', '') || ''
                                    )
                                  }
                                  className='block w-full text-gray-300 hover:text-blue-400 py-2 text-sm transition-all duration-300 text-left'
                                >
                                  {itemTitle}
                                </button>
                              );
                            }

                            return (
                              <Link
                                key={itemIndex}
                                href={item.href}
                                className='block w-20 text-gray-300 hover:text-blue-400 py-2 text-sm transition-all duration-300 text-left '
                              >
                                {itemTitle}
                              </Link>
                            );
                          }

                          return (
                            <div
                              key={itemIndex}
                              className='block w-full text-gray-500 py-2 text-sm text-left'
                            >
                              {itemTitle}
                            </div>
                          );
                        }

                        // Quick Links style - similar to the top quick links
                        if (section.type === 'quickLinks') {
                          if ('href' in item && item.href) {
                            if (item.href.startsWith('#')) {
                              return (
                                <button
                                  key={itemIndex}
                                  onClick={() =>
                                    scrollToSection(
                                      item.href?.replace('#', '') || ''
                                    )
                                  }
                                  className='block bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-600 py-2 px-3 text-sm font-medium transition-all duration-300 rounded-full text-center w-full border-2 border-white hover:border-blue-400 mb-2'
                                >
                                  {itemTitle}
                                </button>
                              );
                            }

                            return (
                              <Link
                                key={itemIndex}
                                href={item.href}
                                className='block bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-600 py-2 px-3 text-sm font-medium transition-all duration-300 rounded-full text-center w-full border-2 border-white hover:border-blue-400 mb-2'
                              >
                                {itemTitle}
                              </Link>
                            );
                          }

                          return (
                            <div
                              key={itemIndex}
                              className='block bg-gray-700 text-gray-300 py-2 px-3 text-sm font-medium rounded-full text-center w-full mb-2'
                            >
                              {itemTitle}
                            </div>
                          );
                        }

                        // Custom Section style - regular links
                        return 'href' in item && item.href ? (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            className='block text-gray-300 hover:text-purple-400 transition-all duration-300 text-left text-base font-medium w-20 mb-2'
                          >
                            {itemTitle}
                          </Link>
                        ) : (
                          <div
                            key={itemIndex}
                            className='block text-gray-400 text-left text-base font-medium'
                          >
                            {itemTitle}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section - Map & Facts */}
          <div className='text-center w-full'>
            <h3 className='text-xl font-bold text-white mb-6'>
              {footerT('Our_Location')}
            </h3>

            {/* Map */}
            <div className='w-full max-w-6xl mx-auto h-96 rounded-lg overflow-hidden mb-6'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4649.09110483954!2d31.3170068!3d29.870366200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145837d9f857b2f3%3A0xe714664b99bc108e!2sHelwan%20National%20University!5e1!3m2!1sen!2seg!4v1756554256943!5m2!1sen!2seg'
                width='100%'
                height='100%'
                allowFullScreen
                referrerPolicy='no-referrer-when-downgrade'
                title='Helwan National University Campus Location'
                className='w-full h-full'
              />
            </div>

            {/* Address */}
            <p className='text-gray-400 text-base mb-8 px-4'>
              {local === 'ar'
                ? footerData.contact.address.ar
                : footerData.contact.address.en}
            </p>

            {/* Visitor Counter */}
            <div className='max-w-sm mx-auto mb-8'>
              <VisitorCountDisplay />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Development Team Row */}
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
              <p className='text-gray-400 text-sm sm:text-base'>
                {local === 'ar'
                  ? footerData.development.credits.ar
                  : footerData.development.credits.en}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
