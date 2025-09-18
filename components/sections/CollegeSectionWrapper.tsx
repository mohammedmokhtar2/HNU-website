'use client';

import React from 'react';
import { CollegeProvider } from '@/contexts/CollegeContext';
import { CollegeSection } from './CollagesSection';

interface CollegeSectionWrapperProps {
  universityId?: string;
  sectionId?: string;
}

export function CollegeSectionWrapper({
  universityId,
  sectionId,
}: CollegeSectionWrapperProps) {
  return (
    <CollegeProvider universityId={universityId}>
      <CollegeSection universityId={universityId} sectionId={sectionId} />
    </CollegeProvider>
  );
}

export default CollegeSectionWrapper;
