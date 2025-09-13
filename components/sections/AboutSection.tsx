'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Sparkles, Play } from 'lucide-react';
import { VideoPlayer } from '@/components/ui';
import { useUniversity } from '@/contexts/UniversityContext';
import { SectionType } from '@/types/enums';
import { AboutContent } from '@/types/section';
import { useLocale } from 'next-intl';

interface AboutSectionProps {
  sectionId?: string;
}

export function AboutSection({ sectionId }: AboutSectionProps) {
  const { sections, loading, error } = useUniversity();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const locale = useLocale();
  // Find the about section
  const aboutSection = sections.find(
    s => s.type === SectionType.ABOUT && (!sectionId || s.id === sectionId)
  );

  if (loading) {
    return (
      <section className='py-24 relative overflow-hidden w-full min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </section>
    );
  }

  if (error || !aboutSection) {
    return (
      <section className='py-24 relative overflow-hidden w-full min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600'>Error loading about section</p>
        </div>
      </section>
    );
  }

  // Cast content to AboutContent type for type safety
  const content = aboutSection.content as AboutContent;

  const aboutData = {
    title: {
      en: content.title?.en || 'About Us',
      ar: content.title?.ar || 'معلومات عنا',
    },
    image: content.backgroundImage || '/home.jpeg',
    subtitle: {
      en: content.subtitle?.en || 'Learn More About Us',
      ar: content.subtitle?.ar || 'تعرف علينا أكثر',
    },
    description: {
      en:
        content.content?.en ||
        'Our university is a leading educational institution designed to lead innovation and achieve excellence.',
      ar:
        content.content?.ar ||
        'جامعتنا هي مؤسسة تعليمية رائدة مصممة لقيادة الابتكار وتحقيق التميز.',
    },
    videoUrl: content.videoUrl || '',
  };

  return (
    <>
      {/* Video Modal Overlay */}
      {isVideoPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => setIsVideoPlaying(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='relative w-full max-w-6xl aspect-video'
            onClick={e => e.stopPropagation()}
          >
            <VideoPlayer
              src={aboutData.videoUrl}
              poster='/home.jpeg'
              className='w-full h-full rounded-lg'
              controls={true}
              autoPlay={true}
              muted={true}
            />

            {/* Close Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              onClick={() => setIsVideoPlaying(false)}
              className='absolute -top-4 -right-4 w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 text-white text-2xl font-bold'
            >
              ×
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      <section
        id='about'
        className='py-24 relative overflow-hidden w-full min-h-screen flex items-center justify-center'
      >
        {/* Image Background */}
        <div className='absolute inset-0 w-full h-full'>
          <Image
            src={aboutData.image || '/home.jpeg'}
            alt={locale === 'ar' ? 'خلفية الجامعة' : 'University Background'}
            fill
            className='object-cover'
            priority
          />

          {/* Overlay*/}
          <div className='absolute inset-0 bg-gradient-to-b from-[#023e8a]/80 via-[#023e8a]/60 to-[#023e8a]/80' />
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
              className='text-white'
            >
              {/* Main Title */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className={`text-2xl sm:text-4xl lg:text-6xl font-bold mb-8 leading-tight  text-white`}
              >
                {aboutData.title[locale as keyof typeof aboutData.title]}
              </motion.h2>

              {/* Description Paragraphs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
                className='space-y-6 mb-8'
              >
                <p className='text-lg sm:text-xl text-white leading-relaxed'>
                  {
                    aboutData.description[
                      locale as keyof typeof aboutData.description
                    ]
                  }
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Video/Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
              className='relative'
            >
              {/* Video Container */}
              <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                {/* Background Image/Video */}
                <div className='relative h-[500px] sm:h-[600px] w-full'>
                  <Image
                    src={aboutData.image || '/home.jpeg'}
                    alt={
                      locale === 'ar' ? 'طلاب الجامعة' : 'University Students'
                    }
                    fill
                    className='object-cover'
                  />
                  {/* Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-blue-800/60 via-blue-900/20 to-transparent'></div>

                  {/* Play Button */}
                  <motion.button
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
                    viewport={{ once: true }}
                    onClick={() => setIsVideoPlaying(true)}
                    className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 group'
                  >
                    <Play
                      size={32}
                      className='text-blue-900 ml-1 group-hover:scale-110 transition-transform duration-300'
                      fill='currentColor'
                    />
                  </motion.button>

                  {/* Video Info */}
                  {!isVideoPlaying && (
                    <div className='absolute bottom-6 left-6 right-6'>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        viewport={{ once: true }}
                        className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4'
                      >
                        <div className='flex items-center gap-3 mb-2'>
                          <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
                          <span className='text-white/90 text-sm font-medium'>
                            {locale === 'ar' ? 'فيديو جديد' : 'New Video'}
                          </span>
                        </div>
                        <h4 className='text-white font-semibold text-lg'>
                          {locale === 'ar'
                            ? 'اكتشف جامعتنا'
                            : 'Discover Our University'}
                        </h4>
                        <p className='text-white/80 text-sm'>
                          {locale === 'ar'
                            ? 'جولة افتراضية في الحرم الجامعي'
                            : 'Virtual Campus Tour'}
                        </p>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className='absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg'
              >
                <Star size={24} className='text-white' />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className='absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg'
              >
                <Sparkles size={20} className='text-white' />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
