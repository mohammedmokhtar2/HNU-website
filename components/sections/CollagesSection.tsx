'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  ChevronRight,
  Building,
  Clock,
  MapPin,
  DollarSign,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import { useCollege } from '@/contexts/CollegeContext';
import { College } from '@/types/college';
import { CollegeType } from '@/types/enums';
import { CollegesContent } from '@/types/section';

interface CollegeSectionProps {
  universityId?: string;
  sectionId?: string;
  title?: {
    ar: string;
    en: string;
  };
  subtitle?: {
    ar: string;
    en: string;
  };
  content?: CollegesContent;
}

interface CollegeWithStats extends College {
  studentsCount?: number;
  programsCount?: number;
  facultyCount?: number;
  establishedYear?: number;
}

export function CollegeSection({
  universityId,
  sectionId,
  title,
  subtitle,
  content,
}: CollegeSectionProps) {
  const { colleges, loading, error } = useCollege();
  const locale = useLocale();
  // const t = useTranslations('colleges');

  console.log('CollegeSection - universityId:', universityId);
  console.log('CollegeSection - colleges:', colleges);
  console.log('CollegeSection - colleges.length:', colleges.length);
  console.log('CollegeSection - loading:', loading);
  console.log('CollegeSection - error:', error);

  // Get display settings from admin-managed content
  const displaySettings = content?.displaySettings || {
    showFees: true,
    showStudentCount: false,
    showProgramsCount: true,
    showFacultyCount: true,
  };

  // Get default fees from admin content
  const defaultFees = content?.defaultFees || {
    en: 'EGP 80,000/yr',
    ar: '٨٠٠٠٠ جنيه/سنة',
  };

  // Use real college data instead of mock statistics
  const collegesWithStats: CollegeWithStats[] = colleges.map(college => ({
    ...college,
    // Use fees from college data or default from admin content
    fees: college.fees || defaultFees,
    // Use actual college statistics if available, otherwise use defaults
    studentsCount:
      college.studentsCount || Math.floor(Math.random() * 5000) + 1000,
    programsCount: college.programsCount || Math.floor(Math.random() * 20) + 5,
    facultyCount: college.facultyCount || Math.floor(Math.random() * 100) + 20,
    establishedYear:
      college.establishedYear || 2000 + Math.floor(Math.random() * 23),
  }));

  const getCollegeTypeIcon = (type: CollegeType) => {
    switch (type) {
      case CollegeType.TECHNICAL:
        return Building;
      case CollegeType.MEDICAL:
        return Award;
      case CollegeType.ARTS:
        return BookOpen;
      default:
        return GraduationCap;
    }
  };

  const getCollegeImage = (college: College) => {
    // You can add logic here to get college-specific images
    return college.config?.logoUrl || '/home.jpeg';
  };

  const defaultTitle = {
    ar: 'برامج الكليات',
    en: 'College Programs',
  };

  const defaultTitlesub = {
    ar: 'الدراسة في جامعة حلوان الاهلية',
    en: 'Studying at Helwan National University',
  };

  const defaultSubtitle = {
    ar: 'استكشف برامجنا الأكاديمية المتنوعة عبر الكليات',
    en: 'Explore our diverse academic programs across faculties',
  };

  // if (loading) {
  //   return (
  //     <section id="colleges" className="py-16">
  //       <div className="container mx-auto px-4">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#023e8a] mx-auto"></div>
  //           <p className="mt-4 text-gray-600">
  //             {locale === 'ar' ? 'جاري التحميل...' : 'Loading colleges...'}
  //           </p>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  if (error) {
    return (
      <section id='colleges' className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <p className='text-red-600'>
              {locale === 'ar'
                ? 'خطأ في تحميل الكليات'
                : 'Error loading colleges'}
            </p>
            <p className='text-gray-500 mt-2'>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='relative w-full bg-gray-50'>
      <div className='flex flex-col md:flex-row h-full'>
        {/* Left Panel (sidebar or top) */}
        <aside className='w-full md:w-1/3 bg-white text-black p-10 flex flex-col md:sticky md:top-0 md:h-screen'>
          <h2 className='text-xl font-bold mb-4 text-[#023e8a]'>
            {defaultTitle?.[locale as keyof typeof defaultTitle] ||
              (locale === 'ar' ? 'برامج الكليات' : 'College Programs')}
          </h2>
          <h3 className='text-3xl font-extrabold mb-3'>
            {defaultTitlesub?.[locale as keyof typeof defaultTitlesub] ||
              (locale === 'ar'
                ? 'الدراسة في جامعة حلوان الاهلية'
                : 'Studying at Helwan National University')}
          </h3>
          <hr className='border-t border-gray-300 mb-3' />
          <div className='mb-2'>
            {locale === 'ar' ? (
              <>
                <p className='text-base text-gray-700 mb-2'>
                  جامعة حلوان الأهلية (HNU)
                </p>
                <p className='text-base text-gray-700 mb-2'>
                  جامعة ناشئة تهدف إلى تقديم تعليم عالي متميز يجمع بين المعرفة
                  النظرية والتطبيق العملي. تسعى الجامعة لإعداد خريجين قادرين على
                  المنافسة في سوق العمل المحلي والدولي، مع التركيز على البحث
                  العلمي، والابتكار، وتنمية مهارات الطلاب من خلال الأنشطة
                  الأكاديمية والطلابية
                </p>
              </>
            ) : (
              <>
                <p className='text-base text-gray-700 mb-2'>
                  Helwan National University (HNU)
                </p>
                <p className='text-base text-gray-700 mb-2'>
                  A newly established university that aims to provide
                  high-quality education combining theoretical knowledge with
                  practical application. HNU strives to prepare graduates
                  capable of competing in both local and international job
                  markets, with a strong focus on scientific research,
                  innovation, and student skill development through academic and
                  extracurricular activities.
                </p>
              </>
            )}
            <div className='w-full flex justify-center mt-4'>
              <Link
                href='/programs'
                className='inline-flex items-center gap-2 text-[#023e8a] font-semibold text-base px-5 py-2.5 rounded-xl transition-all duration-300 group hover:text-blue-700'
              >
                {locale === 'ar' ? 'عرض كل البرامج' : 'View all Programs'}
                <ChevronRight className='w-5 h-5 transition-transform duration-300 group-hover:translate-x-1' />
              </Link>
            </div>
          </div>
        </aside>
        {/* Vertical divider between panels (desktop only) */}
        <div
          className='hidden md:block w-px bg-gray-300 mx-0'
          style={{ minWidth: '1px', height: '100vh' }}
        />
        {/* Right Panel */}
        <main className='w-full md:w-2/3 h-full md:h-screen overflow-y-auto p-6 md:p-10'>
          {/* Desktop: two cards per row with divider */}
          <div className='hidden md:flex flex-col gap-10'>
            {Array.from({ length: Math.ceil(colleges.length / 2) }).map(
              (_, rowIdx) => {
                const leftIdx = rowIdx * 2;
                const rightIdx = leftIdx + 1;
                const isEvenRow = rowIdx % 2 === 0;
                return (
                  <React.Fragment key={rowIdx}>
                    <div className='flex w-full items-stretch mb-0'>
                      {/* Left card */}
                      {colleges[leftIdx] && (
                        <article
                          className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center ${isEvenRow ? 'flex-[1.2] basis-0' : 'flex-[0.8] basis-0'}`}
                          style={{ minHeight: '320px' }}
                        >
                          <div className='relative h-64 w-full mb-4'>
                            <Image
                              src={
                                colleges[leftIdx].config?.logoUrl ||
                                '/home.jpeg'
                              }
                              alt={
                                colleges[leftIdx].name &&
                                colleges[leftIdx].name[locale]
                                  ? colleges[leftIdx].name[locale]
                                  : 'College'
                              }
                              fill
                              className='object-cover rounded-t-2xl'
                            />
                          </div>
                          <div className='p-6 flex flex-col flex-1 justify-center items-center'>
                            <h3 className='text-xl font-bold text-[#023e8a] mb-0'>
                              <Link
                                href={`/colleges/${colleges[leftIdx].slug}`}
                                className='inline-flex items-center gap-2 group hover:text-blue-700 transition-colors duration-300'
                              >
                                {colleges[leftIdx].name &&
                                  colleges[leftIdx].name[locale]}
                                <ChevronRight className='w-4 h-4 text-[#023e8a] group-hover:translate-x-1 transition-transform duration-300' />
                              </Link>
                            </h3>
                          </div>
                        </article>
                      )}
                      {/* Vertical divider */}
                      {colleges[leftIdx] && colleges[rightIdx] && (
                        <div
                          className='w-px mx-4 bg-gray-400 hidden md:block'
                          style={{
                            minHeight: 'calc(320px + 20px)',
                            marginTop: '-40px',
                            marginBottom: '-40px',
                          }}
                        />
                      )}
                      {/* Right card */}
                      {colleges[rightIdx] && (
                        <article
                          className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center ${isEvenRow ? 'flex-[0.8] basis-0' : 'flex-[1.2] basis-0'}`}
                          style={{ minHeight: '320px' }}
                        >
                          <div className='relative h-64 w-full mb-4'>
                            <Image
                              src={
                                colleges[rightIdx].config?.logoUrl ||
                                '/home.jpeg'
                              }
                              alt={
                                colleges[rightIdx].name &&
                                colleges[rightIdx].name[locale]
                                  ? colleges[rightIdx].name[locale]
                                  : 'College'
                              }
                              fill
                              className='object-cover rounded-t-2xl'
                            />
                          </div>
                          <div className='p-6 flex flex-col flex-1 justify-center items-center'>
                            <h3 className='text-xl font-bold text-[#023e8a] mb-0'>
                              <Link
                                href={`/colleges/${colleges[rightIdx].slug}`}
                                className='inline-flex items-center gap-2 group hover:text-blue-700 transition-colors duration-300'
                              >
                                {colleges[rightIdx].name &&
                                  colleges[rightIdx].name[locale]}
                                <ChevronRight className='w-4 h-4 text-[#023e8a] group-hover:translate-x-1 transition-transform duration-300' />
                              </Link>
                            </h3>
                          </div>
                        </article>
                      )}
                    </div>
                    {/* Horizontal divider after each row */}
                    <div className='w-full h-px bg-gray-400' />
                  </React.Fragment>
                );
              }
            )}
          </div>
          {/* Mobile: one card per row, no vertical divider */}
          <div className='flex flex-col md:hidden'>
            {colleges.map((college, idx) => (
              <React.Fragment key={college.id || idx}>
                <article className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center mb-4 mt-4'>
                  <div className='relative h-64 w-full mb-4'>
                    <Image
                      src={college.config?.logoUrl || '/home.jpeg'}
                      alt={
                        college.name && college.name[locale]
                          ? college.name[locale]
                          : 'College'
                      }
                      fill
                      className='object-cover rounded-t-2xl'
                    />
                  </div>
                  <div className='p-6 flex flex-col flex-1 justify-center items-center'>
                    <h3 className='text-xl font-bold text-[#023e8a] mb-0'>
                      <Link
                        href={`/colleges/${college.slug}`}
                        className='inline-flex items-center gap-2 group hover:text-blue-700 transition-colors duration-300'
                      >
                        {college.name && college.name[locale]}
                        <ChevronRight className='w-4 h-4 text-[#023e8a] group-hover:translate-x-1 transition-transform duration-300' />
                      </Link>
                    </h3>
                  </div>
                </article>
                {idx < colleges.length - 1 && (
                  <div className='w-full h-px bg-gray-400 my-4 md:hidden' />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Empty state */}
          {colleges.length === 0 && !loading && (
            <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
              <GraduationCap className='w-12 h-12 mb-4' />
              <p>
                {locale === 'ar'
                  ? 'لا توجد كليات متاحة حالياً'
                  : 'No colleges available now'}
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

export default CollegeSection;
