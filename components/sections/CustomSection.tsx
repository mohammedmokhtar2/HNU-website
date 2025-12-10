'use client';

import React from 'react';
import Image from 'next/image';
import { Section } from '@/types/section';

interface CustomSectionProps {
  section: Section;
  locale: string;
}

export function CustomSection({ section, locale }: CustomSectionProps) {
  return <div>CustomSection</div>;
}
