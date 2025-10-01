'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DecorativeWrapper from '@/components/DecorativeWrapper';

const aboutData = {
  hero: {
    bgImage: '/aboutbg.png',
    title: 'About Helwan Plus',
    subtitle: 'Driving Digital Transformation in Education',
    description:
      'We are a passionate team of developers, designers, and innovators dedicated to revolutionizing the educational experience at Helwan National University through cutting-edge digital solutions.',
    imageUrl: '/images/gallery/2.jpg',
    stats: [
      { number: '50+', label: 'Projects Completed' },
      { number: '10k+', label: 'Users Served' },
      { number: '15+', label: 'Team Members' },
    ],
  },

  timeline: {
    title: 'Our Journey',
    events: [
      {
        year: '2021',
        title: 'Foundation',
        description:
          'Helwan Plus was founded with a vision to transform digital education at Helwan University.',
      },
      {
        year: '2022',
        title: 'First Launch',
        description:
          'Successfully launched the first version of the university portal with basic features.',
      },
      {
        year: '2023',
        title: 'Major Expansion',
        description:
          'Expanded to include mobile applications and additional digital services.',
      },
      {
        year: '2024',
        title: 'Innovation Hub',
        description:
          'Established as the official digital innovation center for Helwan National University.',
      },
    ],
  },
};

const AboutPage = () => {
  return (
    <div id='about' className='bg-white'>
      <DecorativeWrapper>
        {/* Hero Section */}
        <section
          className='relative h-[80vh]! flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white'
          style={{
            backgroundImage: `url(${aboutData.hero.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='absolute inset-0 bg-black/40' />
          <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              {/* Content */}
              <div className='space-y-8'>
                <div className='space-y-6'>
                  <Badge
                    variant='secondary'
                    className='px-4 py-2 text-sm bg-white/20 backdrop-blur-sm'
                  >
                    Innovation in Education
                  </Badge>
                  <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
                    {aboutData.hero.title}
                  </h1>
                  <p className='text-xl md:text-2xl text-blue-100 font-medium'>
                    {aboutData.hero.subtitle}
                  </p>
                  <p className='text-lg md:text-xl text-blue-200 leading-relaxed'>
                    {aboutData.hero.description}
                  </p>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-2 md:grid-cols-3 gap-6 pt-8'>
                  {aboutData.hero.stats.map((stat, index) => (
                    <div key={index} className='text-center'>
                      <div className='text-2xl md:text-3xl font-bold text-white'>
                        {stat.number}
                      </div>
                      <div className='text-sm md:text-base text-blue-200'>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='pt-4'>
                  <Button
                    size='lg'
                    className='bg-[#ffce00] hover:bg-[#ffce00]/90 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105'
                    onClick={() => {
                      const element = document.querySelector('#team');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Meet Our Team
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div className='relative'>
                <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                  <div className='aspect-[4/3] relative'>
                    <Image
                      src={aboutData.hero.imageUrl}
                      alt='Helwan Plus Team'
                      width={1000}
                      height={1000}
                      className='object-cover'
                      priority
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className='absolute -top-4 -right-4 w-24 h-24 bg-[#ffce00] rounded-full opacity-20 animate-pulse' />
                <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse delay-1000' />
              </div>
            </div>
          </div>
        </section>
      </DecorativeWrapper>
    </div>
  );
};

export default AboutPage;
