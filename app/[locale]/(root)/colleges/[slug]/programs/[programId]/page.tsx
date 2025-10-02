'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ProgramService } from '@/services/program.service';
import { Program } from '@/types/program';
import { University } from '@/types/university';
import { useUniversity } from '@/contexts/UniversityContext';
import { useCollege } from '@/contexts/CollegeContext';
import { ProgramProvider } from '@/contexts/ProgramContext';
import {
  GraduationCap,
  Clock,
  Award,
  Users,
  Calendar,
  MapPin,
  Building2,
  BookOpen,
  ExternalLink,
  ArrowLeft,
  Globe,
  Phone,
  Mail,
  ChevronRight,
  Star,
  CheckCircle,
  FileText,
  Play,
  Download,
} from 'lucide-react';

function ProgramDetailContent() {
  const params = useParams();
  const { programId, slug } = params as { programId: string; slug: string };
  const locale = useLocale();

  const [program, setProgram] = useState<Program | null>(null);
  const [relatedPrograms, setRelatedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { university } = useUniversity() as { university: University | null };
  const { colleges } = useCollege();

  // Find the current college
  const currentCollege = colleges.find(college => college.slug === slug);

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the specific program
        const programData = await ProgramService.getProgramById(programId);
        setProgram(programData);

        // Fetch related programs from the same college
        if (programData.collageId) {
          const relatedData = await ProgramService.getProgramsByCollege(
            programData.collageId,
            {
              limit: 6,
              orderBy: 'createdAt',
              orderDirection: 'desc',
            }
          );
          setRelatedPrograms(relatedData.data.filter(p => p.id !== programId));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load program');
        console.error('Error fetching program:', err);
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgramData();
    }
  }, [programId]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading program details...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-600 text-6xl mb-4'>⚠️</div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            {locale === 'ar' ? 'البرنامج غير موجود' : 'Program Not Found'}
          </h1>
          <p className='text-gray-600 mb-6'>
            {error ||
              (locale === 'ar'
                ? 'لم نتمكن من العثور على البرنامج المطلوب'
                : 'We could not find the requested program')}
          </p>
          <Link
            href='/colleges'
            className='inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            {locale === 'ar' ? 'العودة إلى الكليات' : 'Back to Colleges'}
          </Link>
        </div>
      </div>
    );
  }

  const programName = program.name?.[locale] || program.name?.en || 'Program';
  const programDescription =
    program.description?.[locale] || program.description?.en || '';
  const programConfig = program.config || {};
  const collegeName =
    (program.collage?.name as any)?.[locale] ||
    (program.collage?.name as any)?.en ||
    '';

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='w-full px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link
                href={`/colleges/${slug}`}
                className='flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors'
              >
                <ArrowLeft className='w-4 h-4' />
                {locale === 'ar' ? 'العودة' : 'Back'}
              </Link>
              <div className='h-6 w-px bg-gray-300'></div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {programName}
                </h1>
                <p className='text-gray-600'>{collegeName}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
                {programConfig.degree || 'Program'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 xl:grid-cols-16 gap-8'>
          {/* Left Column - Related Programs */}
          <div className='xl:col-span-4'>
            <div className='bg-white rounded-lg shadow-md p-6 sticky top-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <BookOpen className='w-5 h-5 text-blue-600' />
                {locale === 'ar' ? 'برامج أخرى' : 'Other Programs'}
              </h3>
              <div className='space-y-4'>
                {relatedPrograms.length > 0 ? (
                  relatedPrograms.map(relatedProgram => {
                    const relatedName =
                      relatedProgram.name?.[locale] ||
                      relatedProgram.name?.en ||
                      'Program';
                    return (
                      <Link
                        key={relatedProgram.id}
                        href={`/colleges/${slug}/programs/${relatedProgram.id}`}
                        className='block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200'
                      >
                        <h4 className='font-medium text-gray-900 mb-2 line-clamp-2'>
                          {relatedName}
                        </h4>
                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                          <Clock className='w-4 h-4' />
                          <span>
                            {relatedProgram.config?.duration || 'N/A'}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className='text-gray-500 text-sm'>
                    {locale === 'ar'
                      ? 'لا توجد برامج أخرى'
                      : 'No other programs available'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center Column - Program Details */}
          <div className='xl:col-span-8'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              {/* Program Image */}
              {programConfig.images?.[0] && (
                <div className='relative h-64 w-full'>
                  <Image
                    src={programConfig.images[0]}
                    alt={programName}
                    fill
                    className='object-cover'
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/800x400/6b7280/ffffff?text=No+Image';
                    }}
                  />
                  <div className='absolute top-4 right-4'>
                    <span className='bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                      {programConfig.duration || '4 Years'}
                    </span>
                  </div>
                </div>
              )}

              {/* Program Content */}
              <div className='p-8'>
                <div className='mb-6'>
                  <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                    {programName}
                  </h2>
                  {programDescription && (
                    <div className='prose prose-gray max-w-none'>
                      <p className='text-gray-600 leading-relaxed'>
                        {programDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* Program Details Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                  {programConfig.duration && (
                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                      <Clock className='w-5 h-5 text-blue-600' />
                      <div>
                        <p className='text-sm text-gray-500'>
                          {locale === 'ar' ? 'المدة' : 'Duration'}
                        </p>
                        <p className='font-medium text-gray-900'>
                          {programConfig.duration}
                        </p>
                      </div>
                    </div>
                  )}

                  {programConfig.credits && (
                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                      <Award className='w-5 h-5 text-green-600' />
                      <div>
                        <p className='text-sm text-gray-500'>
                          {locale === 'ar' ? 'الساعات المعتمدة' : 'Credits'}
                        </p>
                        <p className='font-medium text-gray-900'>
                          {programConfig.credits}
                        </p>
                      </div>
                    </div>
                  )}

                  {programConfig.degree && (
                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                      <GraduationCap className='w-5 h-5 text-purple-600' />
                      <div>
                        <p className='text-sm text-gray-500'>
                          {locale === 'ar' ? 'الدرجة' : 'Degree'}
                        </p>
                        <p className='font-medium text-gray-900'>
                          {programConfig.degree}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                    <Building2 className='w-5 h-5 text-orange-600' />
                    <div>
                      <p className='text-sm text-gray-500'>
                        {locale === 'ar' ? 'الكلية' : 'College'}
                      </p>
                      <p className='font-medium text-gray-900'>{collegeName}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Resources */}
                {(programConfig.pdfs?.length ||
                  programConfig.videos?.length ||
                  programConfig.links?.length) && (
                  <div className='border-t pt-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      {locale === 'ar'
                        ? 'الموارد الإضافية'
                        : 'Additional Resources'}
                    </h3>
                    <div className='space-y-3'>
                      {programConfig.pdfs?.map((pdf, index) => (
                        <a
                          key={index}
                          href={pdf}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors'
                        >
                          <FileText className='w-5 h-5 text-red-600' />
                          <span className='text-gray-900'>
                            {locale === 'ar'
                              ? `المنهج الدراسي ${index + 1}`
                              : `Curriculum ${index + 1}`}
                          </span>
                          <ExternalLink className='w-4 h-4 text-gray-400 ml-auto' />
                        </a>
                      ))}

                      {programConfig.videos?.map((video, index) => (
                        <a
                          key={index}
                          href={video}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors'
                        >
                          <Play className='w-5 h-5 text-blue-600' />
                          <span className='text-gray-900'>
                            {locale === 'ar'
                              ? `فيديو ${index + 1}`
                              : `Video ${index + 1}`}
                          </span>
                          <ExternalLink className='w-4 h-4 text-gray-400 ml-auto' />
                        </a>
                      ))}

                      {programConfig.links?.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors'
                        >
                          <Globe className='w-5 h-5 text-green-600' />
                          <span className='text-gray-900'>{link.title}</span>
                          <ExternalLink className='w-4 h-4 text-gray-400 ml-auto' />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - University & College Info */}
          <div className='xl:col-span-4'>
            <div className='space-y-6'>
              {/* University Info */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                  <Globe className='w-5 h-5 text-blue-600' />
                  {locale === 'ar'
                    ? 'معلومات الجامعة'
                    : 'University Information'}
                </h3>
                {university ? (
                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-medium text-gray-900 mb-2'>
                        {university.name?.[locale] ||
                          university.name?.en ||
                          'University'}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        {locale === 'ar' ? 'جامعة حكومية' : 'Public University'}
                      </p>
                    </div>

                    {/* University Logo */}
                    {university.config?.logo && (
                      <div className='flex justify-center mb-4'>
                        <Image
                          src={university.config.logo}
                          alt={
                            university.name?.[locale] ||
                            university.name?.en ||
                            'University Logo'
                          }
                          width={80}
                          height={80}
                          className='object-contain'
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/80x80/6b7280/ffffff?text=Logo';
                          }}
                        />
                      </div>
                    )}

                    {/* Social Media Links */}
                    {university.config?.socialMedia &&
                      Object.keys(university.config.socialMedia).length > 0 && (
                        <div className='border-t pt-4'>
                          <h5 className='text-sm font-medium text-gray-700 mb-2'>
                            {locale === 'ar'
                              ? 'وسائل التواصل الاجتماعي'
                              : 'Social Media'}
                          </h5>
                          <div className='flex flex-wrap gap-2'>
                            {Object.entries(university.config.socialMedia).map(
                              ([platform, url]) => (
                                <a
                                  key={platform}
                                  href={url}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-blue-600 hover:text-blue-800 text-sm'
                                >
                                  {platform}
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <p className='text-gray-500 text-sm'>
                    {locale === 'ar'
                      ? 'معلومات الجامعة غير متاحة'
                      : 'University information not available'}
                  </p>
                )}
              </div>

              {/* College Info */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                  <Building2 className='w-5 h-5 text-green-600' />
                  {locale === 'ar' ? 'معلومات الكلية' : 'College Information'}
                </h3>
                {currentCollege ? (
                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-medium text-gray-900 mb-2'>
                        {collegeName}
                      </h4>
                      {currentCollege.description?.[locale] && (
                        <p className='text-sm text-gray-600'>
                          {currentCollege.description[locale]}
                        </p>
                      )}
                    </div>

                    {/* College Logo */}
                    {currentCollege.config?.logoUrl && (
                      <div className='flex justify-center mb-4'>
                        <Image
                          src={currentCollege.config.logoUrl}
                          alt={collegeName}
                          width={60}
                          height={60}
                          className='object-contain'
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/60x60/6b7280/ffffff?text=Logo';
                          }}
                        />
                      </div>
                    )}

                    {/* College Statistics */}
                    <div className='grid grid-cols-2 gap-3 text-sm'>
                      {currentCollege.studentsCount && (
                        <div className='text-center p-2 bg-gray-50 rounded'>
                          <div className='font-semibold text-gray-900'>
                            {currentCollege.studentsCount.toLocaleString()}
                          </div>
                          <div className='text-gray-500'>
                            {locale === 'ar' ? 'طالب' : 'Students'}
                          </div>
                        </div>
                      )}
                      {currentCollege.programsCount && (
                        <div className='text-center p-2 bg-gray-50 rounded'>
                          <div className='font-semibold text-gray-900'>
                            {currentCollege.programsCount}
                          </div>
                          <div className='text-gray-500'>
                            {locale === 'ar' ? 'برنامج' : 'Programs'}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Social Media Links */}
                    {currentCollege.config?.socialMedia &&
                      Object.keys(currentCollege.config.socialMedia).length >
                        0 && (
                        <div className='border-t pt-4'>
                          <h5 className='text-sm font-medium text-gray-700 mb-2'>
                            {locale === 'ar'
                              ? 'وسائل التواصل الاجتماعي'
                              : 'Social Media'}
                          </h5>
                          <div className='flex flex-wrap gap-2'>
                            {Object.entries(
                              currentCollege.config.socialMedia
                            ).map(
                              ([platform, url]) =>
                                url && (
                                  <a
                                    key={platform}
                                    href={url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-600 hover:text-blue-800 text-sm'
                                  >
                                    {platform}
                                  </a>
                                )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <p className='text-gray-500 text-sm'>
                    {locale === 'ar'
                      ? 'معلومات الكلية غير متاحة'
                      : 'College information not available'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgramPage() {
  return (
    <ProgramProvider>
      <ProgramDetailContent />
    </ProgramProvider>
  );
}

export default ProgramPage;
