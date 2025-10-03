'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useUniversity } from '@/contexts/UniversityContext';
import { useCollege } from '@/contexts/CollegeContext';
import { SectionType } from '@/types/enums';
import { CollegeSectionContent } from '@/types/section';
import { GraduationCap, ChevronRight } from 'lucide-react';

interface CollegeSectionProps {
  sectionId?: string;
}

export function CollageSection({ sectionId }: CollegeSectionProps) {
  const { sections, loading, error } = useUniversity();
  const { colleges } = useCollege();
  const locale = useLocale();

  const CollageSection = sections.find(
    s =>
      s.type === SectionType.COLLEGES_SECTION &&
      (!sectionId || s.id === sectionId)
  );
  if (loading || error || !CollageSection) {
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

  const content = CollageSection.content as CollegeSectionContent;

  // export interface CollegeSectionContent {
  //   title: BaseContent;
  //   subtitle: BaseContent;
  //   description: BaseContent;
  //   buttonText: BaseContent;
  //   collegeIds: string[]; // Array of selected college IDs
  // }

  const CollageSectionData = {
    title: {
      en: content?.title?.en || 'College Programs',
      ar: content?.title?.ar || 'برامج الكليات',
    },
    subtitle: {
      en: content?.subtitle?.en || 'Studying at Helwan National University',
      ar: content?.subtitle?.ar || 'الدراسة في جامعة حلوان الاهلية',
    },
    description: {
      en:
        content?.description?.en ||
        'Helwan National University, A newly established university that aims to provide high-quality education combining theoretical knowledge with practical application. HNU strives to prepare graduates capable of competing in both local and international job markets, with a strong focus on scientific research, innovation, and student skill development through academic and extracurricular activities.',
      ar:
        content?.description?.ar ||
        'اكتشف مجموعة متنوعة من البرامج الأكاديمية عبر كلياتنا، المصممة لتزويدك بالمهارات والمعرفة اللازمة لمهنة ناجحة.',
    },
    buttonText: {
      en: content?.buttonText?.en || 'View All Colleges',
      ar: content?.buttonText?.ar || 'عرض جميع الكليات',
    },
    collegeIds: content?.collegeIds || [],
  };

  // فقط الكليات المختارة في section
  const selectedColleges = colleges.filter(college =>
    CollageSectionData.collegeIds.includes(college.id)
  );

  return (
    <section className='relative w-full bg-gray-50 mt-15 mb-15'>
      <div className='flex flex-col md:flex-row h-full'>
        {/* Left Panel (sidebar or top) */}
        <aside className='w-full md:w-1/3 bg-white text-black p-10 flex flex-col md:sticky md:top-0 md:h-screen'>
          <h2 className='text-xl font-bold mb-4 text-[#023e8a]'>
            {CollageSectionData.title?.[
              locale as keyof typeof CollageSectionData.title
            ] || (locale === 'ar' ? 'برامج الكليات' : 'College Programs')}
          </h2>
          <h3 className='text-3xl font-extrabold mb-3'>
            {CollageSectionData.subtitle?.[
              locale as keyof typeof CollageSectionData.subtitle
            ] ||
              (locale === 'ar'
                ? 'الدراسة في جامعة حلوان الاهلية'
                : 'Studying at Helwan National University')}
          </h3>
          <hr className='border-t border-gray-300 mb-3' />
          <div className='mb-2'>
            <>
              <p className='text-base text-gray-700 mb-2'>
                {CollageSectionData.description?.[
                  locale as keyof typeof CollageSectionData.description
                ] ||
                  (locale === 'ar'
                    ? 'اكتشف مجموعة متنوعة من البرامج الأكاديمية عبر كلياتنا، المصممة لتزويدك بالمهارات والمعرفة اللازمة لمهنة ناجحة.'
                    : 'Discover a variety of academic programs across our colleges, designed to equip you with the skills and knowledge for a successful career.')}
              </p>
            </>
            <div className='w-full flex justify-center mt-4'>
              <Link
                href='/colleges'
                className='inline-flex items-center gap-2 text-[#023e8a] font-semibold text-base px-5 py-2.5 rounded-xl transition-all duration-300 group hover:text-blue-700'
              >
                {CollageSectionData.buttonText?.[
                  locale as keyof typeof CollageSectionData.buttonText
                ] ||
                  (locale === 'ar' ? 'عرض جميع الكليات' : 'View All Colleges')}
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
            {Array.from({ length: Math.ceil(selectedColleges.length / 2) }).map(
              (_, rowIdx) => {
                const leftIdx = rowIdx * 2;
                const rightIdx = leftIdx + 1;
                const isEvenRow = rowIdx % 2 === 0;
                return (
                  <React.Fragment key={rowIdx}>
                    <div className='flex w-full items-stretch mb-0'>
                      {/* Left card */}
                      {selectedColleges[leftIdx] && (
                        <article
                          className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center ${isEvenRow ? 'flex-[1.2] basis-0' : 'flex-[0.8] basis-0'}`}
                          style={{ minHeight: '320px' }}
                        >
                          <div className='relative h-64 w-full mb-4'>
                            <Image
                              src={
                                selectedColleges[leftIdx].config?.logoUrl ||
                                '/home.jpeg'
                              }
                              alt={
                                selectedColleges[leftIdx].name &&
                                selectedColleges[leftIdx].name[locale]
                                  ? selectedColleges[leftIdx].name[locale]
                                  : 'College'
                              }
                              fill
                              className='object-cover rounded-t-2xl'
                            />
                          </div>
                          <div className='p-6 flex flex-col flex-1 justify-center items-center'>
                            <h3 className='text-xl font-bold text-[#023e8a] mb-0'>
                              <Link
                                href={`/colleges/${selectedColleges[leftIdx].slug}`}
                                className='inline-flex items-center gap-2 group hover:text-blue-700 transition-colors duration-300'
                              >
                                {selectedColleges[leftIdx].name &&
                                  selectedColleges[leftIdx].name[locale]}
                                <ChevronRight className='w-4 h-4 text-[#023e8a] group-hover:translate-x-1 transition-transform duration-300' />
                              </Link>
                            </h3>
                          </div>
                        </article>
                      )}
                      {/* Vertical divider */}
                      {selectedColleges[leftIdx] &&
                        selectedColleges[rightIdx] && (
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
                      {selectedColleges[rightIdx] && (
                        <article
                          className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center ${isEvenRow ? 'flex-[0.8] basis-0' : 'flex-[1.2] basis-0'}`}
                          style={{ minHeight: '320px' }}
                        >
                          <div className='relative h-64 w-full mb-4'>
                            <Image
                              src={
                                selectedColleges[rightIdx].config?.logoUrl ||
                                '/home.jpeg'
                              }
                              alt={
                                selectedColleges[rightIdx].name &&
                                selectedColleges[rightIdx].name[locale]
                                  ? selectedColleges[rightIdx].name[locale]
                                  : 'College'
                              }
                              fill
                              className='object-cover rounded-t-2xl'
                            />
                          </div>
                          <div className='p-6 flex flex-col flex-1 justify-center items-center'>
                            <h3 className='text-xl font-bold text-[#023e8a] mb-0'>
                              <Link
                                href={`/colleges/${selectedColleges[rightIdx].slug}`}
                                className='inline-flex items-center gap-2 group hover:text-blue-700 transition-colors duration-300'
                              >
                                {selectedColleges[rightIdx].name &&
                                  selectedColleges[rightIdx].name[locale]}
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
            {selectedColleges.map((college, idx) => (
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
                {idx < selectedColleges.length - 1 && (
                  <div className='w-full h-px bg-gray-400 my-4 md:hidden' />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Empty state */}
          {selectedColleges.length === 0 && !loading && (
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
