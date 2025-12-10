'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activeSlide, setActiveSlide] = useState(0); // 0 for Mission, 1 for Vision

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // أي عرض أقل من 768px => موبايل
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-rotate between Mission and Vision
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
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

  // Vision Data (you can later move this to database/content)
  const OurVisionData = {
    title: {
      en: 'Our Mission',
      ar: 'رؤيتنا',
    },
    description: {
      en:
        "Helwan National University seeks to provide advanced and integrated university education based on creativity, scientific research, and practical application, preparing distinguished graduates capable of competing in the local, regional, and global labor markets. The university is committed to building a modern educational environment that supports innovation and entrepreneurship, promotes the values ​​of social responsibility, and serves sustainable development issues and Egypt's Vision 2030.",
      ar:
        'تسعى جامعة حلوان الأهلية إلى تقديم تعليم جامعي متطور ومتكامل، يعتمد على الإبداع والبحث العلمي والتطبيق العملي، لإعداد خريجين متميزين قادرين على المنافسة في سوق العمل محليًا وإقليميًا وعالميًا. وتلتزم الجامعة ببناء بيئة تعليمية حديثة تدعم الابتكار وريادة الأعمال، وتعزز من قيم المسؤولية المجتمعية، وتخدم قضايا التنمية المستدامة ورؤية مصر 2030.',
    },
    buttonText: {
      en: 'Learn More',
      ar: 'تعرف على المزيد',
    },
    imageUrl: '/IMG_9246.jpg', // You can use a different image for vision
  };

  const slides = [OurMissionData, OurVisionData];
  const currentSlide = slides[activeSlide];

  return (
    <section className='relative w-full min-h-screen flex items-center justify-center px-4 md:px-8 py-20 overflow-hidden'>
      {/* Dynamic background with overlapping shapes */}
      <div className='absolute inset-0 b' />
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000' />
        <div className='absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000' />
      </div>

      <div className='relative max-w-7xl w-full mx-auto z-10'>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='w-full'
          >
            {/* Unified card with image background */}
            <div className='relative overflow-hidden rounded-3xl shadow-2xl backdrop-blur-sm'>
              {/* Image as background */}
              <div className='absolute inset-0'>
                <Image
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title[locale as 'en' | 'ar']}
                  fill
                  className='object-cover'
                  priority
                />
                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50' />
              </div>

              {/* Content overlay */}
              <div className={`relative grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-16 min-h-[600px] items-center ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                {/* Text content */}
                <motion.div
                  initial={{ opacity: 0, x: locale === 'ar' ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className='space-y-6'
                >
                  {/* Badge */}
                  <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20'>
                    <div className={`w-2 h-2 rounded-full ${activeSlide === 0 ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`} />
                    <span className='text-white/80 text-sm font-medium uppercase tracking-wider'>
                      {activeSlide === 0 ? (locale === 'ar' ? 'رسالتنا' : 'Our Mission') : (locale === 'ar' ? 'رؤيتنا' : 'Our Vision')}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className='text-4xl md:text-6xl font-bold text-white leading-tight'>
                    {currentSlide.title[locale as 'en' | 'ar']}
                  </h2>

                  {/* Description */}
                  <p className='text-lg md:text-xl text-gray-200 leading-relaxed'>
                    {currentSlide.description[locale as 'en' | 'ar']}
                  </p>

                  {/* CTA Button */}
                  <div className='pt-4'>
                    <Link
                      href='pages/about-us'
                      className='group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105'
                    >
                      <span>{currentSlide.buttonText[locale as 'en' | 'ar']} </span>
                      <svg
                        className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                      </svg>
                    </Link>
                  </div>
                </motion.div>

                {/* Decorative stats or features (optional visual element) */}
                <motion.div
                  initial={{ opacity: 0, x: locale === 'ar' ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className='hidden md:flex flex-col gap-6'
                >
                  {activeSlide === 0 ? (
                    <>
                      <div className='group p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center'>
                            <svg className='w-6 h-6 text-emerald-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                            </svg>
                          </div>
                          <div className='flex-1'>
                            <h3 className='text-white font-bold text-lg'>{locale === 'ar' ? 'التفكير النقدي' : 'Critical Thinking'}</h3>
                            <p className='text-gray-300 text-sm'>{locale === 'ar' ? 'تطوير مهارات التحليل' : 'Develop analytical skills'}</p>
                          </div>
                        </div>
                      </div>
                      <div className='group p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center'>
                            <svg className='w-6 h-6 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                            </svg>
                          </div>
                          <div className='flex-1'>
                            <h3 className='text-white font-bold text-lg'>{locale === 'ar' ? 'التعلم مدى الحياة' : 'Lifelong Learning'}</h3>
                            <p className='text-gray-300 text-sm'>{locale === 'ar' ? 'التطوير المستمر' : 'Continuous development'}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='group p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center'>
                            <svg className='w-6 h-6 text-purple-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                            </svg>
                          </div>
                          <div className='flex-1'>
                            <h3 className='text-white font-bold text-lg'>{locale === 'ar' ? 'الابتكار' : 'Innovation'}</h3>
                            <p className='text-gray-300 text-sm'>{locale === 'ar' ? 'دعم الإبداع' : 'Support creativity'}</p>
                          </div>
                        </div>
                      </div>
                      <div className='group p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center'>
                            <svg className='w-6 h-6 text-pink-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                          </div>
                          <div className='flex-1'>
                            <h3 className='text-white font-bold text-lg'>{locale === 'ar' ? 'رؤية 2030' : 'Vision 2030'}</h3>
                            <p className='text-gray-300 text-sm'>{locale === 'ar' ? 'التنمية المستدامة' : 'Sustainable development'}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Modern navigation dots */}
        <div className='flex justify-center items-center gap-4 mt-12'>
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`group relative transition-all duration-300 ${activeSlide === index ? 'w-16' : 'w-4'
                }`}
            >
              <div
                className={`h-1 rounded-full transition-all duration-300 ${activeSlide === index
                    ? 'bg-white shadow-lg shadow-white/50'
                    : 'bg-white/30 group-hover:bg-white/50'
                  }`}
              />
              {activeSlide === index && (
                <span className='absolute -top-8 left-1/2 -translate-x-1/2 text-black text-xs font-medium whitespace-nowrap'>
                  {index === 0 ? (locale === 'ar' ? 'الرسالة' : 'Mission') : (locale === 'ar' ? 'الرؤية' : 'Vision')}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Add keyframes for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
