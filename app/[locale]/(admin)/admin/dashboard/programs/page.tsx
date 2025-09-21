'use client';

import React from 'react';
import { ProgramManagementPage } from '@/components/admin/program';
import { ProgramProvider } from '@/contexts/ProgramContext';
import { CollegeProvider } from '@/contexts/CollegeContext';

const ProgramsPage = () => {
  return (
    <CollegeProvider>
      <ProgramProvider>
        <ProgramManagementPage />
      </ProgramProvider>
    </CollegeProvider>
  );
};

export default ProgramsPage;
