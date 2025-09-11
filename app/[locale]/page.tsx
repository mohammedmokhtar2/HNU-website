'use client';
import HeroSection from '@/components/home/heroSection';
import AboutSection from '@/components/home/aboutSection';
import ProgramsSection from '@/components/home/programsSection';
import {
  heroSection,
  aboutSection,
  programsSection,
  FactsAndNumbers,
  // faqRandom,
  topNewsData,
  // factSection
} from '@/data';
import React from 'react';
import { useLocale } from 'next-intl';
import FcatsAndNumber from '@/components/home/FcatsAndNumber';
// import FAQ from '@/components/home/FAQ';
// import TopStudentActivities from '@/components/home/TopStudentActivities';
// import TopEvents from '@/components/home/TopEvents';
import TopNews from '@/components/home/TopNews';

function Home() {
  const locale = useLocale(); // route ar or en based on the url
  return (
    <>
      <HeroSection {...heroSection} local={locale} />
      <AboutSection {...aboutSection} local={locale} />
      <div className='relative py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200 overflow-hidden'>
        <ProgramsSection {...programsSection} local={locale} />
        <FcatsAndNumber {...FactsAndNumbers} local={locale} />
        {/* <FAQ {...faqRandom} local={locale} /> */}
        <TopNews {...topNewsData} local={locale} />
        {/* <TopEvents /> */}
        {/* <TopStudentActivities /> */}
      </div>
    </>
  );
}

export default Home;
