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
      'Full-stack developer with expertise in React, Node.js, and Next.js',
    roleNum: 2, // is the lead
    roleName: 'Lead Developer',
  },
  developer_2: {
    image: '/person.png',
    name: 'Sarah Mohamed',
    description:
      'Frontend specialist passionate about creating beautiful and intuitive user experiences',
    roleNum: 1,
    roleName: 'Frontend Developer',
  },
  developer_3: {
    image: '/person.png',
    name: 'Omar Ali',
    description:
      'Backend engineer focused on scalable architecture and database optimization',
    roleNum: 1,
    roleName: 'Backend Developer',
  },
  developer_4: {
    image: '/person.png',
    name: 'Ahmed Hassan',
    description:
      'Full-stack developer with expertise in React, Node.js, and cloud technologies',
    roleNum: 2, // is the lead
    roleName: 'Lead Developer',
  },
  developer_5: {
    image: '/person.png',
    name: 'Sarah Mohamed',
    description:
      'Frontend specialist passionate about creating beautiful and intuitive user experiences',
    roleNum: 1,
    roleName: 'Frontend Developer',
  },
  developer_6: {
    image: '/person.png',
    name: 'Omar Ali',
    description:
      'Backend engineer focused on scalable architecture and database optimization',
    roleNum: 1,
    roleName: 'Backend Developer',
  },
  developer_7: {
    image: '/person.png',
    name: 'Ahmed Hassan',
    description:
      'Full-stack developer with expertise in React, Node.js, and cloud technologies',
    roleNum: 2, // is the lead
    roleName: 'Lead Developer',
  },
  developer_8: {
    image: '/person.png',
    name: 'Sarah Mohamed',
    description:
      'Frontend specialist passionate about creating beautiful and intuitive user experiences',
    roleNum: 1,
    roleName: 'Frontend Developer',
  },
  developer_9: {
    image: '/person.png',
    name: 'Omar Ali',
    description:
      'Backend engineer focused on scalable architecture and database optimization',
    roleNum: 1,
    roleName: 'Backend Developer',
  },
};
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
      className='relative min-h-[60vh] flex pt-10 items-center justify-center overflow-hidden bg-white'
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
          className='space-y-12'
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
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold leading-tight'>
              <span className='text-[#354eab]'>
                <Cover variant='helwan' className='text-[#354eab]!'>
                  Development Team
                </Cover>
              </span>
            </h1>
          </motion.div>

          {/* Enhanced Description with ContainerTextFlip */}
          <motion.div
            className='max-w-5xl mx-auto space-y-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className='text-xl md:text-2xl text-gray-800 font-medium leading-relaxed'>
              Meet our talented developers who bring ideas to life with
            </p>

            <p className='text-lg md:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed'>
              We craft cutting-edge digital solutions that transform education
              and empower the Helwan community through technology.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className=' '
            justify-center
            items-center
          >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {developers.map((developer, index) => (
                <div
                  key={index}
                  className={`relative ${developer.roleNum === 2 ? 'md:col-span-2 lg:col-span-1 lg:mb-10' : ''}`}
                >
                  <DirectionAwareHover imageUrl={developer.image}>
                    <div className='space-y-3'>
                      <h3 className='font-bold text-xl text-white'>
                        {developer.name}
                      </h3>
                      <p className='font-normal text-sm text-gray-200'>
                        {developer.roleName}
                      </p>
                      <p className='font-normal text-sm text-gray-300 mt-2'>
                        {developer.description}
                      </p>
                    </div>
                  </DirectionAwareHover>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating Elements */}
          <div className='absolute -top-10 -left-10 w-20 h-20 bg-[#354eab]/20 rounded-full animate-pulse' />
          <div className='absolute -bottom-10 -right-10 w-32 h-32 bg-[#ffce00]/20 rounded-full animate-pulse delay-1000' />
          <div className='absolute top-1/2 -right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500' />
        </motion.div>
      </div>
    </section>
  );
};

export default plusDev;
