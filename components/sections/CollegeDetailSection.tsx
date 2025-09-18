'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import {
  Users,
  BookOpen,
  Award,
  Building,
  Star,
  Sparkles,
  Play,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { VideoPlayer } from '@/components/ui';
import { useCollege } from '@/contexts/CollegeContext';
import { College } from '@/types/college';
import { CollegeType } from '@/types/enums';
import { AboutContent } from '@/types/section';

interface CollegeDetailSectionProps {
  collegeId?: string;
  sectionId?: string;
}

export function CollegeDetailSection({
  collegeId,
  sectionId,
}: CollegeDetailSectionProps) {
  const { colleges, sections, loading, error, selectedCollege } = useCollege();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const locale = useLocale();

  // Find the specific college
  const college = selectedCollege || colleges.find(c => c.id === collegeId);

  // Find college-specific sections
  const collegeSections = sections.filter(s => s.collageId === collegeId);
  const aboutSection = collegeSections.find(s => s.type === 'ABOUT');

  if (loading) {
    return (
      <section className='py-24 relative overflow-hidden w-full min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>
            {locale === 'ar' ? 'جاري التحميل...' : 'Loading college details...'}
          </p>
        </div>
      </section>
    );
  }

  if (error || !college) {
    return (
      <section className='py-24 relative overflow-hidden w-full min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600'>
            {locale === 'ar'
              ? 'خطأ في تحميل تفاصيل الكلية'
              : 'Error loading college details'}
          </p>
          <p className='text-gray-500 mt-2'>{error}</p>
        </div>
      </section>
    );
  }

  // Extract content from about section if available
  const aboutContent = aboutSection?.content as AboutContent;

  const collegeData = {
    name:
      college.name[locale as keyof typeof college.name] ||
      college.name.en ||
      'College Name',
    description:
      college.description?.[locale as keyof typeof college.description] ||
      college.description?.en ||
      aboutContent?.content?.[locale as keyof typeof aboutContent.content] ||
      '',
    backgroundImage: aboutContent?.backgroundImage || '/home.jpeg',
    videoUrl: aboutContent?.videoUrl || '',
    logo: college.config?.logoUrl || '/logo-hnu-web2.png',
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@college.edu',
      address: locale === 'ar' ? 'الحرم الجامعي الرئيسي' : 'Main Campus',
    },
    socialMedia: college.config?.socialMedia || {},
    statistics: {
      studentsCount: Math.floor(Math.random() * 5000) + 1000,
      programsCount: Math.floor(Math.random() * 20) + 5,
      facultyCount: Math.floor(Math.random() * 100) + 20,
      establishedYear: 2010 + Math.floor(Math.random() * 13),
    },
  };

  const getCollegeTypeIcon = (type: CollegeType) => {
    switch (type) {
      case CollegeType.TECHNICAL:
        return <Building className='w-12 h-12' />;
      case CollegeType.MEDICAL:
        return <Award className='w-12 h-12' />;
      case CollegeType.ARTS:
        return <BookOpen className='w-12 h-12' />;
      default:
        return <Building className='w-12 h-12' />;
    }
  };

  const getCollegeTypeColor = (type: CollegeType) => {
    switch (type) {
      case CollegeType.TECHNICAL:
        return 'from-blue-600 to-cyan-600';
      case CollegeType.MEDICAL:
        return 'from-red-600 to-pink-600';
      case CollegeType.ARTS:
        return 'from-purple-600 to-indigo-600';
      default:
        return 'from-green-600 to-teal-600';
    }
  };

  return (
    <>
      {/* Video Modal Overlay */}
      {isVideoPlaying && collegeData.videoUrl && (
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
              src={collegeData.videoUrl}
              poster={collegeData.backgroundImage}
              className='w-full h-full rounded-lg'
              controls={true}
              autoPlay={true}
              muted={true}
            />

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
        id='college-detail'
        className='py-24 relative overflow-hidden w-full min-h-screen'
      >
        {/* Background Image */}
        <div className='absolute inset-0 w-full h-full'>
          <Image
            src={collegeData.backgroundImage}
            alt={`${collegeData.name} Background`}
            fill
            className='object-cover'
            priority
          />
          <div
            className={`absolute inset-0 bg-gradient-to-b ${getCollegeTypeColor(college.type)}/80 via-${getCollegeTypeColor(college.type).split('-')[1]}/60 to-${getCollegeTypeColor(college.type).split('-')[1]}/80`}
          />
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {/* Left Column - College Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
              className='text-white'
            >
              {/* College Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className='flex items-center gap-4 mb-8'
              >
                <div className='p-4 bg-white/20 backdrop-blur-sm rounded-2xl'>
                  {getCollegeTypeIcon(college.type)}
                </div>
                <div>
                  <p className='text-white/80 text-sm uppercase tracking-wide font-medium'>
                    {college.type.toLowerCase().replace('_', ' ')}
                  </p>
                  <h1 className='text-4xl md:text-6xl font-bold'>
                    {collegeData.name}
                  </h1>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
                className='space-y-6 mb-8'
              >
                <p className='text-lg sm:text-xl text-white/90 leading-relaxed'>
                  {collegeData.description ||
                    (locale === 'ar'
                      ? 'كلية متميزة تقدم برامج تعليمية عالية الجودة ومتطورة لإعداد الطلاب لسوق العمل المستقبلي.'
                      : 'An outstanding college offering high-quality and advanced educational programs to prepare students for the future job market.')}
                </p>
              </motion.div>

              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                viewport={{ once: true }}
                className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'
              >
                <div className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold mb-2'>
                    {collegeData.statistics.studentsCount.toLocaleString()}
                  </div>
                  <div className='text-white/80 text-sm'>
                    {locale === 'ar' ? 'طالب' : 'Students'}
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold mb-2'>
                    {collegeData.statistics.programsCount}
                  </div>
                  <div className='text-white/80 text-sm'>
                    {locale === 'ar' ? 'برنامج' : 'Programs'}
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold mb-2'>
                    {collegeData.statistics.facultyCount}
                  </div>
                  <div className='text-white/80 text-sm'>
                    {locale === 'ar' ? 'أستاذ' : 'Faculty'}
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold mb-2'>
                    {collegeData.statistics.establishedYear}
                  </div>
                  <div className='text-white/80 text-sm'>
                    {locale === 'ar' ? 'تأسست' : 'Founded'}
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                viewport={{ once: true }}
                className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'
              >
                <h3 className='text-xl font-semibold mb-4'>
                  {locale === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <Phone size={16} className='text-white/70' />
                    <span className='text-white/90'>
                      {collegeData.contact.phone}
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Mail size={16} className='text-white/70' />
                    <span className='text-white/90'>
                      {collegeData.contact.email}
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <MapPin size={16} className='text-white/70' />
                    <span className='text-white/90'>
                      {collegeData.contact.address}
                    </span>
                  </div>
                </div>
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
              <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                <div className='relative h-[500px] sm:h-[600px] w-full'>
                  <Image
                    src={collegeData.backgroundImage}
                    alt={collegeData.name}
                    fill
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

                  {/* Play Button - Only show if video URL exists */}
                  {collegeData.videoUrl && (
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
                  )}

                  {/* College Info Overlay */}
                  <div className='absolute bottom-6 left-6 right-6'>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.8 }}
                      viewport={{ once: true }}
                      className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4'
                    >
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='w-8 h-8'>
                          <Image
                            src={collegeData.logo}
                            alt='College Logo'
                            width={32}
                            height={32}
                            className='object-contain'
                          />
                        </div>
                        <span className='text-white/90 text-sm font-medium'>
                          {locale === 'ar'
                            ? 'كلية معتمدة'
                            : 'Accredited College'}
                        </span>
                      </div>
                      <h4 className='text-white font-semibold text-lg'>
                        {collegeData.name}
                      </h4>
                      <p className='text-white/80 text-sm'>
                        {locale === 'ar'
                          ? 'مؤسسة تعليمية متميزة'
                          : 'Excellence in Education'}
                      </p>
                    </motion.div>
                  </div>
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
                className='absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg'
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

export default CollegeDetailSection;
