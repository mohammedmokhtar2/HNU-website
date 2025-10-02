'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useUniversity } from '@/contexts/UniversityContext';
import { useProgram } from '@/contexts/ProgramContext';
import { SectionType } from '@/types/enums';
import { ProgramsSectionContent } from '@/types/section';
import {
  GraduationCap,
  ChevronRight,
  BookOpen,
  Clock,
  Award,
  ExternalLink,
  Users,
  Calendar,
  MapPin,
  Star,
  Filter,
  Search,
  Grid3X3,
  List,
  Eye,
  Download,
  Play,
  FileText,
  Globe,
  Building2,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { College } from '@prisma/client';
import { useSection } from '@/contexts';

interface ProgramsSectionProps {
  sectionId?: string;
  collageId?: string;
}
interface ProgramConfig {
  duration?: string;
  credits?: number;
  degree?: string;
  images?: string[];
  videos?: string[];
  pdfs?: string[]; // for the لوايح بتاعت كل قسم
  links?: {
    title: string;
    href: string;
  }[];
  [key: string]: any; // Add index signature for JSON compatibility
}

// Base Program type from Prisma
interface Program {
  id: string;
  name: Record<string, any>; // JSON field for multilingual names
  description?: Record<string, any>; // JSON field for multilingual descriptions
  config?: ProgramConfig; // JSON field for additional configuration
  collageId?: string | null;
  collage?: College | null;
  createdAt: Date;
  updatedAt: Date;
}

export function ProgramsSection({
  sectionId,
  collageId,
}: ProgramsSectionProps) {
  console.log('collageId from the programs section', collageId);
  const { sections, loading, error } = useSection();
  const {
    programs,
    loading: programsLoading,
    error: programsError,
  } = useProgram();
  const locale = useLocale();

  // State for view modes and filters
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const ProgramsSection = sections.find(
    s =>
      s.type === SectionType.PROGRAMS_SECTION &&
      (!sectionId || s.id === sectionId)
  );
  console.log('sectionId', sectionId);

  if (loading || error || !ProgramsSection) {
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

  const content = ProgramsSection.content as ProgramsSectionContent;

  const ProgramsSectionData = {
    title: {
      en: content?.title?.en || 'Academic Programs',
      ar: content?.title?.ar || 'البرامج الأكاديمية',
    },
    subtitle: {
      en: content?.subtitle?.en || 'Discover Our Diverse Programs',
      ar: content?.subtitle?.ar || 'اكتشف برامجنا المتنوعة',
    },
    description: {
      en:
        content?.description?.en ||
        'We offer a wide range of academic programs designed to meet the needs of the job market and prepare students for successful careers.',
      ar:
        content?.description?.ar ||
        'نقدم مجموعة واسعة من البرامج الأكاديمية المصممة لتلبية احتياجات سوق العمل وإعداد الطلاب لمهن ناجحة.',
    },
    buttonText: {
      en: content?.buttonText?.en || 'View All Programs',
      ar: content?.buttonText?.ar || 'عرض جميع البرامج',
    },
    maxItems: content?.maxItems || 6,
  };

  console.log(
    'programs from the programs section fdsfdsf',
    ProgramsSectionData
  );

  // Filter and sort programs
  let filteredPrograms = collageId
    ? programs.filter(program => program.collageId === collageId)
    : programs;

  // Apply search filter
  if (searchQuery) {
    filteredPrograms = filteredPrograms.filter(program => {
      const name = program.name?.[locale] || program.name?.en || '';
      const description =
        program.description?.[locale] || program.description?.en || '';
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

<<<<<<< Updated upstream
  return (
    <main className='px-4 md:px-8 lg:px-16 bg-gray-50 py-12 ' id='programs'>
=======
  // Apply degree filter
  if (selectedDegree !== 'all') {
    filteredPrograms = filteredPrograms.filter(
      program => program.config?.degree === selectedDegree
    );
  }

  // Apply sorting
  filteredPrograms.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        const nameA = a.name?.[locale] || a.name?.en || '';
        const nameB = b.name?.[locale] || b.name?.en || '';
        return nameA.localeCompare(nameB);
      case 'duration':
        const durationA = parseInt(a.config?.duration?.split(' ')[0] || '0');
        const durationB = parseInt(b.config?.duration?.split(' ')[0] || '0');
        return durationA - durationB;
      case 'credits':
        return (a.config?.credits || 0) - (b.config?.credits || 0);
      default:
        return 0;
    }
  });

  // Get unique degrees for filter
  const uniqueDegrees = Array.from(
    new Set(programs.map(program => program.config?.degree).filter(Boolean))
  );

  // Statistics
  const totalPrograms = filteredPrograms.length;
  const totalCredits = filteredPrograms.reduce(
    (sum, program) => sum + (program.config?.credits || 0),
    0
  );
  const averageDuration =
    filteredPrograms.length > 0
      ? Math.round(
          filteredPrograms.reduce((sum, program) => {
            const duration = parseInt(
              program.config?.duration?.split(' ')[0] || '0'
            );
            return sum + duration;
          }, 0) / filteredPrograms.length
        )
      : 0;

  return (
    <main className='px-4 md:px-8 lg:px-16 bg-gray-50 py-12' id='programs'>
>>>>>>> Stashed changes
      <section className='mb-16 bg-gray-50'>
        {/* Header */}
        <div className='bg-[#023f8a] text-white p-8 rounded-lg shadow-md mb-8'>
          <h2 className='text-2xl font-bold text-center mb-2'>
            {ProgramsSectionData.title?.[
              locale as keyof typeof ProgramsSectionData.title
            ] || (locale === 'ar' ? 'البرامج الأكاديمية' : 'Academic Programs')}
          </h2>
          <p className='text-center text-blue-100'>
            {ProgramsSectionData.description?.[
              locale as keyof typeof ProgramsSectionData.description
            ] ||
              (locale === 'ar'
                ? 'نقدم مجموعة واسعة من البرامج الأكاديمية المصممة لتلبية احتياجات سوق العمل وإعداد الطلاب لمهن ناجحة.'
                : 'We offer a wide range of academic programs designed to meet the needs of the job market and prepare students for successful careers.')}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className='mb-8 flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div className='flex-1 max-w-md'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder={
                  locale === 'ar' ? 'البحث في البرامج...' : 'Search programs...'
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          <div className='flex gap-4 items-center'>
<<<<<<< Updated upstream
=======
            <select
              value={selectedDegree}
              onChange={e => setSelectedDegree(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>
                {locale === 'ar' ? 'جميع الدرجات' : 'All Degrees'}
              </option>
              {uniqueDegrees.map(degree => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={e =>
                setSortBy(e.target.value as 'name' | 'duration' | 'credits')
              }
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='name'>{locale === 'ar' ? 'الاسم' : 'Name'}</option>
              <option value='duration'>
                {locale === 'ar' ? 'المدة' : 'Duration'}
              </option>
              <option value='credits'>
                {locale === 'ar' ? 'الساعات المعتمدة' : 'Credits'}
              </option>
            </select>

>>>>>>> Stashed changes
            <div className='flex border border-gray-300 rounded-lg overflow-hidden'>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className='w-4 h-4' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

<<<<<<< Updated upstream
=======
        {/* Statistics */}
        {filteredPrograms.length > 0 && (
          <div className='mb-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>
                {totalPrograms}
              </div>
              <div className='text-gray-600'>
                {locale === 'ar' ? 'إجمالي البرامج' : 'Total Programs'}
              </div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <div className='text-3xl font-bold text-green-600 mb-2'>
                {totalCredits}
              </div>
              <div className='text-gray-600'>
                {locale === 'ar' ? 'إجمالي الساعات المعتمدة' : 'Total Credits'}
              </div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <div className='text-3xl font-bold text-purple-600 mb-2'>
                {averageDuration}
              </div>
              <div className='text-gray-600'>
                {locale === 'ar'
                  ? 'متوسط المدة (سنوات)'
                  : 'Average Duration (Years)'}
              </div>
            </div>
          </div>
        )}

>>>>>>> Stashed changes
        {/* Programs Grid */}
        {programsLoading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-4 text-gray-600'>
                {locale === 'ar'
                  ? 'جاري تحميل البرامج...'
                  : 'Loading programs...'}
              </p>
            </div>
          </div>
        ) : programsError ? (
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <p className='text-red-600'>
                {locale === 'ar'
                  ? 'خطأ في تحميل البرامج:'
                  : 'Error loading programs:'}{' '}
                {programsError}
              </p>
            </div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
            <BookOpen className='w-16 h-16 mb-4 text-gray-300' />
            <h3 className='text-xl font-semibold mb-2'>
              {locale === 'ar'
                ? 'لا توجد برامج متاحة'
                : 'No Programs Available'}
            </h3>
            <p className='text-gray-400'>
              {locale === 'ar'
                ? 'لم نجد أي برامج تطابق معايير البحث الخاصة بك'
                : "We couldn't find any programs matching your search criteria"}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
            }
          >
            {filteredPrograms.map((program, index) => (
              <ComprehensiveProgramCard
                key={program.id || index}
                program={program}
                locale={locale}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// Comprehensive Program Card Component
interface ComprehensiveProgramCardProps {
  program: Program;
  locale: string;
  viewMode: 'grid' | 'list';
}

function ComprehensiveProgramCard({
  program,
  locale,
  viewMode,
}: ComprehensiveProgramCardProps) {
  const programName = program.name?.[locale] || program.name?.en || 'Program';
  const programDescription =
    program.description?.[locale] || program.description?.en || '';
  const programConfig = program.config || {};
  const collegeName =
    (program.collage?.name as any)?.[locale] ||
    (program.collage?.name as any)?.en ||
    '';

  if (viewMode === 'list') {
    return (
      <Link href={`/colleges/${program.collage?.slug}/programs/${program.id}`}>
        <div className='bg-white rounded-lg shadow-md min-h-[400px] max-h-[400px] hover:shadow-lg  overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col'>
          <div className='flex flex-col md:flex-row'>
            {/* Image */}
            <div className='relative h-48 md:h-auto w-full md:w-80 overflow-hidden'>
              <Image
                src={programConfig.images?.[0] || '/home.jpeg'}
                alt={programName}
                width={400}
                height={192}
                className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/400x300/6b7280/ffffff?text=No+Image';
                }}
              />
              <div className='absolute top-4 right-4'>
                <span className='bg-[#023f8a] text-white text-xs font-medium px-2.5 py-0.5 rounded-full'>
                  {programConfig.duration || '4 Years'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className='p-6 flex flex-col flex-grow justify-between'>
              <div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {programName}
                </h3>

                {collegeName && (
                  <div className='flex items-center gap-2 text-gray-600 mb-2'>
                    <Building2 className='w-4 h-4' />
                    <span className='text-sm'>{collegeName}</span>
                  </div>
                )}

                {programDescription && (
                  <p className='text-gray-600 mb-4 line-clamp-3'>
                    {programDescription}
                  </p>
                )}
              </div>

              {/* Navigation Indicator */}
              <div className='border-t pt-4 mt-auto'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>
                    {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </span>
                  <ChevronRight className='w-4 h-4 text-blue-600' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view - Updated to match dummy design
  return (
    <Link
      href={`/colleges/${program.collage?.slug || 'default'}/programs/${program.id}`}
    >
<<<<<<< Updated upstream
      <div className='bg-white rounded-lg shadow-md min-h-[400px] max-h-[400px] hover:shadow-lg  overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col'>
=======
      <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col'>
>>>>>>> Stashed changes
        {/* Image */}
        <div className='relative h-48 overflow-hidden'>
          <Image
            src={programConfig.images?.[0] || '/home.jpeg'}
            alt={programName}
            width={400}
            height={192}
            className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
            onError={e => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/400x300/6b7280/ffffff?text=No+Image';
            }}
          />
          <div className='absolute top-4 right-4'>
            <span className='bg-[#023f8a] text-white text-xs font-medium px-2.5 py-0.5 rounded-full'>
              {programConfig.duration || '4 Years'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className='p-6 flex flex-col flex-grow justify-between'>
          <div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              {programName}
            </h3>

            {collegeName && (
              <div className='flex items-center gap-2 text-gray-600 mb-2'>
                <Building2 className='w-4 h-4' />
                <span className='text-sm'>{collegeName}</span>
              </div>
            )}

            {programDescription && (
              <p className='text-gray-600 mb-4 line-clamp-3'>
                {programDescription}
              </p>
            )}
          </div>

          {/* Navigation Indicator */}
          <div className='border-t pt-4 mt-auto'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-500'>
                {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
              </span>
              <ChevronRight className='w-4 h-4 text-blue-600' />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
