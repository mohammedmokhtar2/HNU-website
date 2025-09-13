'use client';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Section, HeroContent } from '@/types/section';

interface HeroSectionProps {
  section: Section;
  locale: string;
}

export function HeroSection({ section, locale }: HeroSectionProps) {
  // Cast content to HeroContent type for type safety
  const content = section.content as HeroContent;
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const heroData = {
    title: {
      en: content.title?.en || 'Welcome',
      ar: content.title?.ar || 'مرحباً',
    },
    description: {
      en: content.content?.en || 'Welcome to our website',
      ar: content.content?.ar || 'مرحباً بكم في موقعنا',
    },
    imageUrl: content.imageUrl || '',
    videoUrl: content.videoUrl || '',
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  };

  const switchMediaType = (type: 'video' | 'image') => {
    if (isTransitioning || mediaType === type) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setMediaType(type);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  const canSwitchToVideo = heroData.videoUrl && heroData.imageUrl;
  const canSwitchToImage = heroData.videoUrl && heroData.imageUrl;
  const heroT = useTranslations('hero');

  return (
    <section
      id='home'
      className='relative w-full min-h-screen flex items-center justify-center overflow-hidden'
    >
      {/* Background Video/Image */}
      <div className='absolute inset-0 w-full h-full'>
        {heroData.videoUrl && mediaType === 'video' && (
          <video
            ref={videoRef}
            src={heroData.videoUrl}
            autoPlay
            loop
            muted={true}
            disablePictureInPicture
            className={`w-full h-full object-cover transition-all duration-500 ${
              isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
        )}
        {heroData.imageUrl && mediaType === 'image' && (
          <Image
            src={heroData.imageUrl}
            alt='Hero background'
            fill
            className={`object-cover transition-all duration-500 ${
              isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            priority
          />
        )}
      </div>

      {/* Media Type Controls */}
      {canSwitchToVideo && canSwitchToImage && (
        <div className='absolute top-25 right-6 z-20 flex flex-col gap-3'>
          {/* Video Button */}
          <button
            onClick={() => switchMediaType('video')}
            disabled={isTransitioning}
            className={`relative p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group ${
              mediaType === 'video' ? 'bg-white/40 ring-2 ring-white/50' : ''
            } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            aria-label='Switch to video'
          >
            <svg
              className='w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M8 5v14l11-7z' />
            </svg>
            {/* Active indicator */}
            {mediaType === 'video' && (
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
            )}
          </button>

          {/* Image Button */}
          <button
            onClick={() => switchMediaType('image')}
            disabled={isTransitioning}
            className={`relative p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group ${
              mediaType === 'image' ? 'bg-white/40 ring-2 ring-white/50' : ''
            } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            aria-label='Switch to image'
          >
            <svg
              className='w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
            </svg>
            {/* Active indicator */}
            {mediaType === 'image' && (
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse'></div>
            )}
          </button>
        </div>
      )}

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/30' />

      {/* Content Container */}
      <div
        className={`relative top-60 z-10 w-full h-full flex items-end px-4 sm:px-6 lg:px-8 justify-start`}
      >
        <div
          className={`max-w-2xl ${locale === 'ar' ? 'text-right' : 'text-left'}`}
        >
          {/* Main Title */}
          <h1
            className={`text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up ${locale === 'ar' ? 'text-right' : 'text-left'}`}
          >
            {heroData.title[locale as keyof typeof heroData.title] ||
              heroData.title.en}
          </h1>

          {/* Description */}
          <p
            className={`text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in-up animation-delay-200 ${locale === 'ar' ? 'text-right' : 'text-left'}`}
          >
            {heroData.description[
              locale as keyof typeof heroData.description
            ] || heroData.description.en}
          </p>

          {/* Call to Action Buttons */}
          <div
            className={`flex flex-col ${locale === 'ar' ? 'justify-end' : 'justify-start'} sm:flex-row gap-4 animate-fade-in-up animation-delay-400 ${locale === 'ar' ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}
          >
            <button
              onClick={() => scrollToSection('programs')}
              className='px-8 py-4 bg-white text-[#023e8a] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              {heroT('discover_all_programs')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className='px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#023e8a] transition-all duration-300 transform hover:scale-105'
            >
              {heroT('learn_more')}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className='absolute top-20 left-10 w-20 h-20 border border-white/20 rounded-full animate-ping'></div>
      <div className='absolute bottom-20 right-10 w-16 h-16 border border-white/20 rounded-full animate-pulse'></div>
    </section>
  );
}
