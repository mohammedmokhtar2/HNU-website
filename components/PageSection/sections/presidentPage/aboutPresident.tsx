'use client';

import { PageSection } from '@/types/pageSections';
import type { PresidentContent } from '@/types/pageSections';
import Image from 'next/image';

interface PresidentSectionProps {
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

export function PresidentSection({
  section,
  locale,
  getLocalizedContent,
}: PresidentSectionProps) {
  const content = section.content as PresidentContent;

  if (!content) {
    return (
      <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500'>Content not available</p>
      </div>
    );
  }

  const name = getLocalizedContent(content.Name);
  const role = getLocalizedContent(content.Role);
  const paragraphs = content.PresidentParagraphs.map(p =>
    getLocalizedContent(p)
  );
  const imageUrl = content.PresidentImageUrl;

  return (
    <div className='container mx-auto px-6 py-12 mt-20'>
      <div className='flex flex-col md:flex-row items-center gap-12'>
        {/* الجزء اليمين - الصورة */}
        <div className='flex-shrink-0'>
          <div className='rounded-2xl overflow-hidden shadow-lg w-[500px] h-[700px] relative'>
            <Image src={imageUrl} alt={name} fill className='object-cover' />
          </div>
        </div>

        {/* الجزء الشمال - النصوص */}
        <div className='flex-1'>
          <h2 className='text-5xl font-bold mb-6 text-black'>{name}</h2>
          <p className='text-2xl font-semibold text-gray-600 mb-6'>{role}</p>

          <div className='space-y-4'>
            {paragraphs.map((p, idx) => (
              <p key={idx} className='text-lg text-gray-700 leading-relaxed'>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
