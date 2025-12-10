import React from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BookOpen, Clock, Award, ChevronRight } from 'lucide-react';

export interface ProgramItem {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  faculty: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  duration?: {
    ar: string;
    en: string;
  };
  degree?: {
    ar: string;
    en: string;
  };
  money?: {
    ar: string;
    en: string;
  };
  image?: string;
  href?: string;
}

export interface ProgramsSectionProps {
  title: {
    ar: string;
    en: string;
  };
  subtitle?: {
    ar: string;
    en: string;
  };
  items: ProgramItem[];
  accentClassName?: string;
  cardTitleClassName?: string;
  local: string;
}

function ProgramsSection({
  title,
  subtitle,
  items,
  cardTitleClassName,
  local,
}: ProgramsSectionProps) {
  const programsT = useTranslations('programs');
  return (
    <section id='programs' className='py-16'>
      <div className='container mx-auto px-4 relative'>
        <div className='max-w-3xl mx-auto text-center mb-16 relative z-10'>
          <Reveal from='up'>
            <div className='flex items-start justify-center mb-4 gap-4'>
              <h2 className='text-4xl sm:text-5xl font-extrabold text-[#023e8a] drop-shadow-lg tracking-tight mb-2'>
                {local === 'ar' ? title.ar : title.en}
              </h2>
            </div>
          </Reveal>
          {subtitle && (
            <Reveal delayMs={100} from='up'>
              <p className='text-lg sm:text-2xl text-gray-700 max-w-2xl mx-auto font-medium'>
                {local === 'ar' ? subtitle.ar : subtitle.en}
              </p>
            </Reveal>
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {items.map((program, index) => (
            <Reveal key={program.id} delayMs={index * 80} from='up'>
              <article
                tabIndex={0}
                className='group relative bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl active:shadow-2xl focus-within:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 active:-translate-y-2 focus-within:-translate-y-2 ring-1 ring-transparent hover:ring-[#023e8a]/50 focus-within:ring-[#023e8a]/50 h-full flex flex-col'
              >
                <div className='relative overflow-hidden h-52'>
                  {program.image ? (
                    <Image
                      src={program.image}
                      alt={local === 'ar' ? program.title.ar : program.title.en}
                      fill
                      className='object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-80 group-active:opacity-80 group-focus-within:opacity-80'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      priority={index < 3}
                    />
                  ) : (
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center'>
                      <BookOpen className='w-16 h-16 text-[#023e8a]/30' />
                    </div>
                  )}
                  {program.money && (
                    <div className='absolute inset-0 bg-black/5 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100 group-focus-within:opacity-100'>
                      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-3 w-[130%] transform-gpu'>
                        <div className='mx-auto rounded-xl bg-gradient-to-r from-[#023e8a] via-blue-600 to-[#023e8a] shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/20'>
                          <div className='px-8 py-4 text-center flex items-center justify-center gap-2'>
                            <span className='text-2xl sm:text-3xl font-extrabold tracking-wide text-white drop-shadow-md'>
                              {local === 'ar'
                                ? program.money.ar
                                : program.money.en}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className='absolute top-4 left-6 w-3 h-3 rounded-full bg-blue-400 animate-ping'></span>
                      <span className='absolute bottom-5 right-8 w-2 h-2 rounded-full bg-blue-300 animate-ping [animation-delay:300ms]'></span>
                    </div>
                  )}
                  <div className='absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 text-[#023e8a] border border-[#023e8a]/20 backdrop-blur shadow-sm'>
                    {local === 'ar' ? program.faculty.ar : program.faculty.en}
                  </div>
                </div>

                <div className='p-6 flex-1 flex flex-col'>
                  <h3
                    className={`text-xl font-bold mb-3 group-hover:text-[#023e8a] transition-colors ${cardTitleClassName || ''}`}
                  >
                    {local === 'ar' ? program.title.ar : program.title.en}
                  </h3>
                  <p className='text-gray-600 mb-5 line-clamp-3 flex-1 min-h-[4.5rem]'>
                    {local === 'ar'
                      ? program.description.ar
                      : program.description.en}
                  </p>

                  {/* Program details with icons */}
                  <div className='space-y-3 mb-5'>
                    {program.degree && (
                      <div className='flex items-center gap-2 text-sm'>
                        <Award className='w-4 h-4 text-[#023e8a]' />
                        <span className='text-gray-700'>
                          {local === 'ar'
                            ? program.degree.ar
                            : program.degree.en}
                        </span>
                      </div>
                    )}
                    {program.duration && (
                      <div className='flex items-center gap-2 text-sm'>
                        <Clock className='w-4 h-4 text-[#023e8a]' />
                        <span className='text-gray-700'>
                          {local === 'ar'
                            ? program.duration.ar
                            : program.duration.en}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5'></div>

                  <div className='mt-auto'>
                    {program.href && (
                      <a
                        href={program.href}
                        className='inline-flex items-center justify-center w-full gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[#023e8a] to-blue-600 hover:from-[#01326a] hover:to-blue-700 px-4 py-2.5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md group/btn'
                      >
                        {programsT('learn_more')}
                        <ChevronRight className='w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1' />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProgramsSection;
