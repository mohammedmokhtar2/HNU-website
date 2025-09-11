'use client';

import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Globe } from 'lucide-react';
import Reveal from '@/components/Reveal';
export interface StatItem {
  id: number;
  icon: any;
  number: {
    ar: string;
    en: string;
  };
  label: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  state: number;
  color: string;
}

export interface FcatsAndNumberProps {
  items: StatItem[];
  local: string;
}

const getIcon = (icon: any) => {
  switch (icon) {
    case 'Users':
      return <Users className='w-8 h-8' />;
    case 'GraduationCap':
      return <GraduationCap className='w-8 h-8' />;
    case 'Globe':
      return <Globe className='w-8 h-8' />;
  }
};

function FcatsAndNumber({
  items,
  local,
  title,
  subtitle,
  description,
}: FcatsAndNumberProps & {
  title: { ar: string; en: string };
  subtitle?: { ar: string; en: string };
  description?: { ar: string; en: string };
}) {
  const [counts, setCounts] = useState<{ [key: number]: number }>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('facts-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;

    items.forEach(stat => {
      const increment = stat.state / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.state) {
          current = stat.state;
          clearInterval(timer);
        }
        setCounts(prev => ({
          ...prev,
          [stat.id]: Math.floor(current),
        }));
      }, interval);
    });
  }, [isVisible, items]);

  return (
    <section id='facts-section' className='py-16'>
      <div className='container mx-auto px-4 relative'>
        {/* Header Section */}
        <div className='max-w-3xl mx-auto text-center mb-16 relative z-10'>
          <Reveal from='up'>
            <div className='flex items-start justify-center mb-4 gap-4'>
              <span className='relative'>
                <span className='absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75'></span>
              </span>
              <h2 className='text-4xl sm:text-5xl font-extrabold text-[#023e8a] drop-shadow-lg tracking-tight mb-2'>
                {local === 'ar' ? title.ar : title.en}
              </h2>
            </div>
          </Reveal>
          {subtitle && (
            <p className='text-lg sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-4 font-medium'>
              {local === 'ar' ? subtitle.ar : subtitle.en}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {items.map(stat => (
            <div
              key={stat.id}
              className='group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100'
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
              />
              <div className='flex flex-col items-center justify-center'>
                {/* Icon */}
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 animate-pulse`}
                >
                  {getIcon(stat.icon as any)}
                </div>

                {/* Number */}
                <div className='mb-4'>
                  <span className='text-4xl md:text-5xl font-bold text-gray-900'>
                    {local === 'ar'
                      ? stat.number.ar
                      : stat.id === 6
                        ? (counts[stat.id] || 0).toFixed(1)
                        : counts[stat.id] || 0}
                  </span>
                  {stat.id === 6 && (
                    <span className='text-2xl text-gray-600'>/5</span>
                  )}
                  {stat.id === 4 && (
                    <span className='text-2xl text-gray-600'>%</span>
                  )}
                  {stat.id === 5 && (
                    <span className='text-2xl text-gray-600'>+</span>
                  )}
                </div>

                {/* Label */}
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {local === 'ar' ? stat.label.ar : stat.label.en}
                </h3>

                {/* Description */}
                <p className='text-gray-600 leading-relaxed'>
                  {local === 'ar' ? stat.description.ar : stat.description.en}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FcatsAndNumber;
