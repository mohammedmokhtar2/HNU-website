'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AnimatedLoadingProps {
  onComplete?: () => void;
  duration?: number; // Total duration in milliseconds
}

export function AnimatedLoading({
  onComplete,
  duration = 4000,
}: AnimatedLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = useMemo(
    () => [
      {
        id: 0,
        title: 'Welcome to Helwan National University',
        subtitle: 'جامعة حلوان الأهلية',
        description: 'Your gateway to excellence in education and innovation',
        logo: '/logo2.png',
        duration: 1000,
      },
      {
        id: 1,
        title: 'Official Website',
        subtitle: 'الموقع الرسمي',
        description:
          'Discover our programs, facilities, and academic opportunities',
        logo: '/logo2.png',
        duration: 1000,
      },
      {
        id: 2,
        title: 'Powered by Helwan Plus',
        subtitle: 'مدعوم من حلوان بلس',
        description: 'Experience the future of digital education platforms',
        logo: '/helwanBlack.png',
        duration: 2000,
      },
    ],
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Start fade out animation
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onComplete?.();
          }, 500); // Wait for fade out animation
        }, 500);
      }
    }, steps[currentStep]?.duration || 1000);

    return () => clearTimeout(timer);
  }, [currentStep, steps, onComplete]);

  const currentStepData = steps[currentStep];

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-30'>
        <div className='w-full h-full bg-gradient-to-br from-gray-100/20 to-gray-200/20' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]' />
      </div>

      {/* Main Content */}
      <div className='relative z-10 text-center space-y-6 md:space-y-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Logo Container */}
        <div className='relative'>
          <div className='relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-6 md:mb-8'>
            <Image
              src={currentStepData.logo}
              alt={currentStepData.title}
              fill
              className={cn(
                'object-contain transition-all duration-700 ease-in-out',
                // Only spin for the first two steps, not for "Powered by"
                currentStep !== 2 && 'animate-spin',
                currentStep === 0 && 'scale-110',
                currentStep === 1 && 'scale-105'
              )}
              priority
            />

            {/* Glow Effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full blur-2xl md:blur-3xl opacity-20 animate-pulse' />
          </div>
        </div>

        {/* Text Content */}
        <div className='space-y-3 md:space-y-4'>
          <h1
            className={cn(
              'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black transition-all duration-700 ease-in-out leading-tight',
              currentStep === 0 && 'animate-fade-in-up-loading',
              currentStep === 1 && 'animate-fade-in-up-loading',
              currentStep === 2 && 'animate-fade-in-up-loading'
            )}
          >
            {currentStepData.title}
          </h1>

          <p
            className={cn(
              'text-lg sm:text-xl md:text-2xl text-gray-700 transition-all duration-700 ease-in-out font-medium',
              currentStep === 0 &&
                'animate-fade-in-up-loading animation-delay-200',
              currentStep === 1 &&
                'animate-fade-in-up-loading animation-delay-200',
              currentStep === 2 &&
                'animate-fade-in-up-loading animation-delay-200'
            )}
          >
            {currentStepData.subtitle}
          </p>

          {/* Additional Description Text */}
          <p
            className={cn(
              'text-sm sm:text-base md:text-lg text-gray-600 transition-all duration-700 ease-in-out max-w-md mx-auto leading-relaxed',
              currentStep === 0 &&
                'animate-fade-in-up-loading animation-delay-400',
              currentStep === 1 &&
                'animate-fade-in-up-loading animation-delay-400',
              currentStep === 2 &&
                'animate-fade-in-up-loading animation-delay-400'
            )}
          >
            {currentStepData.description}
          </p>
        </div>

        {/* Loading Progress Section */}
        <div className='space-y-4 md:space-y-6 max-w-md mx-auto'>
          {/* Loading Dots */}
          <div className='flex justify-center space-x-2'>
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300',
                  index <= currentStep
                    ? 'bg-black scale-110 shadow-lg'
                    : 'bg-black/30 scale-100'
                )}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className='w-full'>
            <div className='h-1 bg-black/20 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-full transition-all duration-300 ease-out shadow-lg'
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Loading Spinner - Only show for first two steps */}
          {currentStep !== 2 && (
            <div className='flex justify-center'>
              <div className='w-6 h-6 sm:w-8 sm:h-8 border-2 border-black/30 border-t-black rounded-full animate-spin' />
            </div>
          )}

          {/* Status Text */}
          <p className='text-xs sm:text-sm text-gray-600 font-medium'>
            {currentStep === 0 && 'Initializing university portal...'}
            {currentStep === 1 && 'Loading official content...'}
            {currentStep === 2 && 'Connecting to Helwan Plus services...'}
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className='absolute top-10 left-10 sm:top-20 sm:left-20 w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full animate-bounce delay-1000' />
      <div className='absolute top-20 right-16 sm:top-40 sm:right-32 w-2 h-2 sm:w-3 sm:h-3 bg-gray-500 rounded-full animate-bounce delay-2000' />
      <div className='absolute bottom-24 left-20 sm:bottom-32 sm:left-32 w-3 h-3 sm:w-5 sm:h-5 bg-gray-300 rounded-full animate-bounce delay-3000' />
      <div className='absolute bottom-16 right-12 sm:bottom-20 sm:right-20 w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full animate-bounce delay-1000' />

      {/* Additional floating elements for mobile */}
      <div className='absolute top-16 left-1/4 w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-1500 sm:hidden' />
      <div className='absolute bottom-20 right-1/4 w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-2500 sm:hidden' />
    </div>
  );
}
