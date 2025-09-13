import { CollegeConfig } from '@/types';
import { CollegeType } from '@prisma/client';
import React from 'react';

// this page is for a specific collage including
/*
- collage meta info
- programs in this collages
- 
*/
interface College {
  id: string;
  slug: string;
  name: Record<string, any>;
  config?: CollegeConfig; // JSON config for logo and social media links
  type: CollegeType;
}

function CollagePage() {
  return <div>CollagesPage</div>;
}

export default CollagePage;
