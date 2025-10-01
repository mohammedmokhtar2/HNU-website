'use client';
import React from 'react';
import { BackgroundLines } from '@/components/ui/background-lines';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Spotlight } from '@/components/ui/spotlight';

const plusHeroData = {
  imageUrl: '/home.jpeg',
  title: 'Helwan Plus',
  description:
    'Helwan Plus is a team of developers who are passionate about building innovative solutions for the Helwan community. ',
  buttons: [
    {
      label: 'About Us',
      href: '#about',
      target: '_self',
    },
    {
      label: 'meet the team',
      href: '#team',
      target: '_self',
    },
    {
      label: 'meet dev team',
      href: '#dev-team',
      target: '_self',
    },
  ],
};

const plusHero = () => {
  // we will display here the logo title and three buttons actions
  // we will use the BackgroundLines
  // the text is in the center overlaying the image with the three buttons outline underneeth them
  return (
    <div className='relative w-full h-[100vh] bg-white! overflow-hidden'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0'>
        <Image
          src={plusHeroData.imageUrl}
          alt='Helwan Plus Background'
          fill
          className='object-cover'
          priority
        />
        {/* Black Overlay */}
        <div className='absolute inset-0 bg-[#1b4b7b]/40' />
      </div>

      {/* BackgroundLines Effect */}
      <BackgroundLines className='absolute inset-0 flex items-center justify-center w-full flex-col px-4 !bg-transparent'>
        <div className='text-center space-y-8 max-w-4xl mx-auto relative z-20'>
          {/* Logo Section */}
          <div className='space-y-6'>
            <div className='flex justify-center'>
              <Image
                src='/helwanWhite.png'
                alt='Helwan Plus Logo'
                width={800}
                height={800}
                className='max-w-full h-auto'
                priority
              />
            </div>
            <p className='max-w-4xl mx-auto text-lg md:text-3xl text-white relative z-20 drop-shadow-lg'>
              {plusHeroData.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 relative z-20'>
            {plusHeroData.buttons.map((button, index) => (
              <Button
                key={index}
                variant='outline'
                size='lg'
                className='border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-3 text-lg font-semibold backdrop-blur-sm'
                onClick={() => {
                  const element = document.querySelector(button.href);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </div>
      </BackgroundLines>
    </div>
  );
};

export default plusHero;
