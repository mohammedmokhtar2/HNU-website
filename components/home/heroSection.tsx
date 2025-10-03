'use client';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
// import { socialMediaLinks } from '@/data';
// import { Facebook, Linkedin, Instagram, Twitter, Youtube } from 'lucide-react';
// import { FaTelegram, FaTiktok } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export interface HeroSectionProps {
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  video: string;
  image?: string;
  local: string;
}

const HeroSection = ({
  title,
  description,
  video,
  image,
  local,
}: HeroSectionProps) => {
  const router = useRouter();
  // const [isMuted, setIsMuted] = useState(true);
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // const { facebook, linkedin, instagram, twitter, youtube, tiktok, telegram } =
  // socialMediaLinks;

  // const socialLinks = [
  //   {
  //     name: 'Facebook',
  //     url: facebook,
  //     icon: Facebook,
  //     color: 'hover:bg-blue-600',
  //   },
  //   {
  //     name: 'LinkedIn',
  //     url: linkedin,
  //     icon: Linkedin,
  //     color: 'hover:bg-blue-700',
  //   },
  //   {
  //     name: 'Instagram',
  //     url: instagram,
  //     icon: Instagram,
  //     color: 'hover:bg-pink-600',
  //   },
  //   {
  //     name: 'Twitter',
  //     url: twitter,
  //     icon: Twitter,
  //     color: 'hover:bg-blue-400',
  //   },
  //   { name: 'YouTube', url: youtube, icon: Youtube, color: 'hover:bg-red-600' },
  //   { name: 'TikTok', url: tiktok, icon: FaTiktok, color: 'hover:bg-black' },
  //   {
  //     name: 'Telegram',
  //     url: telegram,
  //     icon: FaTelegram,
  //     color: 'hover:bg-blue-500',
  //   },
  // ].filter(link => link.url);

  // const toggleMute = () => {
  //   if (videoRef.current) {
  //     videoRef.current.muted = !isMuted;
  //     setIsMuted(!isMuted);
  //   }
  // };

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

  const canSwitchToVideo = video && image;
  const canSwitchToImage = video && image;
  const heroT = useTranslations('hero');

  return (
    <section
      id='home'
      className='relative w-full min-h-screen flex items-center justify-center overflow-hidden'
    >
      {/* Background Video/Image */}
      <div className='absolute inset-0 w-full h-full'>
        {video && mediaType === 'video' && (
          <video
            ref={videoRef}
            src={video}
            autoPlay
            loop
            muted={true}
            disablePictureInPicture
            className={`w-full h-full object-cover transition-all duration-500 ${
              isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
        )}
        {image && mediaType === 'image' && (
          <Image
            src={image}
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

      {/* Mute/Unmute Button - Only show when video is active */}
      {/* {video && mediaType === 'video' && (
        <button
          onClick={toggleMute}
          className='absolute top-6 right-6 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group'
          style={{ marginTop: canSwitchToVideo && canSwitchToImage ? '200px' : '0' }}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <svg
              className='w-6 h-6 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M16.5 12c0-1.77-1.02-3.31-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z' />
            </svg>
          ) : (
            <svg
              className='w-6 h-6 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.31-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
            </svg>
          )}
        </button>
      )} */}

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/30' />

      {/* Content Container */}
      <div
        className={`relative top-60 z-10 w-full h-full flex items-end px-4 sm:px-6 lg:px-8 justify-start`}
      >
        <div
          className={`max-w-2xl ${local === 'ar' ? 'text-right' : 'text-left'}`}
        >
          {/* Main Title */}
          <h1
            className={`text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up ${local === 'ar' ? 'text-right' : 'text-left'}`}
          >
            {local === 'ar' ? title.ar : title.en}
          </h1>

          {/* Description */}
          <p
            className={`text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in-up animation-delay-200 ${local === 'ar' ? 'text-right' : 'text-left'}`}
          >
            {local === 'ar' ? description.ar : description.en}
          </p>

          {/* Call to Action Buttons */}
          <div
            className={`flex flex-col ${local === 'ar' ? 'justify-end' : 'justify-start'} sm:flex-row gap-4 animate-fade-in-up animation-delay-400 ${local === 'ar' ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}
          >
            <button
              onClick={() => {
                console.log('Navigating to:', `/${local}/colleges`);
                router.push(`/${local}/colleges`);
              }}
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
};

export default HeroSection;
