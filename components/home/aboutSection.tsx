import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  GraduationCap,
  Lightbulb,
  Globe,
  Award,
  ArrowRight,
  Star,
  Sparkles,
  Play,
} from 'lucide-react';
import { VideoPlayer } from '@/components/ui';

export interface AboutSectionProps {
  image?: string;
  backgroundImage?: string;
  titleClassName?: string;
  local: string;
}

function AboutSection({
  image,
  backgroundImage,
  titleClassName,
  local,
}: AboutSectionProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
              src='https://8rqmsnrudm.ufs.sh/f/FfKyQhLpRgXUcOPOo7TpnVFGNr3iK6kg5Of4PUbcX7zRDadw'
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
            src='/over.png'
            alt={local === 'ar' ? 'خلفية الجامعة' : 'University Background'}
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
                className={`text-2xl sm:text-4xl lg:text-6xl font-bold mb-8 leading-tight ${titleClassName || ''} text-white`}
              >
                {local === 'ar' ? 'عن جامعتنا' : 'About Us'}
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
                  {local === 'ar'
                    ? 'جامعتنا هي مؤسسة تعليمية رائدة مصممة لقيادة الابتكار وتحقيق التميز في أربعة أبعاد أساسية: التعلم المتقدم، والبحث العلمي المبتكر، والابتكار وريادة الأعمال، والتأثير المجتمعي الإيجابي.'
                    : 'Our university is a leading educational institution designed to lead innovation and achieve excellence in four fundamental dimensions: Advanced Learning, Innovative Research, Innovation and Entrepreneurship, and Positive Community Impact.'}
                </p>

                <p className='text-lg sm:text-xl text-white leading-relaxed'>
                  {local === 'ar'
                    ? 'نتميز ببرامجنا الفريدة القائمة على التكنولوجيا والأعمال، ومراكزنا البحثية المتطورة، وتركيزنا على الابتكار وريادة الأعمال لمعالجة التحديات الحرجة في مجتمعنا، من خلال البحث التطبيقي المتقدم والشراكات الاستراتيجية.'
                    : 'We feature unique technology and business-based programs, advanced research centers, and focus on innovation and entrepreneurship to address critical challenges in our society through cutting-edge applied research and strategic partnerships.'}
                </p>
              </motion.div>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                viewport={{ once: true }}
                className='grid grid-cols-2 gap-4 mb-8'
              >
                {[
                  {
                    icon: GraduationCap,
                    text:
                      local === 'ar'
                        ? 'برامج أكاديمية متطورة'
                        : 'Advanced Academic Programs',
                  },
                  {
                    icon: Lightbulb,
                    text:
                      local === 'ar'
                        ? 'ابتكار وريادة أعمال'
                        : 'Innovation & Entrepreneurship',
                  },
                  {
                    icon: Globe,
                    text:
                      local === 'ar'
                        ? 'شراكات دولية'
                        : 'International Partnerships',
                  },
                  {
                    icon: Award,
                    text:
                      local === 'ar'
                        ? 'تميز في البحث العلمي'
                        : 'Research Excellence',
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.8 + index * 0.1,
                      duration: 0.5,
                      type: 'spring',
                    }}
                    viewport={{ once: true }}
                    className='flex items-center gap-3 group'
                  >
                    <div className='w-10 h-10 bg-white/20 border border-white/30 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300'>
                      <feature.icon size={20} className='text-white' />
                    </div>
                    <span className='text-white text-sm font-medium group-hover:text-white transition-colors duration-300'>
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                viewport={{ once: true }}
                className='group relative px-8 py-4 bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden'
              >
                <span className='relative z-10 font-semibold'>
                  {local === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                </span>
                <ArrowRight
                  size={18}
                  className={`relative z-10 transition-transform duration-300 ${
                    local === 'ar'
                      ? 'rotate-180 group-hover:-translate-x-1'
                      : 'group-hover:translate-x-1'
                  }`}
                />

                {/* Animated background */}
                <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500' />
              </motion.button>
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
                    src={image || '/home.jpeg'}
                    alt={
                      local === 'ar' ? 'طلاب الجامعة' : 'University Students'
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
                            {local === 'ar' ? 'فيديو جديد' : 'New Video'}
                          </span>
                        </div>
                        <h4 className='text-white font-semibold text-lg'>
                          {local === 'ar'
                            ? 'اكتشف جامعتنا'
                            : 'Discover Our University'}
                        </h4>
                        <p className='text-white/80 text-sm'>
                          {local === 'ar'
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

export default AboutSection;
