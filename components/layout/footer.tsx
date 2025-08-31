'use client';

import React from 'react';
import { footerData } from '@/data';
import { useTranslations } from 'next-intl';

export interface FooterProps {
  local: string;
}
function Footer({ local }: FooterProps) {
  const footerT = useTranslations('footer');

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

  return (
    <footer className='bg-gray-900 text-white'>
      {/* Main Footer Content */}
      <div className='py-12 sm:py-16 bg-gray-900'>
        <div className='px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
            {/* Second Column - Map */}
            <div className='space-y-6'>
              <h3 className='text-xl sm:text-2xl font-bold text-white mb-4 text-center lg:text-left'>
                {footerT('Our_Location')}
              </h3>

              {/* Embedded Google Maps */}
              <div className='w-full h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden border border-gray-700'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4649.09110483954!2d31.3170068!3d29.870366200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145837d9f857b2f3%3A0xe714664b99bc108e!2sHelwan%20National%20University!5e1!3m2!1sen!2seg!4v1756554256943!5m2!1sen!2seg'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title='Helwan National University Campus Location'
                  className='w-full h-full'
                />
              </div>

              <div className='text-center lg:text-left'>
                <p className='text-gray-400 text-sm'>
                  {local === 'ar'
                    ? footerData.contact.address.ar
                    : footerData.contact.address.en}
                </p>
              </div>
            </div>

            {/* Third Column - Quick Links & Actions */}
            <div className='space-y-8'>
              <div className='grid grid-cols-1 gap-4'>
                {/* Quick Links */}
                <div className='space-y-4'>
                  <h3 className='text-xl sm:text-2xl font-bold text-white mb-4 text-center lg:text-left'>
                    {footerT('Quick_Links')}
                  </h3>

                  <div className='grid grid-cols-2 gap-3'>
                    {footerData.navigation.links.map((link, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          scrollToSection(link.href.replace('#', ''))
                        }
                        className='text-left text-gray-300 hover:text-white py-2 hover:translate-x-2 transform transition-all duration-300 text-sm sm:text-base'
                      >
                        {local === 'ar' ? link.name.ar : link.name.en}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              {/* Quick Actions */}
              <div className='space-y-4'>
                <h3 className='text-xl sm:text-2xl font-bold text-white mb-4 text-center lg:text-left'>
                  {footerT('Quick_Actions')}
                </h3>
                <div className='space-y-3'>
                  <button className='w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 text-sm sm:text-base'>
                    {footerT('Apply_Now')}
                  </button>
                  <button className='w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 text-sm sm:text-base'>
                    {footerT('Schedule_a_Visit')}
                  </button>
                  <button className='w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 text-sm sm:text-base'>
                    {footerT('Request_Information')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Development Team Row */}
      <div className='border-t border-gray-800 py-6 sm:py-8 bg-gray-950'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 text-center lg:text-left'>
            <div>
              <p className='text-gray-400 text-sm sm:text-base'>
                © ٢٠٢٥ {footerT('university_name')}.{' '}
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
