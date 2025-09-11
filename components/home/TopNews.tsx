'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft } from 'lucide-react';
// import ExpandableContentCard from './ExpandableContentCard';
// import CoursesMarquee from '@/components/home/slider';


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
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = items[featuredIndex];
  const others = items.filter((_, idx) => idx !== featuredIndex).slice(0, 3);

  return (
    <section className="relative py-20">
      {/* Decorative background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl z-0" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#023e8a] drop-shadow-lg tracking-tight mb-2">
            {local === 'ar' ? title.ar : title.en}
          </h2>
          <p className="text-lg sm:text-2xl text-gray-700 max-w-2xl mx-auto font-medium">
            {local === 'ar' ? subtitle.ar : subtitle.en}
          </p>
        </div>

        {/* Split layout: featured left, others right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          {/* Featured News Card */}
          <div className="md:col-span-2 flex flex-col justify-between bg-white/80 rounded-3xl shadow-2xl border border-blue-100 p-8 relative overflow-hidden group backdrop-blur-xl">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
              <Image
                src={featured.image}
                alt={local === 'ar' ? featured.title.ar : featured.title.en}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-4 py-1 rounded-full font-semibold shadow">
                {local === 'ar' ? featured.category.ar : featured.category.en}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#023e8a] mb-2 line-clamp-2">
              {local === 'ar' ? featured.title.ar : featured.title.en}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3 text-base md:text-lg">
              {local === 'ar' ? featured.description.ar : featured.description.en}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{local === 'ar' ? featured.author.ar : featured.author.en}</span>
              <span>•</span>
              <span>{local === 'ar' ? featured.date.ar : featured.date.en}</span>
              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {local === 'ar' ? featured.readTime.ar : featured.readTime.en}
              </span>
            </div>
          </div>

          {/* Other News Cards */}
          <div className="flex flex-col gap-6 relative">
            {others.map((item) => {
              // Always show the arrow for the card that matches featuredIndex
              const itemIndex = items.indexOf(item);
              const isActive = itemIndex === featuredIndex;
              return (
                <div key={item.id} className="relative flex items-center">
                  {/* Arrow indicator: only show if this card is the featured one */}
                  {isActive && (
                    <span className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 flex items-center">
                      <ChevronLeft className="w-8 h-8 text-blue-500 drop-shadow-lg animate-bounce" />
                    </span>
                  )}
                  <button
                    className={`flex flex-row items-center bg-white/80 rounded-2xl shadow-lg border border-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group backdrop-blur-xl focus:outline-none ${isActive ? 'ring-2 ring-blue-400' : ''} w-full`}
                    onClick={() => setFeaturedIndex(itemIndex)}
                    tabIndex={0}
                    aria-label={local === 'ar' ? item.title.ar : item.title.en}
                  >
                    <div className="h-24 w-24 min-w-[6rem] rounded-xl overflow-hidden m-3">
                      <Image
                        src={item.image}
                        alt={local === 'ar' ? item.title.ar : item.title.en}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 rounded-xl"
                        width={96}
                        height={96}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={false}
                      />
                    </div>
                    <div
                      className={`flex-1 p-2 ${local === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={local === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <h4 className="text-lg font-semibold text-[#023e8a] mb-1 line-clamp-2">
                        {local === 'ar' ? item.title.ar : item.title.en}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{local === 'ar' ? item.date.ar : item.date.en}</span>
                        <span>•</span>
                        <span>{local === 'ar' ? item.readTime.ar : item.readTime.en}</span>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All News CTA */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-2 px-12 py-5 bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold rounded-2xl shadow-xl hover:from-blue-800 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 text-lg">
            {local === 'ar' ? (
              <>
                {'عرض جميع الأخبار'}
                <ChevronLeft className="w-6 h-6" />
              </>
            ) : (
              <>
                {'View All News'}
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default TopNews;
