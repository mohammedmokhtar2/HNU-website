'use client';
import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { UniversityService } from '@/services/university.service';
import { DynamicHomePage } from '@/components/sections/DynamicHomePage';
import HeroSection from '@/components/home/heroSection';
import AboutSection from '@/components/home/aboutSection';
import ProgramsSection from '@/components/home/programsSection';
import {
  heroSection,
  aboutSection,
  programsSection,
  FactsAndNumbers,
  topNewsData,
} from '@/data';
import FcatsAndNumber from '@/components/home/FcatsAndNumber';
import TopNews from '@/components/home/TopNews';

function Home() {
  const locale = useLocale();
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [useDynamicSections, setUseDynamicSections] = useState(false);

  useEffect(() => {
    const loadUniversity = async () => {
      try {
        const universities = await UniversityService.getUniversities();
        if (universities && universities.length > 0) {
          setUniversityId(universities[0].id);
          // Check if university has sections configured
          // For now, we'll use a simple flag, but this could be based on config
          setUseDynamicSections(true);
        }
      } catch (error) {
        console.error('Error loading university:', error);
        setUseDynamicSections(false);
      }
    };

    loadUniversity();
  }, []);

  // Use dynamic sections if available, otherwise fall back to static content
  if (useDynamicSections && universityId) {
    return <DynamicHomePage universityId={universityId} />;
  }

  // Fallback to static content
  return (
    <>
      <HeroSection {...heroSection} local={locale} />
      <AboutSection {...aboutSection} local={locale} />
      <div className='relative py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200 overflow-hidden'>
        <ProgramsSection {...programsSection} local={locale} />
        <FcatsAndNumber {...FactsAndNumbers} local={locale} />
        <TopNews {...topNewsData} local={locale} />
      </div>
    </>
  );
}

export default Home;
