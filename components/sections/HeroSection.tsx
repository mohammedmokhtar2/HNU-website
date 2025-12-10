'use client';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Section, HeroContent } from '@/types/section';
import {
  useBlog,
  getBlogTitle,
  getBlogExcerpt,
} from '@/hooks/use-blogs-events';

interface HeroSectionProps {
  section: Section;
  locale: string;
}

export function HeroSection({ section, locale }: HeroSectionProps) {
  const router = useRouter();
  // Cast content to HeroContent type for type safety
  const content = section.content as HeroContent;

  // Determine if we're showing a linked blog or event
  const displayType = content.displayType || 'default';
  const linkedId =
    displayType === 'blog'
      ? content.linkedBlogId
      : displayType === 'event'
        ? content.linkedEventId
        : undefined;

  // Fetch linked blog/event if needed
  const { data: linkedItem } = useBlog(linkedId);

  // Determine initial media type based on availability
  const hasVideo = !!content.videoUrl;
  const hasImage = !!content.imageUrl || !!linkedItem?.image?.[0];
  const initialMediaType = hasVideo ? 'video' : hasImage ? 'image' : 'video';

  const [mediaType, setMediaType] = useState<'video' | 'image'>(
    initialMediaType
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Prepare hero data based on media type and whether blog/event is linked
  let heroData: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    imageUrl: string;
    videoUrl: string;
  };

  // For IMAGE mode: show blog/event data if linked, otherwise show static content
  // For VIDEO mode: always show static content
  if (mediaType === 'image' && linkedItem && (displayType === 'blog' || displayType === 'event')) {
    // Use blog/event content for image mode
    heroData = {
      title: {
        en: getBlogTitle(linkedItem, 'en'),
        ar: getBlogTitle(linkedItem, 'ar'),
      },
      description: {
        en: getBlogExcerpt(linkedItem, 'en'),
        ar: getBlogExcerpt(linkedItem, 'ar'),
      },
      imageUrl: linkedItem.image?.[0] || content.imageUrl || '',
      videoUrl: content.videoUrl || '',
    };
  } else {
    // Use static content for video mode or when no blog/event is linked
    heroData = {
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
  }

  // Determine button configuration
  let buttonText: { en: string; ar: string } | undefined;
  let buttonUrl: string | undefined;

  if (displayType === 'blog' || displayType === 'event') {
    // If a blog/event is linked, prepare the button to navigate to it
    if (linkedItem) {
      const itemType = displayType === 'blog' ? 'blog' : 'event';
      buttonText = content.buttonConfig?.text || {
        en: `View ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`,
        ar: displayType === 'blog' ? 'عرض المدونة' : 'عرض الحدث',
      };
      buttonUrl =
        content.buttonConfig?.url ||
        `/${locale}/blogs/${linkedItem.slug || linkedItem.id}`;
    }
  }

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

  const canSwitchToVideo = hasVideo && hasImage;
  const canSwitchToImage = hasVideo && hasImage;
  const heroT = useTranslations('hero');

  return (
    <section
      id='home'
      className='relative w-full min-h-screen flex items-center justify-center overflow-hidden'
    >
      {/* Background Video/Image */}
      <div
        className={`absolute inset-0 w-full h-full ${buttonUrl ? 'cursor-pointer group' : ''}`}
        onClick={() => {
          if (buttonUrl) {
            router.push(buttonUrl);
          }
        }}
      >
        {hasVideo && mediaType === 'video' && (
          <video
            ref={videoRef}
            src={heroData.videoUrl}
            autoPlay={true}
            loop={true}
            muted={true}
            disablePictureInPicture
            className={`w-full h-full object-cover transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              } ${buttonUrl ? 'group-hover:scale-105' : ''}`}
          />
        )}
        {hasImage && mediaType === 'image' && (
          <Image
            src={heroData.imageUrl}
            alt='Hero background'
            fill
            className={`object-cover transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              } ${buttonUrl ? 'group-hover:scale-105' : ''}`}
            priority
          />
        )}
        {/* Click indicator overlay when linked to blog/event */}
        {buttonUrl && (
          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center'>
            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-4'>
              <svg
                className='w-12 h-12 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Media Type Controls */}
      {canSwitchToVideo && canSwitchToImage && (
        <div className='absolute top-25 right-6 z-20 flex flex-col gap-3'>
          {/* Video Button */}
          <button
            onClick={() => switchMediaType('video')}
            disabled={isTransitioning}
            className={`relative p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group ${mediaType === 'video' ? 'bg-white/40 ring-2 ring-white/50' : ''
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
            className={`relative p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group ${mediaType === 'image' ? 'bg-white/40 ring-2 ring-white/50' : ''
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
        className={`relative top-40 z-10 w-full h-full flex items-end px-4 sm:px-6 lg:px-8 justify-start`}
      >
        <div
          className={`max-w-3xl ${locale === 'ar' ? 'text-right' : 'text-left'}`}
        >
          {/* Main Title with Enhanced Styling */}
          <h1
            className={`text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight animate-fade-in-up drop-shadow-2xl ${locale === 'ar' ? 'text-right' : 'text-left'}`}
          >
            <span className='relative inline-block'>
              <span className='relative z-10 bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text'>
                {heroData.title[locale as keyof typeof heroData.title] ||
                  heroData.title.en}
              </span>
            </span>
          </h1>

          {/* Description with Glass Morphism Effect */}
          <div
            className={`mb-8 animate-fade-in-up animation-delay-200 ${locale === 'ar' ? 'text-right' : 'text-left'}`}
          >
            <p
              className='text-lg sm:text-xl lg:text-2xl text-white font-bold leading-relaxed drop-shadow-lg'
            >
              {heroData.description[
                locale as keyof typeof heroData.description
              ] || heroData.description.en}
            </p>
          </div>

          {/* Call to Action Buttons with Modern Design */}
          <div
            className={`flex flex-col ${locale === 'ar' ? 'justify-end' : 'justify-start'} sm:flex-row gap-4 mb-20 animate-fade-in-up animation-delay-400 ${locale === 'ar' ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}
          >
            {/* Show blog/event button ONLY in Image mode when linked */}
            {buttonUrl && buttonText && mediaType === 'image' && (
              <button
                onClick={() => {
                  router.push(buttonUrl);
                }}
                className='group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-lg'
              >
                <span className='absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></span>
                <span className='absolute inset-0 w-full h-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                <span className='relative z-10 flex items-center justify-center gap-2'>
                  {buttonText[locale as keyof typeof buttonText] ||
                    buttonText.en}
                  <svg className='w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </span>
              </button>
            )}
            {/* Always show default buttons */}
            <button
              onClick={() => {
                console.log('Navigating to:', `/${locale}/colleges`);
                router.push(`/${locale}/colleges`);
              }}
              className='group relative px-8 py-4 bg-white text-[#023e8a] font-bold rounded-xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-lg'
            >
              <span className='absolute inset-0 w-full h-full bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
              <span className='relative z-10 flex items-center justify-center gap-2'>
                {heroT('discover_all_programs')}
                <svg className='w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </span>
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className='group relative px-8 py-4 border-2 border-white text-white font-bold rounded-xl backdrop-blur-sm bg-white/10 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl'
            >
              <span className='absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
              <span className='relative z-10 flex items-center justify-center gap-2 group-hover:text-[#023e8a] transition-colors duration-300'>
                {heroT('learn_more')}
                <svg className='w-5 h-5 transform group-hover:translate-y-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Enhanced */}
      <div className='absolute top-20 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-ping'></div>
      <div className='absolute top-40 left-32 w-12 h-12 border border-blue-300/40 rounded-full animate-pulse'></div>
      <div className='absolute bottom-20 right-10 w-16 h-16 border-2 border-white/30 rounded-full animate-pulse'></div>
      <div className='absolute bottom-40 right-32 w-10 h-10 border border-cyan-300/40 rounded-full animate-ping' style={{ animationDelay: '1s' }}></div>

      {/* Floating particles */}
      <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-white/50 rounded-full animate-bounce' style={{ animationDelay: '0.5s' }}></div>
      <div className='absolute top-1/3 right-1/4 w-3 h-3 bg-blue-300/40 rounded-full animate-bounce' style={{ animationDelay: '1.5s' }}></div>
      <div className='absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-300/50 rounded-full animate-bounce' style={{ animationDelay: '2s' }}></div>
    </section>
  );
}
