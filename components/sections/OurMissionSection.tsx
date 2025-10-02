'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useUniversity } from '@/contexts/UniversityContext';
import { SectionType } from '@/types/enums';
import { OurMissionContent } from '@/types/section';

interface OurMissionSectionProps {
  sectionId?: string;
}

export function OurMissionSection({ sectionId }: OurMissionSectionProps) {
  const { sections, loading, error } = useUniversity();
  const locale = useLocale();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // أي عرض أقل من 768px => موبايل
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ourMissionSection = sections.find(
    s =>
      s.type === SectionType.OUR_MISSION && (!sectionId || s.id === sectionId)
  );

  if (loading || error || !ourMissionSection) {
    return (
      <section className='py-24 relative w-full min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          {loading && (
            <>
              <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-4 text-gray-600'>Loading...</p>
            </>
          )}
          {error && <p className='text-red-600'>Error loading section</p>}
        </div>
      </section>
    );
  }

  const content = ourMissionSection.content as OurMissionContent;

  const OurMissionData = {
    title: {
      en: content?.title?.en || 'Our Mission',
      ar: content?.title?.ar || 'رسالتنا',
    },
    description: {
      en:
        content?.description?.en ||
        'We offer the very best in American-style higher learning based on developing critical thinking skills, excelling in oral and written communication, and emphasizing life-long learning.',
      ar:
        content?.description?.ar ||
        'نحن نقدم أفضل تعليم عالٍ على الطراز الأمريكي، قائم على تطوير مهارات التفكير النقدي والتواصل الفعال.',
    },
    buttonText: {
      en: content?.buttonText?.en || 'Learn More',
      ar: content?.buttonText?.ar || 'تعرف على المزيد',
    },
    imageUrl: content?.imageUrl || '/home.jpeg',
  };

  return (
    <section className='relative w-full flex justify-center items-center px-4 md:px-8 py-8'>
      {/* Full width background gradient */}
      <div className='absolute left-1/2 right-1/2 -translate-x-1/2 w-screen h-full z-0 bg-gradient-to-b from-[#023e8a]/80 via-[#023e8a]/60 to-[#023e8a]/80' />
      <div
        className={`relative max-w-[1800px] w-full h-[600px] flex z-10 ${
          isMobile
            ? 'flex-col items-center gap-0'
            : 'flex-row justify-center items-center gap-8'
        }`}
      >
        <motion.div
          className={`${
            isMobile
              ? 'w-full h-[400px] relative'
              : `w-[1000px] h-[500px] rounded-xl overflow-hidden shadow-xl relative z-0 ${locale === 'ar' ? 'mr-90' : 'ml-90'}`
          }`}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{
            opacity: 1,
            x: isMobile ? 0 : locale === 'ar' ? -200 : 200,
          }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src={OurMissionData.imageUrl}
            alt='Our Mission'
            width={700}
            height={500}
            className={`w-full h-full object-cover rounded-xl ${
              isMobile ? 'filter blur-[2px]' : ''
            }`}
          />

          {isMobile && (
            <div className='absolute inset-0 bg-gradient-to-r from-[#063574]/80 to-[#035683]/80 flex flex-col justify-center items-center p-6 rounded-xl'>
              <h3 className='text-3xl font-bold text-white mb-4 text-center'>
                {OurMissionData.title[locale as 'en' | 'ar']}
              </h3>
              <p className='text-md text-white/90 mb-6 leading-relaxed text-center'>
                {OurMissionData.description[locale as 'en' | 'ar']}
              </p>
              <Link
                href='#'
                className='bg-gradient-to-r from-[#077599] to-[#01778f] text-white font-semibold px-6 py-2 rounded shadow-md hover:scale-105 transition-transform duration-300'
              >
                {OurMissionData.buttonText[locale as 'en' | 'ar']}
              </Link>
            </div>
          )}
        </motion.div>

        {/* كارد النص على الديسكتوب */}
        {!isMobile && (
          <motion.div
            // bg with low opacity
            className={`w-[700px] h-[350px] p-6 bg-gradient-to-r from-[#162e51] to-[#1954a6]/60 rounded-xl shadow-lg flex flex-col justify-center  ${
              locale === 'ar' ? 'text-right rtl right-10' : 'text-left left-5'
            } z-10 absolute top-1/2 transform -translate-y-1/2`}
            initial={{ opacity: 0, x: locale === 'ar' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className='text-3xl font-bold text-white mb-4 break-words'>
              {OurMissionData.title[locale as 'en' | 'ar']}
            </h3>
            <p className='text-md text-white/90 mb-6 leading-relaxed break-words'>
              {OurMissionData.description[locale as 'en' | 'ar']}
            </p>
            <Link
              href='pages/about-us'
              className='bg-gradient-to-r from-[#074199] to-[#396ca7] w-50 text-white font-semibold px-6 py-2 rounded shadow-md hover:scale-105 transition-transform duration-300'
            >
              {OurMissionData.buttonText[locale as 'en' | 'ar']}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
