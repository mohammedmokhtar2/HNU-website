'use client';

import React from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';
import ExpandableContentCard from './ExpandableContentCard';

export interface TopNewsItem {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  image: string;
  date: {
    ar: string;
    en: string;
  };
  author: {
    ar: string;
    en: string;
  };
  category: {
    ar: string;
    en: string;
  };
  featured: boolean;
  readTime: {
    ar: string;
    en: string;
  };
}

export interface TopNewsProps {
  title: {
    ar: string;
    en: string;
  };
  subtitle: {
    ar: string;
    en: string;
  };

  items: TopNewsItem[];
  local: string;
}

function TopNews({ title, subtitle, items, local }: TopNewsProps) {
  return (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center mb-4 gap-4'>
            <Newspaper className='w-8 h-8 text-[#023e8a] mr-3 animate-pulse' />
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900'>
              {local === 'ar' ? title.ar : title.en}
            </h2>
          </div>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            {local === 'ar' ? subtitle.ar : subtitle.en}
          </p>
        </div>

        {/* News Expandable Cards */}
        <ExpandableContentCard
          items={items.map(item => ({
            id: item.id,
            title: local === 'ar' ? item.title.ar : item.title.en,
            description:
              local === 'ar' ? item.description.ar : item.description.en,
            image: item.image,
            date: local === 'ar' ? item.date.ar : item.date.en,
            author: local === 'ar' ? item.author.ar : item.author.en,
            category: local === 'ar' ? item.category.ar : item.category.en,
            featured: item.featured,
            readTime: local === 'ar' ? item.readTime.ar : item.readTime.en,
          }))}
          type='news'
          className='space-y-4'
        />

        {/* View All News CTA */}
        <div className='text-center mt-12'>
          <button className='inline-flex items-center gap-2 px-8 py-4 bg-[#023e8a] text-white font-semibold rounded-lg hover:bg-[#023e8a]/90 transition-all duration-300 transform hover:scale-105 shadow-lg'>
            <ArrowRight className='w-5 h-5' />
            {local === 'ar' ? 'عرض جميع الأخبار' : 'View All News'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default TopNews;
