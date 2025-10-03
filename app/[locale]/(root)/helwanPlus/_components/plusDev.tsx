'use client';
import React from 'react';
import { Cover } from '@/components/ui/cover';
import { ContainerTextFlip } from '@/components/ui/container-text-flip';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { Spotlight } from '@/components/ui/spotlight';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';

const devTeamData = {
  developer_1: {
    image: '/devs/me.jpeg',
    name: 'Mahmoud Matter',
    description:
      'Tech Lead @ Helwan Plus, Scintific Commite Head @ FCSIT SU, Full-stack developer with expertise in React, Node.js, and Next.js',
    roleNum: 2, // is the lead
    roleName: 'Lead Developer',
    portfolio: 'https://matter-portofilio.vercel.app',
  },
  developer_2: {
    image: 'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDNDLhpC75wXsYhIbmJ8Pg0zefVuTKdrWSGyv6c',
    name: 'Mohamed Ibrahim',
    description:
      'Full-stack developer with expertise in React, Node.js',
    roleNum: 1,
    roleName: 'Frontend Developer',
    portfolio: 'https://mohamed-ibrahim-omar.vercel.app/',
  },
  developer_3: {
    image: 'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDN2RqAjb7ZDoBaElAg1NTj8iIz5pdw03VmSMnR',
    name: 'Ahmed Khairy ',
    description:
      'Full-stack developer with expertise in React, Node.js',
    roleNum: 1,
    roleName: 'Backend Developer',
    portfolio: 'https://ahmed-khairy0106.vercel.app/',
  },
  developer_4: {
    image: 'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDNrKr22DONPpMR7jbTfXulOCvnYGz9V6ABU2Hq',
    name: 'Ahmed Salah',
    description:
      'AI Developer and Workflow Automation Specialist',
    roleNum: 2, // is the lead
    roleName: 'Lead Developer',
    portfolio: null,
  },
  developer_5: {
    image: 'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDNPnXFAyUUvVrHIubZJXfkaQDgmnoW5YC21lie',
    name: 'Yousef Ahmed',
    description:
      'Student Union Representative',
    roleNum: 1,
    roleName: 'Frontend Developer',
    portfolio: null,

  },
  developer_6: {
    image: 'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDN4dUDXBcVcTedoMjmikQ8uLUbqhtSsGgD3E50',
    name: 'Ammar Ahmed',
    description:
      'Student Union Representative',
    roleNum: 1,
    roleName: 'Backend Developer',
    portfolio: null,

  },
  developer_7: {
    image: 'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDNoG4eHT2TLrER4WNiuj9Z5fSAemgh8YvHJ0cw',
    name: 'Omar Wassem',
    description:
      'Frontend specialist passionate about creating beautiful and intuitive user experiences',
    roleNum: 2, // is the lead
    roleName: 'Lead Developer',
    portfolio: null,

  },
  developer_8: {
    image: 'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDNbYNIEDe8VuOnGQMHB3kzhFZKp1LtqjUfvXlY',
    name: 'Abdelrahman Hany',
    description:
      'Frontend specialist passionate about creating beautiful and intuitive user experiences',
    roleNum: 1,
    roleName: 'Frontend Developer',
    portfolio: null,

  },
  developer_9: {
    image: 'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDNytoLqhYG9OKAbuoqx10QkIcMfCjtNmUBiy4r',
    name: 'Mohammed Mokhtar',
    description:
      'AI Developer and Workflow Automation Specialist',
    roleNum: 1,
    roleName: 'Backend Developer',
    portfolio: "https://mohammedmokhtar2.github.io/Portfolio/",

  },
};

const handleDevClick = (developer: any) => {
  if (developer.portfolio) {
    window.open(developer.portfolio, '_blank');
  }
}
const plusDev = () => {
  // Enhanced dev team hero section with modern animations and effects
  // Features: Spotlight effect, ripple background, animated text, and interactive elements
  const developers = [
    devTeamData.developer_1,
    devTeamData.developer_2,
    devTeamData.developer_3,
    devTeamData.developer_4,
    devTeamData.developer_5,
    devTeamData.developer_6,
    devTeamData.developer_7,
    devTeamData.developer_8,
    devTeamData.developer_9,
  ];

  return (
    <section
      id='dev_team'
      className='relative min-h-[60vh] flex pt-8 sm:pt-10 items-center justify-center overflow-hidden bg-white'
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <Image
          src='/bg_2.png'
          alt='Background Pattern'
          fill
          className='object-cover'
        />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <motion.div
          className='space-y-8 sm:space-y-12'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Main Title with Enhanced Cover Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className='space-y-4'
          >
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight'>
              <span className='text-[#354eab]'>
                <Cover variant='helwan' className='text-[#354eab]!'>
                  Development Team
                </Cover>
              </span>
            </h1>
          </motion.div>

          {/* Enhanced Description with ContainerTextFlip */}
          <motion.div
            className='max-w-5xl mx-auto space-y-4 sm:space-y-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className='text-lg sm:text-xl md:text-2xl text-gray-800 font-medium leading-relaxed px-4'>
              Meet our talented developers who bring ideas to life with
            </p>

            <p className='text-base sm:text-lg md:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed px-4'>
              We craft cutting-edge digital solutions that transform education
              and empower the Helwan community through technology.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className='flex justify-center items-center'
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
              {developers.map((developer, index) => (
                <div
                  key={index}
                  onClick={() => handleDevClick(developer)}
                  className={`relative ${developer.portfolio ? 'cursor-pointer' : ''} ${developer.roleNum === 2 ? 'sm:col-span-2 lg:col-span-1 lg:mb-8' : ''}`}
                >
                  <DirectionAwareHover className='justify-center text-center' imageUrl={developer.image}>
                    <div className='space-y-2 sm:space-y-3 p-3 sm:p-4'>
                      <h3 className='font-bold text-lg sm:text-xl text-white'>
                        {developer.name}
                      </h3>
                      <p className='font-normal text-xs sm:text-sm text-white'>
                        {developer.roleName}
                      </p>
                      <p className='font-normal text-xs sm:text-sm text-white mt-2'>
                        {developer.description}
                      </p>
                      <p className='font-normal text-xs sm:text-sm text-white mt-2'>
                        {developer.portfolio && (
                          <a href={developer.portfolio} target='_blank' rel='noopener noreferrer' className='text-blue-500'>
                            View Portfolio
                          </a>
                        )}
                      </p>
                    </div>
                  </DirectionAwareHover>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating Elements - Hidden on mobile */}
          <div className='hidden sm:block absolute -top-8 sm:-top-10 -left-8 sm:-left-10 w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 bg-[#354eab]/20 rounded-full animate-pulse' />
          <div className='hidden sm:block absolute -bottom-8 sm:-bottom-10 -right-8 sm:-right-10 w-20 sm:w-24 lg:w-32 h-20 sm:h-24 lg:h-32 bg-[#ffce00]/20 rounded-full animate-pulse delay-1000' />
          <div className='hidden sm:block absolute top-1/2 -right-12 sm:-right-16 lg:-right-20 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 bg-white/10 rounded-full animate-pulse delay-500' />
        </motion.div>
      </div>
    </section>
  );
};

export default plusDev;
