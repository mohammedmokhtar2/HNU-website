import { PageSectionType } from '@/types/enums';
import {
  HeroContentOne,
  HeroContentTwo,
  AboutContentOne,
  AboutContentTwo,
  ContactContent,
  BlogsContent,
  PresidentContent,
  StudentActivitiesContent,
  StudentUnionsContent,
  ForEgyptGroupContent,
  CustomContent,
  PageSectionContentUnion,
  OurHistoryContent,
} from '@/types/pageSections';

export function getContentForPageSectionType(
  type: PageSectionType
): PageSectionContentUnion {
  switch (type) {
    case PageSectionType.HERO1:
      return {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        imageUrl: '',
      } as HeroContentOne;

    case PageSectionType.HERO2:
      return {
        title: { ar: '', en: '' },
        backgroundImage: '',
        buttons: [],
      } as HeroContentTwo;

    case PageSectionType.ABOUT1:
      return {
        title: { ar: '', en: '' },
        subtitle: { ar: '', en: '' },
        description: { ar: '', en: '' },
        ButtonText: { ar: '', en: '' },
        ButtonUrl: '',
        imageUrl: '',
        content: { ar: '', en: '' },
      } as AboutContentOne;

    case PageSectionType.ABOUT2:
      return {
        title: { ar: '', en: '' },
        subtitle: { ar: '', en: '' },
        description: { ar: '', en: '' },
        buttons: [],
        leftTitleOne: { ar: '', en: '' },
        leftDescriptionOne: { ar: '', en: '' },
        leftTitleTwo: { ar: '', en: '' },
        leftDescriptionTwo: { ar: '', en: '' },
      } as AboutContentTwo;

    case PageSectionType.CONTACT:
      return {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        email: '',
        phone: '',
        address: { ar: '', en: '' },
        mapUrl: '',
      } as ContactContent;

    case PageSectionType.BLOGS:
      return {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        showFeatured: true,
        postsLimit: 6,
      } as BlogsContent;

    case PageSectionType.PRESIDENT:
      return {
        Name: { ar: '', en: '' },
        Role: { ar: '', en: '' },
        Title: { ar: '', en: '' },
        PresidentImageUrl: '',
        ImagesUrl: [],
        Paragraphs: [],
        PresidentParagraphs: [],
      } as PresidentContent;

    case PageSectionType.STUDENT_ACTIVITIES:
      return {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        activities: [],
      } as StudentActivitiesContent;

    case PageSectionType.STUDENT_UNIONS:
      return {
        heroSection: {
          title: { ar: '', en: '' },
          logo: '',
          bgImageUrl: '',
        },
        aboutSection: {
          title: { ar: '', en: '' },
          imageUrl: '',
          description: { ar: '', en: '' },
        },
        ourMissionSection: {
          title: { ar: '', en: '' },
          description: { ar: '', en: '' },
          imageUrl: '',
        },
        contactUsSection: {
          title: { ar: '', en: '' },
          buttonUrl: '',
          socialMediaButtons: [],
        },

        ourTeamSection: {
          title: { ar: '', en: '' },
          name: [],
          role: [],
          photo: [],
        },
      } as StudentUnionsContent;

    case PageSectionType.FOR_EGYPT_GROUP:
      return {
        heroSection: {
          title: { ar: '', en: '' },
          logo: '',
          bgImageUrl: '',
        },
        aboutSection: {
          title: { ar: '', en: '' },
          imageUrl: '',
          description: { ar: '', en: '' },
        },
        ourMissionSection: {
          title: { ar: '', en: '' },
          description: { ar: '', en: '' },
          imageUrl: '',
        },
        contactUsSection: {
          title: { ar: '', en: '' },
          buttonUrl: '',
          socialMediaButtons: [],
        },
        ourTeamSection: {
          title: { ar: '', en: '' },
          name: [],
          role: [],
          photo: [],
        },
      } as ForEgyptGroupContent;

    case PageSectionType.OUR_HISTORY:
      return {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        images: [],
        MapSectionTitle: { ar: '', en: '' },
        mapUrl: '',
      } as OurHistoryContent;

    case PageSectionType.CUSTOM:
    default:
      return {
        title: { ar: '', en: '' },
        content: { ar: '', en: '' },
        customData: {},
      } as CustomContent;
  }
}
