'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Star,
  Sparkles,
  Play,
  Users,
  GraduationCap,
  Award,
  Calendar,
  MapPin,
} from 'lucide-react';
import { VideoPlayer } from '@/components/ui';
import { Section } from '@/types';
import { CollegeAboutContent } from '@/types/section';
import { useLocale } from 'next-intl';

interface CollageaboutSectionProps {
  sectionId: string;
  sections: Section[];
}

const CollageaboutSection = ({
  sectionId,
  sections,
}: CollageaboutSectionProps) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const locale = useLocale();

  const section = sections.find((s: any) => s.id === sectionId);

  if (!section) {
    return null;
  }

  // Cast content to CollegeAboutContent type for type safety
  const content = section.content as CollegeAboutContent;
  const collage = section.collage;

  const aboutData = {
    title: {
      en: content.title?.en || 'About Us',
      ar: content.title?.ar || 'معلومات عنا',
    },
    subtitle: {
      en: content.subtitle?.en || 'Learn More About Us',
      ar: content.subtitle?.ar || 'تعرف علينا أكثر',
    },
    description: {
      en:
        content.content?.en ||
        'Our college is committed to providing excellent education and preparing students for successful careers.',
      ar:
        content.content?.ar ||
        'كليتنا ملتزمة بتقديم تعليم متميز وإعداد الطلاب لحياة مهنية ناجحة.',
    },
    backgroundImage: content.backgroundImage || '/home.jpeg',
    videoUrl: content.videoUrl || '',
  };

  const stats = [
    {
      icon: Users,
      value: collage?.studentsCount || 0,
      label: {
        en: 'Students',
        ar: 'طالب',
      },
    },
    {
      icon: GraduationCap,
      value: collage?.programsCount || 0,
      label: {
        en: 'Programs',
        ar: 'برنامج',
      },
    },
    {
      icon: Award,
      value: collage?.facultyCount || 0,
      label: {
        en: 'Faculty',
        ar: 'أعضاء هيئة التدريس',
      },
    },
    {
      icon: Calendar,
      value: collage?.establishedYear || 0,
      label: {
        en: 'Established',
        ar: 'تأسست',
      },
    },
  ];

  return (
    <>
      {/* Video Modal Overlay */}
      {isVideoPlaying && aboutData.videoUrl && (
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
              poster={aboutData.backgroundImage}
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

      <section className='py-24 relative overflow-hidden w-full min-h-screen'>
        {/* Background Image */}
        <div className='absolute inset-0 w-full h-full'>
          <Image
            src={aboutData.backgroundImage}
            alt={locale === 'ar' ? 'خلفية الكلية' : 'College Background'}
            fill
            className='object-cover'
            priority
          />
          {/* Overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/75 to-indigo-900/85' />
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'
            >
              {aboutData.title[locale as keyof typeof aboutData.title]}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className='text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto'
            >
              {aboutData.subtitle[locale as keyof typeof aboutData.subtitle]}
            </motion.p>
          </motion.div>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20'>
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
              className='text-white'
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className='space-y-6'
              >
                <p className='text-lg sm:text-xl text-blue-100 leading-relaxed'>
                  {
                    aboutData.description[
                      locale as keyof typeof aboutData.description
                    ]
                  }
                </p>

                {/* College Description */}
                {collage?.description && (
                  <p className='text-base sm:text-lg text-blue-200 leading-relaxed'>
                    {
                      collage.description[
                        locale as keyof typeof collage.description
                      ]
                    }
                  </p>
                )}
              </motion.div>

              {/* College Info */}
              {collage && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  viewport={{ once: true }}
                  className='mt-8 space-y-4'
                >
                  <div className='flex items-center gap-3 text-blue-100'>
                    <MapPin size={20} className='text-blue-300' />
                    <span className='text-lg'>
                      {collage.name[locale as keyof typeof collage.name]}
                    </span>
                  </div>

                  {collage.fees && (
                    <div className='flex items-center gap-3 text-blue-100'>
                      <Award size={20} className='text-blue-300' />
                      <span className='text-lg'>
                        {collage.fees[locale as keyof typeof collage.fees]}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Right Column - Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
              className='relative'
            >
              {/* Main Image/Video Container */}
              <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                <div className='relative h-[400px] sm:h-[500px] w-full'>
                  <Image
                    src={aboutData.backgroundImage}
                    alt={locale === 'ar' ? 'طلاب الكلية' : 'College Students'}
                    fill
                    className='object-cover'
                  />
                  {/* Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-800/20 to-transparent'></div>

                  {/* Play Button */}
                  {aboutData.videoUrl && (
                    <motion.button
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
                      viewport={{ once: true }}
                      onClick={() => setIsVideoPlaying(true)}
                      className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 group'
                    >
                      <Play
                        size={28}
                        className='text-blue-900 ml-1 group-hover:scale-110 transition-transform duration-300'
                        fill='currentColor'
                      />
                    </motion.button>
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
                className='absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg'
              >
                <Star size={20} className='text-white' />
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
                className='absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg'
              >
                <Sparkles size={16} className='text-white' />
              </motion.div>
            </motion.div>
          </div>

          {/* Statistics Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='grid grid-cols-2 lg:grid-cols-4 gap-8'
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className='text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300'
              >
                <div className='flex justify-center mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center'>
                    <stat.icon size={24} className='text-white' />
                  </div>
                </div>
                <div className='text-3xl font-bold text-white mb-2'>
                  {stat.value.toLocaleString()}
                </div>
                <div className='text-blue-200 text-sm font-medium'>
                  {stat.label[locale as keyof typeof stat.label]}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CollageaboutSection;
