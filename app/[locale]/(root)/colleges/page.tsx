'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCollege } from '@/contexts';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Building2, GraduationCap, ChevronRight, ChevronLeft } from 'lucide-react';
import { College } from '@/types/college';
import Image from 'next/image';
import { getCollegeName, getCollegeDescription, getCollegeImage } from '@/utils/multilingual';

function CollagesPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('colleges');
  const { colleges, loading, error } = useCollege();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name'>('name');

  // Filter and sort colleges
  const filteredAndSortedColleges = useMemo(() => {
    let filtered = [...colleges];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(college => {
        const name = (college.name as any)?.[locale] || (college.name as any)?.en || '';
        const description = (college.description as any)?.[locale] || (college.description as any)?.en || '';
        const query = searchQuery.toLowerCase();
        return name.toLowerCase().includes(query) || description.toLowerCase().includes(query);
      });
    }

    // Sort colleges by name
    filtered.sort((a, b) => {
      const nameA = (a.name as any)?.[locale] || (a.name as any)?.en || '';
      const nameB = (b.name as any)?.[locale] || (b.name as any)?.en || '';
      return nameA.localeCompare(nameB);
    });

    return filtered;
  }, [colleges, searchQuery, locale]);

  // Handle college card click
  const handleCollegeClick = (college: College) => {
    if (college.slug) {
      router.push(`/${locale}/colleges/${college.slug}`);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-[#023e8a] mx-auto mb-4'></div>
          <p className='text-gray-600 text-lg'>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50'>
        <div className='text-center'>
          <Building2 className='h-16 w-16 text-red-400 mx-auto mb-4' />
          <p className='text-red-600 text-lg mb-4'>{t('error')}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16'>
      <div className='container mx-auto px-4 max-w-7xl'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center mb-4'>
            <Building2 className='h-12 w-12 text-[#023e8a] mr-4' />
            <h1 className='text-4xl sm:text-5xl font-extrabold text-[#023e8a]'>
              {t('title')}
            </h1>
          </div>
          <p className='text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-2'>
            {t('subtitle')}
          </p>
          <div className='mt-4 flex items-center justify-center gap-2'>
            <GraduationCap className='h-5 w-5 text-[#023e8a]' />
            <span className='text-gray-600 font-medium'>
              {colleges.length} {t('colleges_count')}
            </span>
          </div>
        </div>

        {/* Search Section */}
        <div className='mb-12 max-w-2xl mx-auto'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
            <Input
              type='text'
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-12 h-14 border-2 text-black border-gray-200 focus:border-[#023e8a] rounded-xl text-lg shadow-sm'
            />
          </div>
        </div>

        {/* Colleges Grid */}
        {filteredAndSortedColleges.length === 0 ? (
          <div className='text-center py-20'>
            <Building2 className='h-20 w-20 text-gray-300 mx-auto mb-4' />
            <h3 className='text-2xl font-semibold text-gray-600 mb-2'>
              {t('no_colleges_found')}
            </h3>
            <p className='text-gray-500'>
              {t('no_colleges_description')}
            </p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredAndSortedColleges.map((college) => {
                const collegeName = getCollegeName(college, locale);
                const collegeDescription = getCollegeDescription(college, locale);
                const collegeImage = getCollegeImage(college);

                return (
                  <div
                    key={college.id}
                    onClick={() => handleCollegeClick(college)}
                    className='group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 flex flex-col h-full'
                  >
                    {/* Image */}
                    <div className='relative h-56 overflow-hidden flex-shrink-0'>
                      <Image
                        src={collegeImage}
                        alt={collegeName}
                        width={400}
                        height={300}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                    </div>

                    {/* Content */}
                    <div className='p-6 flex flex-col flex-grow'>
                      <h3 className='text-xl font-bold text-[#023e8a] mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-700 transition-colors'>
                        {collegeName}
                      </h3>

                      <p className='text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 min-h-[4.5rem] flex-grow'>
                        {collegeDescription || ''}
                      </p>

                      {/* View More Link */}
                      <div className='flex items-center text-[#023e8a] font-semibold text-sm group-hover:text-blue-700 transition-colors mt-auto'>
                        {locale === 'ar' ? (
                          <>
                            <span>عرض التفاصيل</span>
                            <ChevronLeft className='h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform' />
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <ChevronRight className='h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform' />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CollagesPage;
