import React from 'react';
import {
  PlusAbout,
  PlusAchivments,
  PlusDev,
  PlusHero,
  PlusTeam,
} from './_components';
import DecorativeWrapper from '@/components/DecorativeWrapper';

const HelwanPlusPage = () => {
  // we need to use here the BackgroundRippleEffect so the page be more modern and attractive
  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-white'>
      <DecorativeWrapper>
        <div className='relative z-10'>
          <div id='helwan_plus' className='space-y-0'>
            <PlusHero />
            <PlusAbout />
            <PlusTeam />
            <PlusDev />
          </div>
          <PlusAchivments />
        </div>
      </DecorativeWrapper>
    </div>
  );
};

export default HelwanPlusPage;
