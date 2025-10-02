import { College } from './college';
import { SectionType, CollegeType } from './enums';
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

export interface BlogsContent {
  title: BaseContent;
  description: BaseContent;
  showFeaturedOnly?: boolean;
  maxItems?: number;
  showUniversityBlogs?: boolean;
  showCollegeBlogs?: boolean;
}

// here
export interface CollegeSectionContent {
  title: BaseContent;
  subtitle: BaseContent;
  description: BaseContent;
  buttonText: BaseContent;
  collegeIds: string[]; // Array of selected college IDs
}

export interface OurMissionContent {
  title: BaseContent;
  description: BaseContent;
  imageUrl: string;
  buttonText: BaseContent;
}

export interface CollegesContent {
  title: BaseContent;
  subtitle: BaseContent;
  displaySettings: {
    showFees: boolean;
    showStudentCount: boolean;
    showProgramsCount: boolean;
    showFacultyCount: boolean;
  };
  defaultFees?: {
    ar: string;
    en: string;
  };
}

export interface ProgramsContent {
  title: BaseContent;
  description: BaseContent;
  maxItems?: number;
}

export interface ProgramsSectionContent {
  title: BaseContent;
  subtitle: BaseContent;
  description: BaseContent;
  buttonText: BaseContent;
  collageId?: string; // Specific college ID for filtering programs
  maxItems?: number;
}

export interface ContactUsContent {
  imageUrl: string;
  title: BaseContent;
  subtitle: BaseContent;
  description: BaseContent;
  formTitle: BaseContent;
  nameLabel: BaseContent;
  emailLabel: BaseContent;
  subjectLabel: BaseContent;
  messageLabel: BaseContent;
  submitButtonText: BaseContent;
  successMessage: BaseContent;
  errorMessage: BaseContent;
  adminEmail: string; // Admin email to receive messages
  showContactInfo?: boolean;
  contactInfo?: {
    phone?: BaseContent;
    address?: BaseContent;
    email?: BaseContent;
  };
}

export interface CustomContent {
  [key: string]: any; // Flexible content for custom sections
}

// Discriminated union for section content based on type
export type SectionContent =
  | { type: SectionType.HEADER; content: CustomContent }
  | { type: SectionType.HERO; content: HeroContent }
  | { type: SectionType.ABOUT; content: AboutContent }
  | { type: SectionType.ACTIONS; content: ActionsContent }
  | { type: SectionType.OUR_MISSION; content: OurMissionContent }
  | { type: SectionType.NUMBERS; content: NumbersContent }
  | { type: SectionType.STUDENT_UNION; content: StudentUnionContent }
  | { type: SectionType.COLLEGES_SECTION; content: CollegeSectionContent }
  | { type: SectionType.PROGRAMS_SECTION; content: ProgramsSectionContent }
  | { type: SectionType.EGYPT_STUDENT_GROUP; content: EgyptStudentGroupContent }
  | { type: SectionType.PRESIDENT; content: CustomContent }
  | { type: SectionType.BLOGS; content: BlogsContent }
  | { type: SectionType.CONTACT_US; content: ContactUsContent }
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

// Extended AboutContent for college sections with additional fields
export interface CollegeAboutContent extends AboutContent {
  title: BaseContent;
  subtitle: BaseContent;
  backgroundImage: string;
}

// Complete section response interface matching the provided data structure
export interface CompleteSectionResponse {
  id: string;
  type: SectionType;
  title: string | null;
  content: CollegeAboutContent;
  mediaUrl: string | null;
  order: number;
  universityId: string | null;
  createdAt: string;
  updatedAt: string;
  collageId: string;
  collage: {
    id: string;
    slug: string;
    name: BaseContent;
    description: BaseContent;
    config: {
      faq: any[];
      theme: Record<string, any>;
      logoUrl: string;
      galleryImages: any[];
    };
    type: 'TECHNICAL' | 'MEDICAL' | 'ARTS' | 'OTHER';
    fees: BaseContent;
    studentsCount: number;
    programsCount: number;
    facultyCount: number;
    establishedYear: number;
    createdById: string;
    universityId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  University: null;
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

export function isCollegeAboutContent(
  content: any
): content is CollegeAboutContent {
  return (
    content &&
    typeof content.title === 'object' &&
    typeof content.subtitle === 'object' &&
    typeof content.backgroundImage === 'string' &&
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

export function isProgramsSectionContent(
  content: any
): content is ProgramsSectionContent {
  return (
    content &&
    typeof content.title === 'object' &&
    typeof content.subtitle === 'object' &&
    typeof content.description === 'object' &&
    typeof content.buttonText === 'object'
  );
}

export function isContactUsContent(content: any): content is ContactUsContent {
  return (
    content &&
    typeof content.imageUrl === 'string' &&
    typeof content.title === 'object' &&
    typeof content.subtitle === 'object' &&
    typeof content.description === 'object' &&
    typeof content.formTitle === 'object' &&
    typeof content.adminEmail === 'string'
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
    case SectionType.PRESIDENT:
      return {} as CustomContent;
    case SectionType.BLOGS:
      return {
        title: { ar: 'أحدث المقالات', en: 'Latest Blogs' },
        description: {
          ar: 'ابق على اطلاع بأحدث الأخبار والرؤى والإعلانات',
          en: 'Stay updated with our latest news, insights, and announcements',
        },
        showFeaturedOnly: false,
        maxItems: 6,
        showUniversityBlogs: true,
        showCollegeBlogs: true,
      } as BlogsContent;
    case SectionType.PROGRAMS_SECTION:
      return {
        title: { ar: 'البرامج الأكاديمية', en: 'Academic Programs' },
        subtitle: {
          ar: 'اكتشف برامجنا المتنوعة',
          en: 'Discover Our Diverse Programs',
        },
        description: {
          ar: 'نقدم مجموعة واسعة من البرامج الأكاديمية المصممة لتلبية احتياجات سوق العمل',
          en: 'We offer a wide range of academic programs designed to meet the needs of the job market',
        },
        buttonText: { ar: 'عرض جميع البرامج', en: 'View All Programs' },
        maxItems: 6,
      } as ProgramsSectionContent;
    case SectionType.CONTACT_US:
      return {
        imageUrl: '',
        title: { ar: 'تواصل معنا', en: 'Contact Us' },
        subtitle: {
          ar: 'نحن هنا لمساعدتك',
          en: 'We are here to help you',
        },
        description: {
          ar: 'هل لديك سؤال أو تحتاج إلى مساعدة؟ لا تتردد في التواصل معنا',
          en: 'Do you have a question or need help? Feel free to contact us',
        },
        formTitle: { ar: 'أرسل لنا رسالة', en: 'Send us a message' },
        nameLabel: { ar: 'الاسم', en: 'Name' },
        emailLabel: { ar: 'البريد الإلكتروني', en: 'Email' },
        subjectLabel: { ar: 'الموضوع', en: 'Subject' },
        messageLabel: { ar: 'الرسالة', en: 'Message' },
        submitButtonText: { ar: 'إرسال الرسالة', en: 'Send Message' },
        successMessage: {
          ar: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً',
          en: 'Your message has been sent successfully. We will contact you soon',
        },
        errorMessage: {
          ar: 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى',
          en: 'An error occurred while sending the message. Please try again',
        },
        adminEmail: 'admin@university.edu',
        showContactInfo: true,
        contactInfo: {
          phone: { ar: '+1234567890', en: '+1234567890' },
          address: {
            ar: 'عنوان الجامعة، المدينة، الدولة',
            en: 'University Address, City, Country',
          },
          email: { ar: 'info@university.edu', en: 'info@university.edu' },
        },
      } as ContactUsContent;
    case SectionType.HEADER:
    case SectionType.CUSTOM:
      return {} as CustomContent;
    default:
      return {} as CustomContent;
  }
}
