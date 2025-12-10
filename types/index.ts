// Export all enums
export * from './enums';

// Export all model types
export * from './user';
export * from './university';
export * from './college';
export * from './section';
export * from './audit';
export * from './statistic';
export * from './permission';
export * from './page';
export * from './file';
export * from './blog';
export * from './program';
export * from './message';

// Re-export commonly used types for convenience
export type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
  UserWithRelationsResponse,
} from './user';

export type {
  University,
  CreateUniversityInput,
  UpdateUniversityInput,
  UniversityResponse,
  UniversityWithRelationsResponse,
} from './university';

export type {
  College,
  CreateCollegeInput,
  UpdateCollegeInput,
  CollegeResponse,
  CollegeWithRelationsResponse,
} from './college';

export type {
  Section,
  CreateSectionInput,
  UpdateSectionInput,
  SectionResponse,
  SectionWithRelationsResponse,
} from './section';

export type {
  AuditLog,
  CreateAuditLogInput,
  AuditLogResponse,
  AuditLogWithRelationsResponse,
} from './audit';

export type {
  Statistic,
  CreateStatisticInput,
  UpdateStatisticInput,
  StatisticResponse,
  StatisticWithRelationsResponse,
} from './statistic';

export type {
  Permission,
  CreatePermissionInput,
  UpdatePermissionInput,
  PermissionResponse,
  PermissionWithRelationsResponse,
} from './permission';

export type {
  Page,
  CreatePageInput,
  UpdatePageInput,
  PageResponse,
  PageWithRelationsResponse,
} from './page';

export type {
  Blog,
  CreateBlogInput,
  UpdateBlogInput,
  BlogResponse,
  BlogWithRelationsResponse,
  BlogQueryParams,
  PaginatedBlogResponse,
  BlogStats,
} from './blog';

export type {
  Program,
  CreateProgramInput,
  UpdateProgramInput,
  ProgramResponse,
  ProgramWithRelationsResponse,
  ProgramQueryParams,
  PaginatedProgramResponse,
  ProgramStats,
} from './program';

export type {
  Message,
  MessageConfig,
  CreateMessageInput,
  UpdateMessageInput,
  MessageQueryParams,
  MessageResponse,
  MessageWithRelationsResponse,
  PaginatedMessageResponse,
  MessageStats,
  UnreadMessagesCount,
  MessageServiceResponse,
} from './message';
