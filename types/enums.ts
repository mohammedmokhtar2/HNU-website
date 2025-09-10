// Enum types based on Prisma schema

export enum UserType {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  GUEST = 'GUEST',
  OWNER = 'OWNER',
}

export enum CollegeType {
  TECHNICAL = 'TECHNICAL',
  MEDICAL = 'MEDICAL',
  ARTS = 'ARTS',
  OTHER = 'OTHER',
}

export enum SectionType {
  HEADER = 'HEADER',
  HERO = 'HERO',
  ABOUT = 'ABOUT',
  COLLAGES = 'COLLAGES',
  NUMBERS = 'NUMBERS',
  STUDENT_UNION = 'STUDENT_UNION',
  EGYPT_STUDENT_GROUP = 'EGYPT_STUDENT_GROUP',
  PRESIDENT = 'PRESIDENT',
  CUSTOM = 'CUSTOM',
}

export enum Action {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  CREATE = 'CREATE',
}
