// Export all enums
export * from './enums';

// Export all model types
export * from './user';
export * from './university';
export * from './college';
export * from './section';
export * from './audit';
export * from './permission';
export * from './statistic';

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
  Permission,
  CreatePermissionInput,
  UpdatePermissionInput,
  PermissionResponse,
  PermissionWithRelationsResponse,
} from './permission';

export type {
  Statistic,
  CreateStatisticInput,
  UpdateStatisticInput,
  StatisticResponse,
  StatisticWithRelationsResponse,
} from './statistic';
