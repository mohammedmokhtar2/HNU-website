'use client';

import { PageSection } from '@/types/pageSections';
import type { StudentUnionsContent } from '@/types/pageSections';
import Image from 'next/image';

interface StudentUnionsSectionProps {
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

export function StudentUnionsSection({
  section,
  locale,
  getLocalizedContent,
}: StudentUnionsSectionProps) {
  const content = section.content as StudentUnionsContent;

  if (!content) {
    return (
      <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500'>Content not available</p>
      </div>
    );
  }

  export interface StudentActivitiesContent {
    title: BaseContent;
    description: BaseContent;
    activities: any[];
  }

  // export interface StudentUnionsContent {
  //   heroSection: {
  //     bgImageUrl: string;
  //     logo: string;
  //     title: BaseContent;
  //   };

  //   aboutSection: {
  //     imageUrl: string;
  //     title: BaseContent;
  //     description: BaseContent;
  //   };

  //   ourMissionSection: {
  //     imageUrl: string;
  //     title: BaseContent;
  //     description: BaseContent;
  //   };

  //   contactUsSection: {
  //     title: BaseContent;
  //     buttonUrl: string;
  //     socialMediaButtons: {
  //       text: BaseContent;
  //       url: string;
  //     }[];
  //   };
  // }

  const heroTitle = getLocalizedContent(content.heroSection.title);
  const heroLogo = content.heroSection.logo;
  const heroBg = content.heroSection.bgImageUrl;

  const aboutTitle = getLocalizedContent(content.aboutSection.title);
  const aboutImage = content.aboutSection.imageUrl;
  const aboutDescription = getLocalizedContent(
    content.aboutSection.description
  );

  const missionTitle = getLocalizedContent(content.ourMissionSection.title);
  const missionDescription = getLocalizedContent(
    content.ourMissionSection.description
  );
  const missionImage = content.ourMissionSection.imageUrl;

  const contactTitle = getLocalizedContent(content.contactUsSection.title);
  const contactButtonUrl = content.contactUsSection.buttonUrl;
  const socialButtons = content.contactUsSection.socialMediaButtons || [];
  return <div className='container mx-auto px-6 py-12 mt-20'></div>;
}
