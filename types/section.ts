import { College } from './college';
import { SectionType } from './enums';
import { University } from './university';

// Base content structure for all sections
export interface BaseContent {
  ar: string;
  en: string;
}

// Specific content types for each section type
export interface HeroContent {
  title: BaseContent;
  content: BaseContent;
  imageUrl: string;
  videoUrl?: string;
}

export interface AboutContent {
  content: BaseContent;
  backgroundImage?: string;
  videoUrl?: string;
  title?: BaseContent;
  subtitle?: BaseContent;
}

export interface ActionsContent {
  title: BaseContent;
  description: BaseContent;
  actionHref: string;
}

export interface NumbersContent {
  title: BaseContent;
  number: number;
  description: BaseContent;
}

export interface StudentUnionContent {
  title: BaseContent;
  description: BaseContent;
  items: string[]; // Array of strings to be defined later
}

export interface EgyptStudentGroupContent {
  title: BaseContent;
  description: BaseContent;
  items: string[]; // Array of strings to be defined later
}

export interface CustomContent {
  [key: string]: any; // Flexible content for custom sections
}

// Discriminated union for section content based on type
export type SectionContent =
  | { type: SectionType.HERO; content: HeroContent }
  | { type: SectionType.ABOUT; content: AboutContent }
  | { type: SectionType.ACTIONS; content: ActionsContent }
  | { type: SectionType.NUMBERS; content: NumbersContent }
  | { type: SectionType.STUDENT_UNION; content: StudentUnionContent }
  | { type: SectionType.EGYPT_STUDENT_GROUP; content: EgyptStudentGroupContent }
  | { type: SectionType.HEADER; content: CustomContent }
  | { type: SectionType.CUSTOM; content: CustomContent };

export interface Section {
  id: string;
  type: SectionType;
  content: SectionContent['content'];
  order: number; // Section order on the page
  collageId?: string; // If section belongs to a specific college
  collage?: College; // Will be properly typed when imported
  universityId?: string;
  University?: University; // Will be properly typed when imported
  createdAt: Date;
  updatedAt: Date;
}

// Section creation input type
export interface CreateSectionInput {
  type: SectionType;
  content: SectionContent['content'];
  order: number;
  collageId?: string;
  universityId?: string;
}

// Section update input type
export interface UpdateSectionInput {
  type?: SectionType;
  content?: SectionContent['content'];
  order?: number;
  collageId?: string;
  universityId?: string;
}

// Section response type (for API responses)
export interface SectionResponse {
  id: string;
  type: SectionType;
  content: SectionContent['content'];
  order: number;
  collageId?: string;
  universityId?: string;
  createdAt: string; // ISO string for JSON serialization
  updatedAt: string; // ISO string for JSON serialization
}

// Section with relations response type
export interface SectionWithRelationsResponse extends SectionResponse {
  collage?: College; // Will be properly typed when imported
  University?: University; // Will be properly typed when imported
}

// Type guards for runtime type checking
export function isHeroContent(content: any): content is HeroContent {
  return (
    content &&
    typeof content.title === 'object' &&
    typeof content.content === 'object'
  );
}

export function isAboutContent(content: any): content is AboutContent {
  return (
    content &&
    typeof content.content === 'object' &&
    content.content.ar !== undefined &&
    content.content.en !== undefined
  );
}

export function isActionsContent(content: any): content is ActionsContent {
  return (
    content &&
    typeof content.title === 'object' &&
    typeof content.description === 'object' &&
    typeof content.actionHref === 'string'
  );
}

export function isNumbersContent(content: any): content is NumbersContent {
  return (
    content &&
    typeof content.title === 'object' &&
    typeof content.number === 'number' &&
    typeof content.description === 'object'
  );
}

export function isStudentUnionContent(
  content: any
): content is StudentUnionContent {
  return (
    content &&
    typeof content.title === 'object' &&
    typeof content.description === 'object' &&
    Array.isArray(content.items)
  );
}

export function isEgyptStudentGroupContent(
  content: any
): content is EgyptStudentGroupContent {
  return (
    content &&
    typeof content.title === 'object' &&
    typeof content.description === 'object' &&
    Array.isArray(content.items)
  );
}

// Helper function to get the correct content type based on section type
export function getContentForSectionType(type: SectionType): any {
  switch (type) {
    case SectionType.HERO:
      return {
        title: { ar: '', en: '' },
        content: { ar: '', en: '' },
        imageUrl: '',
        videoUrl: '',
      } as HeroContent;
    case SectionType.ABOUT:
      return {
        content: { ar: '', en: '' },
        title: { ar: 'معلومات عنا', en: 'About Us' },
        subtitle: { ar: 'تعرف علينا أكثر', en: 'Learn More About Us' },
      } as AboutContent;
    case SectionType.ACTIONS:
      return {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        actionHref: '',
      } as ActionsContent;
    case SectionType.NUMBERS:
      return {
        title: { ar: '', en: '' },
        number: 0,
        description: { ar: '', en: '' },
      } as NumbersContent;
    case SectionType.STUDENT_UNION:
      return {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        items: [],
      } as StudentUnionContent;
    case SectionType.EGYPT_STUDENT_GROUP:
      return {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        items: [],
      } as EgyptStudentGroupContent;
    case SectionType.HEADER:
    case SectionType.CUSTOM:
      return {} as CustomContent;
    default:
      return {} as CustomContent;
  }
}
