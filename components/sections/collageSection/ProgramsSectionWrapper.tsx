'use client';

import React from 'react';
import { ProgramProvider } from '@/contexts/ProgramContext';
import { ProgramsSection } from './ProgramsSection';
import { SectionProvider } from '@/contexts';

interface ProgramsSectionWrapperProps {
  sectionId?: string;
  collageId?: string;
}

export function ProgramsSectionWrapper({
  sectionId,
  collageId,
}: ProgramsSectionWrapperProps) {
  return (
    <ProgramProvider collageId={collageId}>
      <SectionProvider collegeId={collageId}>
        <ProgramsSection sectionId={sectionId} collageId={collageId} />
      </SectionProvider>
    </ProgramProvider>
  );
}

export default ProgramsSectionWrapper;
