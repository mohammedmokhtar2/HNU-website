'use client';
import React from 'react';
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
import Image from 'next/image';

const plusTeamData = {
  persone_1: {
    image:
      'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDNdbI3njpSTBfA67Q4Dj1yhaHre3MCgFwPExu5',
    name: 'Hady hussien',
    descirption: 'hello im hasdm and here ill write something avout me',
    roleNum: 1, // is the head
    roleName: 'member of helwan plus team',
  },
  persone_2: {
    image:
      'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDNcxFOKkNkbB9tm4zg5AKHqP1TonWUa2xeQXNs',
    name: 'Hashem abrahim',
    descirption: 'hello im hasdm and here ill write something avout me',
    roleNum: 2, // is the head
    roleName: 'head of helwan Plus Team',
  },
  persone_3: {
    image:
      'https://qcrk6zwvxd.ufs.sh/f/YNynAnrvbHDN17OqqmEjer6no5g4l87NBVcqC2HyaLWfkEms',
    name: 'Ammar Yasser',
    descirption: 'hello im hasdm and here ill write something avout me',
    roleNum: 1, // is the head
    roleName: 'member of helwan plus team',
  },
};

const plusTeam = () => {
  // this page will have a grid of 3 cards with the image of the team
  // the card will have a roleNumber the role number will know from it whether its a member or a head
  // the head card will have margin botton 40 over the other cards
  // the cards will use ths DirectionAwareHover when we use this component effect it wil  display the profile of the person
  // the profile will have the name a description and roleName

  const teamMembers = [
    plusTeamData.persone_1,
    plusTeamData.persone_2,
    plusTeamData.persone_3,
  ];

  return (
    <section
      id='team'
      className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-[60vh] relative overflow-hidden'
    >
      {/* Decorative Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Gradient Orbs - Responsive sizing */}
        <div className='absolute top-10 sm:top-20 left-4 sm:left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-r from-[#354eab]/20 to-[#ffce00]/20 rounded-full blur-xl animate-pulse'></div>
        <div className='absolute top-20 sm:top-40 right-8 sm:right-20 w-12 sm:w-20 lg:w-24 h-12 sm:h-20 lg:h-24 bg-gradient-to-r from-[#ffce00]/20 to-[#354eab]/20 rounded-full blur-lg animate-pulse delay-1000'></div>
        <div className='absolute bottom-10 sm:bottom-20 left-1/4 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-gradient-to-r from-[#354eab]/15 to-[#ffce00]/15 rounded-full blur-2xl animate-pulse delay-2000'></div>

        {/* Geometric Shapes - Hidden on mobile */}
        <div
          className='hidden sm:block absolute top-16 sm:top-32 right-1/3 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-[#354eab]/30 rotate-45 animate-spin'
          style={{ animationDuration: '20s' }}
        ></div>
        <div
          className='hidden sm:block absolute bottom-16 sm:bottom-32 left-1/3 w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 border-2 border-[#ffce00]/30 rotate-12 animate-bounce'
          style={{ animationDuration: '3s' }}
        ></div>

        {/* Subtle Grid Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='w-full h-full'
            style={{
              backgroundImage: `
              linear-gradient(rgba(53, 78, 171, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(53, 78, 171, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: '30px 30px',
            }}
          ></div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-12 sm:mb-16'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 relative'>
            Meet Our Team
            <div className='absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-[#354eab] to-[#ffce00] rounded-full'></div>
          </h2>
          <p className='text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4'>
            Get to know the passionate individuals behind Helwan Plus
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`relative group flex justify-center ${member.roleNum === 2 ? 'sm:col-span-2 lg:col-span-1 lg:mb-8' : ''}`}
            >
              <DirectionAwareHover imageUrl={member.image}>
                <div className='space-y-2 p-4'>
                  <h3 className='font-bold text-lg sm:text-xl text-white drop-shadow-lg'>
                    {member.name}
                  </h3>
                  <p className='font-normal text-xs sm:text-sm text-gray-200 drop-shadow-md'>
                    {member.roleName}
                  </p>
                  <p className='font-normal text-xs sm:text-sm text-gray-300 mt-2 drop-shadow-md'>
                    {member.descirption}
                  </p>
                </div>
              </DirectionAwareHover>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default plusTeam;
