import { PageSectionType } from './enums';
import { Page } from './page';

export interface BaseContent {
  ar: string;
  en: string;
}

export interface HeroContentOne {
  title: BaseContent;
  description: BaseContent;
  imageUrl: string;
}

export interface HeroContentTwo {
  title: BaseContent;
  backgroundImage: string;
  buttons: {
    text: BaseContent;
    url: string;
  }[];
}

export interface AboutContentOne {
  title?: BaseContent;
  subtitle?: BaseContent;
  description: BaseContent;
  ButtonText?: BaseContent;
  ButtonUrl?: string;
  imageUrl?: string;
  content: BaseContent;
}

export interface AboutContentTwo {
  title?: BaseContent;
  subtitle?: BaseContent;
  description: BaseContent;
  buttons: {
    text: BaseContent;
    url: string;
  }[];
  leftTitleOne?: BaseContent;
  leftDescriptionOne: BaseContent;
  leftTitleTwo?: BaseContent;
  leftDescriptionTwo: BaseContent;
}

export interface PresidentContent {
  Name: BaseContent;
  Role: BaseContent;
  Title: BaseContent;
  PresidentImageUrl: string;
  ImagesUrl: string[];
  Paragraphs: BaseContent[];
  PresidentParagraphs: BaseContent[];
}

export interface ContactContent {
  title: BaseContent;
  description: BaseContent;
  email: string;
  phone: string;
  address: BaseContent;
  mapUrl: string;
}

export interface BlogsContent {
  title: BaseContent;
  description: BaseContent;
  showFeatured: boolean;
  postsLimit: number;
}

export interface StudentActivitiesContent {
  title: BaseContent;
  description: BaseContent;
  activities: any[];
}

export interface StudentUnionsContent {
  heroSection: {
    bgImageUrl: string;
    logo: string;
    title: BaseContent;
  };

  aboutSection: {
    imageUrl: string;
    title: BaseContent;
    description: BaseContent;
  };

  ourMissionSection: {
    imageUrl: string;
    title: BaseContent;
    description: BaseContent;
  };

  contactUsSection: {
    title: BaseContent;
    buttonUrl: string;
    socialMediaButtons: {
      text: BaseContent;
      url: string;
    }[];
  };
}

export interface ForEgyptGroupContent {
  heroSection: {
    bgImageUrl: string;
    logo: string;
    title: BaseContent;
  };

  aboutSection: {
    imageUrl: string;
    title: BaseContent;
    description: BaseContent;
  };

  ourMissionSection: {
    imageUrl: string;
    title: BaseContent;
    description: BaseContent;
  };

  contactUsSection: {
    title: BaseContent;
    buttonUrl: string;
    socialMediaButtons: {
      text: string;
      url: string;
    }[];
  };
}

export interface OurHistoryContent {
  title: BaseContent;
  description: BaseContent;
  images: string[];
  MapSectionTitle: BaseContent;
  mapUrl: string;
}

export interface CustomContent {
  title: BaseContent;
  content: BaseContent;
  customData: Record<string, any>;
}

export type PageSectionContent =
  | { type: PageSectionType.HERO1; content: HeroContentOne }
  | { type: PageSectionType.HERO2; content: HeroContentTwo }
  | { type: PageSectionType.ABOUT1; content: AboutContentOne }
  | { type: PageSectionType.ABOUT2; content: AboutContentTwo }
  | { type: PageSectionType.CONTACT; content: ContactContent }
  | { type: PageSectionType.BLOGS; content: BlogsContent }
  | { type: PageSectionType.PRESIDENT; content: PresidentContent }
  | { type: PageSectionType.PRESIDENT_MESSAGE; content: PresidentContent }
  | {
      type: PageSectionType.STUDENT_ACTIVITIES;
      content: StudentActivitiesContent;
    }
  | { type: PageSectionType.STUDENT_UNIONS; content: StudentUnionsContent }
  | { type: PageSectionType.FOR_EGYPT_GROUP; content: ForEgyptGroupContent }
  | { type: PageSectionType.OUR_HISTORY; content: OurHistoryContent }
  | { type: PageSectionType.CUSTOM; content: CustomContent };

// Base Page Section interface
export interface PageSection {
  id: string;
  type: PageSectionType;
  title: BaseContent; // JSON for multilingual titles
  content: PageSectionContentUnion; // JSON for section content
  mediaUrl?: Record<string, any>; // JSON for media URLs
  order: number;
  createdAt: Date;
  updatedAt: Date;
  pageId: string;
  page?: Page; // Will be properly typed when imported
}

// Page Section creation input type
export interface CreatePageSectionInput {
  type: PageSectionType;
  title: BaseContent;
  content: PageSectionContentUnion;
  mediaUrl?: Record<string, any>;
  order: number;
  pageId: string;
}

// Page Section update input type
export interface UpdatePageSectionInput {
  type?: PageSectionType;
  title?: BaseContent;
  content?: PageSectionContentUnion;
  mediaUrl?: Record<string, any>;
  order?: number;
  pageId?: string;
}

// Page Section response type (for API responses)
export interface PageSectionResponse {
  id: string;
  type: PageSectionType;
  title: BaseContent;
  content: PageSectionContentUnion;
  mediaUrl?: Record<string, any>;
  order: number;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
  pageId: string;
}

// Page Section with relations response type
export interface PageSectionWithRelationsResponse extends PageSectionResponse {
  page?: Page; // Will be properly typed when imported
}

// Union type for all page section content types
export type PageSectionContentUnion =
  | HeroContentOne
  | HeroContentTwo
  | AboutContentOne
  | AboutContentTwo
  | ContactContent
  | BlogsContent
  | PresidentContent
  | StudentActivitiesContent
  | StudentUnionsContent
  | ForEgyptGroupContent
  | OurHistoryContent
  | CustomContent;
