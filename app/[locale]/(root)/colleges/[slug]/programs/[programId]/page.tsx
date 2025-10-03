'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ProgramService } from '@/services/program.service';
import { BlogService } from '@/services/blog.service';
import { Program } from '@/types/program';
import { BlogWithRelations } from '@/types/blog';
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
  const [relatedBlogs, setRelatedBlogs] = useState<BlogWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const universityContext = useUniversity();
  const collegeContext = useCollege();

  // Get university and college data
  const university = universityContext?.university || null;
  const colleges = collegeContext?.colleges || [];

  // Debug logging
  console.log('University Context:', universityContext);
  console.log('College Context:', collegeContext);
  console.log('Program Data:', program);
  console.log('Colleges Array:', colleges);

  // Find the current college - prefer the one from program data, fallback to slug search
  const currentCollege =
    program?.collage || colleges.find(college => college.slug === slug);

  console.log('Current College:', currentCollege);

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the specific program
        const programData = await ProgramService.getProgramById(programId);
        setProgram(programData);

        // Fetch related programs and blogs from the same college
        if (programData.collageId) {
          const [relatedProgramsData, relatedBlogsData] = await Promise.all([
            ProgramService.getProgramsByCollege(programData.collageId, {
              limit: 6,
              orderBy: 'createdAt',
              orderDirection: 'desc',
            }),
            BlogService.getBlogsByCollege(programData.collageId, {
              limit: 6,
              orderBy: 'createdAt',
              orderDirection: 'desc',
              isPublished: true,
            }),
          ]);
          setRelatedPrograms(
            relatedProgramsData.data.filter(p => p.id !== programId)
          );
          setRelatedBlogs(relatedBlogsData.data || []);
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

  // Get college name from multiple sources
  const collegeName =
    (program.collage?.name as any)?.[locale] ||
    (program.collage?.name as any)?.en ||
    (currentCollege?.name as any)?.[locale] ||
    (currentCollege?.name as any)?.en ||
    '';

  // Helper functions for blog data
  const getBlogTitle = (blog: BlogWithRelations): string => {
    if (typeof blog.title === 'object' && blog.title !== null) {
      return (
        (blog.title as any)[locale] || (blog.title as any).en || 'Untitled'
      );
    }
    return 'Untitled';
  };

  const getBlogImage = (blog: BlogWithRelations) => {
    return blog.image && blog.image.length > 0 ? blog.image[0] : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === 'ar' ? 'ar-EG' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
  };

  return (
    <div className='min-h-screen sm:h-screen bg-gray-50 flex flex-col'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b flex-shrink-0'>
        <div className='w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
            <div className='flex items-center gap-2 sm:gap-4'>
              <Link
                href={`/colleges/${slug}`}
                className='flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base'
              >
                <ArrowLeft className='w-4 h-4' />
                <span className='hidden sm:inline'>
                  {locale === 'ar' ? 'العودة' : 'Back'}
                </span>
              </Link>
              <div className='h-4 sm:h-6 w-px bg-gray-300'></div>
              <div className='flex-1 min-w-0'>
                <h1 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate'>
                  {programName}
                </h1>
                <p className='text-sm sm:text-base text-gray-600 truncate'>
                  {collegeName}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium'>
                {programConfig.degree || 'Program'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 h-full sm:h-full'>
          {/* Left Column - Related Programs */}
          <div className='lg:col-span-3 h-auto sm:h-full overflow-y-auto order-2 lg:order-1'>
            <div className='space-y-4 sm:space-y-6'>
              <div className='bg-white rounded-lg shadow-md p-4 sm:p-6'>
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

                {/* Related Blogs */}
                {relatedBlogs.length > 0 && (
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                      <BookOpen className='w-5 h-5 text-green-600' />
                      {locale === 'ar' ? 'مقالات ذات صلة' : 'Related Articles'}
                    </h3>
                    <div className='space-y-4'>
                      {relatedBlogs.map(relatedBlog => {
                        const relatedTitle = getBlogTitle(relatedBlog);
                        const relatedImage = getBlogImage(relatedBlog);
                        return (
                          <Link
                            key={relatedBlog.id}
                            href={`/blogs/${relatedBlog.slug}`}
                            className='block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200'
                          >
                            {relatedImage && (
                              <div className='relative h-24 w-full mb-3 rounded overflow-hidden'>
                                <Image
                                  src={relatedImage}
                                  alt={relatedTitle}
                                  fill
                                  className='object-cover'
                                  onError={e => {
                                    (e.target as HTMLImageElement).src =
                                      'https://placehold.co/300x120/6b7280/ffffff?text=No+Image';
                                  }}
                                />
                              </div>
                            )}
                            <h4 className='font-medium text-gray-900 mb-2 line-clamp-2 text-sm'>
                              {relatedTitle}
                            </h4>
                            <div className='flex items-center gap-2 text-xs text-gray-500'>
                              <Calendar className='w-3 h-3' />
                              <span>
                                {formatDate(relatedBlog.createdAt.toString())}
                              </span>
                            </div>
                            {relatedBlog.isFeatured && (
                              <div className='mt-2'>
                                <span className='inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs'>
                                  <Star className='w-3 h-3' />
                                  {locale === 'ar' ? 'مميز' : 'Featured'}
                                </span>
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Column - Program Details */}
          <div className='lg:col-span-6 h-auto sm:h-full overflow-y-auto order-1 lg:order-2'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              {/* Program Image */}
              {programConfig.images?.[0] && (
                <div className='relative h-48 sm:h-56 lg:h-64 w-full'>
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
              <div className='p-4 sm:p-6 lg:p-8'>
                <div className='mb-4 sm:mb-6'>
                  <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4'>
                    {programName}
                  </h2>
                  {programDescription && (
                    <div className='prose prose-sm sm:prose-base lg:prose-lg prose-gray max-w-none'>
                      <p className='text-gray-600 leading-relaxed'>
                        {programDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* Program Details Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8'>
                  {programConfig.duration && (
                    <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg'>
                      <Clock className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
                      <div>
                        <p className='text-xs sm:text-sm text-gray-500'>
                          {locale === 'ar' ? 'المدة' : 'Duration'}
                        </p>
                        <p className='font-medium text-gray-900 text-sm sm:text-base'>
                          {programConfig.duration}
                        </p>
                      </div>
                    </div>
                  )}

                  {programConfig.credits && (
                    <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg'>
                      <Award className='w-4 h-4 sm:w-5 sm:h-5 text-green-600' />
                      <div>
                        <p className='text-xs sm:text-sm text-gray-500'>
                          {locale === 'ar' ? 'الساعات المعتمدة' : 'Credits'}
                        </p>
                        <p className='font-medium text-gray-900 text-sm sm:text-base'>
                          {programConfig.credits}
                        </p>
                      </div>
                    </div>
                  )}

                  {programConfig.degree && (
                    <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg'>
                      <GraduationCap className='w-4 h-4 sm:w-5 sm:h-5 text-purple-600' />
                      <div>
                        <p className='text-xs sm:text-sm text-gray-500'>
                          {locale === 'ar' ? 'الدرجة' : 'Degree'}
                        </p>
                        <p className='font-medium text-gray-900 text-sm sm:text-base'>
                          {programConfig.degree}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg'>
                    <Building2 className='w-4 h-4 sm:w-5 sm:h-5 text-orange-600' />
                    <div>
                      <p className='text-xs sm:text-sm text-gray-500'>
                        {locale === 'ar' ? 'الكلية' : 'College'}
                      </p>
                      <p className='font-medium text-gray-900 text-sm sm:text-base'>
                        {collegeName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Resources */}
                {(programConfig.pdfs?.length ||
                  programConfig.videos?.length ||
                  programConfig.links?.length) && (
                  <div className='border-t pt-4 sm:pt-6'>
                    <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4'>
                      {locale === 'ar'
                        ? 'الموارد الإضافية'
                        : 'Additional Resources'}
                    </h3>
                    <div className='space-y-2 sm:space-y-3'>
                      {programConfig.pdfs?.map((pdf, index) => (
                        <a
                          key={index}
                          href={pdf}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors'
                        >
                          <FileText className='w-4 h-4 sm:w-5 sm:h-5 text-red-600' />
                          <span className='text-gray-900 text-sm sm:text-base'>
                            {locale === 'ar'
                              ? `المنهج الدراسي ${index + 1}`
                              : `Curriculum ${index + 1}`}
                          </span>
                          <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-auto' />
                        </a>
                      ))}

                      {programConfig.videos?.map((video, index) => (
                        <a
                          key={index}
                          href={video}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors'
                        >
                          <Play className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
                          <span className='text-gray-900 text-sm sm:text-base'>
                            {locale === 'ar'
                              ? `فيديو ${index + 1}`
                              : `Video ${index + 1}`}
                          </span>
                          <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-auto' />
                        </a>
                      ))}

                      {programConfig.links?.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors'
                        >
                          <Globe className='w-4 h-4 sm:w-5 sm:h-5 text-green-600' />
                          <span className='text-gray-900 text-sm sm:text-base'>
                            {link.title}
                          </span>
                          <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-auto' />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - University & College Info */}
          <div className='lg:col-span-3 h-auto sm:h-full overflow-y-auto order-3'>
            <div className='space-y-4 sm:space-y-6'>
              {/* University Info */}
              <div className='bg-white rounded-lg shadow-md p-4 sm:p-6'>
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
                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-medium text-gray-900 mb-2'>
                        {locale === 'ar' ? 'جامعة حلوان' : 'Helwan University'}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        {locale === 'ar' ? 'جامعة حكومية' : 'Public University'}
                      </p>
                    </div>

                    {/* Default University Logo */}
                    <div className='flex justify-center mb-4'>
                      <Image
                        src='/helwanWhite.png'
                        alt={
                          locale === 'ar' ? 'جامعة حلوان' : 'Helwan University'
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

                    <div className='border-t pt-4'>
                      <h5 className='text-sm font-medium text-gray-700 mb-2'>
                        {locale === 'ar'
                          ? 'معلومات عامة'
                          : 'General Information'}
                      </h5>
                      <p className='text-sm text-gray-600'>
                        {locale === 'ar'
                          ? 'جامعة حلوان هي إحدى الجامعات الحكومية المصرية الرائدة في التعليم العالي والبحث العلمي.'
                          : "Helwan University is one of Egypt's leading public universities in higher education and scientific research."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* College Info */}
              <div className='bg-white rounded-lg shadow-md p-4 sm:p-6'>
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
                      {(currentCollege.description as any)?.[locale] && (
                        <p className='text-sm text-gray-600'>
                          {(currentCollege.description as any)[locale]}
                        </p>
                      )}
                    </div>

                    {/* College Logo */}
                    {(currentCollege.config as any)?.logoUrl && (
                      <div className='flex justify-center mb-4'>
                        <Image
                          src={(currentCollege.config as any).logoUrl}
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
                    {(currentCollege.config as any)?.socialMedia &&
                      Object.keys((currentCollege.config as any).socialMedia)
                        .length > 0 && (
                        <div className='border-t pt-4'>
                          <h5 className='text-sm font-medium text-gray-700 mb-2'>
                            {locale === 'ar'
                              ? 'وسائل التواصل الاجتماعي'
                              : 'Social Media'}
                          </h5>
                          <div className='flex flex-wrap gap-2'>
                            {Object.entries(
                              (currentCollege.config as any).socialMedia
                            ).map(([platform, url]) =>
                              url ? (
                                <a
                                  key={platform}
                                  href={url as string}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-blue-600 hover:text-blue-800 text-sm'
                                >
                                  {platform}
                                </a>
                              ) : null
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-medium text-gray-900 mb-2'>
                        {collegeName ||
                          (locale === 'ar' ? 'الكلية' : 'College')}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        {locale === 'ar' ? 'كلية أكاديمية' : 'Academic College'}
                      </p>
                    </div>

                    {/* Default College Logo */}
                    <div className='flex justify-center mb-4'>
                      <Image
                        src='/helwanBlack.png'
                        alt={
                          collegeName ||
                          (locale === 'ar' ? 'الكلية' : 'College')
                        }
                        width={60}
                        height={60}
                        className='object-contain'
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/60x60/6b7280/ffffff?text=Logo';
                        }}
                      />
                    </div>

                    <div className='border-t pt-4'>
                      <h5 className='text-sm font-medium text-gray-700 mb-2'>
                        {locale === 'ar'
                          ? 'معلومات عامة'
                          : 'General Information'}
                      </h5>
                      <p className='text-sm text-gray-600'>
                        {locale === 'ar'
                          ? 'كلية أكاديمية تقدم برامج تعليمية متخصصة في مختلف المجالات العلمية والأدبية.'
                          : 'An academic college offering specialized educational programs in various scientific and literary fields.'}
                      </p>
                    </div>
                  </div>
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
