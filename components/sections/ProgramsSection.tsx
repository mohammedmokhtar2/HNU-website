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
  const [selectedDegree, setSelectedDegree] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'duration' | 'credits'>('name');

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
    <section className='relative w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4'>
            <GraduationCap className='w-4 h-4' />
            {locale === 'ar' ? 'البرامج الأكاديمية' : 'Academic Programs'}
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            {ProgramsSectionData.title?.[
              locale as keyof typeof ProgramsSectionData.title
            ] || (locale === 'ar' ? 'البرامج الأكاديمية' : 'Academic Programs')}
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
            {ProgramsSectionData.description?.[
              locale as keyof typeof ProgramsSectionData.description
            ] ||
              (locale === 'ar'
                ? 'نقدم مجموعة واسعة من البرامج الأكاديمية المصممة لتلبية احتياجات سوق العمل وإعداد الطلاب لمهن ناجحة.'
                : 'We offer a wide range of academic programs designed to meet the needs of the job market and prepare students for successful careers.')}
          </p>
        </div>

        {/* Programs Display */}
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

        {/* View All Programs Button */}
        <div className='text-center mt-12'>
          <Link
            href='/programs'
            className='inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
          >
            {ProgramsSectionData.buttonText?.[
              locale as keyof typeof ProgramsSectionData.buttonText
            ] || (locale === 'ar' ? 'عرض جميع البرامج' : 'View All Programs')}
            <ChevronRight className='w-5 h-5' />
          </Link>
        </div>
      </div>
    </section>
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
      <div className='bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden'>
        <div className='flex flex-col md:flex-row'>
          {/* Image */}
          <div className='relative w-full md:w-80 h-48 md:h-auto'>
            <Image
              src={programConfig.images?.[0] || '/home.jpeg'}
              alt={programName}
              fill
              className='object-cover'
            />
            <div className='absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
              {programConfig.degree || 'Program'}
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 p-6'>
            <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-4'>
              <div className='flex-1'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  <Link
                    href={`/programs/${program.id}`}
                    className='hover:text-blue-600 transition-colors duration-300'
                  >
                    {programName}
                  </Link>
                </h3>
                {collegeName && (
                  <div className='flex items-center gap-2 text-gray-600 mb-2'>
                    <Building2 className='w-4 h-4' />
                    <span className='text-sm'>{collegeName}</span>
                  </div>
                )}
              </div>
              <div className='flex gap-2 mt-2 md:mt-0'>
                <button className='p-2 text-gray-400 hover:text-blue-600 transition-colors'>
                  <Eye className='w-5 h-5' />
                </button>
                <button className='p-2 text-gray-400 hover:text-green-600 transition-colors'>
                  <Download className='w-5 h-5' />
                </button>
              </div>
            </div>

            {programDescription && (
              <p className='text-gray-600 mb-4 line-clamp-2'>
                {programDescription}
              </p>
            )}

            <div className='flex flex-wrap gap-6 text-sm text-gray-500 mb-4'>
              {programConfig.duration && (
                <div className='flex items-center gap-2'>
                  <Clock className='w-4 h-4' />
                  <span>{programConfig.duration}</span>
                </div>
              )}
              {programConfig.credits && (
                <div className='flex items-center gap-2'>
                  <Award className='w-4 h-4' />
                  <span>{programConfig.credits} credits</span>
                </div>
              )}
            </div>

            <div className='flex flex-wrap gap-2'>
              <Link
                href={`/programs/${program.id}`}
                className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'
              >
                <ExternalLink className='w-4 h-4' />
                {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
              </Link>
              {programConfig.pdfs?.[0] && (
                <a
                  href={programConfig.pdfs[0]}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors'
                >
                  <FileText className='w-4 h-4' />
                  {locale === 'ar' ? 'المنهج الدراسي' : 'Curriculum'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className='bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group'>
      {/* Image */}
      <div className='relative h-48 w-full'>
        <Image
          src={programConfig.images?.[0] || '/home.jpeg'}
          alt={programName}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
        <div className='absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
          {programConfig.degree || 'Program'}
        </div>
        <div className='absolute bottom-4 left-4 right-4'>
          <h3 className='text-white text-xl font-bold mb-1'>
            <Link
              href={`/programs/${program.id}`}
              className='hover:text-blue-200 transition-colors duration-300'
            >
              {programName}
            </Link>
          </h3>
          {collegeName && (
            <p className='text-blue-100 text-sm flex items-center gap-1'>
              <Building2 className='w-3 h-3' />
              {collegeName}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        {programDescription && (
          <p className='text-gray-600 mb-4 line-clamp-2'>
            {programDescription}
          </p>
        )}

        <div className='flex flex-wrap gap-4 text-sm text-gray-500 mb-4'>
          {programConfig.duration && (
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              <span>{programConfig.duration}</span>
            </div>
          )}
          {programConfig.credits && (
            <div className='flex items-center gap-2'>
              <Award className='w-4 h-4' />
              <span>{programConfig.credits} credits</span>
            </div>
          )}
        </div>

        <div className='flex flex-wrap gap-2'>
          <Link
            href={`/programs/${program.id}`}
            className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex-1 justify-center'
          >
            <ExternalLink className='w-4 h-4' />
            {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
          </Link>
          {programConfig.pdfs?.[0] && (
            <a
              href={programConfig.pdfs[0]}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors'
            >
              <FileText className='w-4 h-4' />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
