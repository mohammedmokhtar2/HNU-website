// Simple event configuration for blogs with isEvent: true
export interface EventConfig {
  // Basic event metadata
  eventDate: Date | null;
  eventEndDate: Date | null;
  location: string | null;
  eventType: EventType;
  status: EventStatus;

  // Optional additional metadata
  metadata?: Record<string, any>;
}

export enum EventType {
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  SEMINAR = 'seminar',
  LECTURE = 'lecture',
  MEETING = 'meeting',
  EXHIBITION = 'exhibition',
  COMPETITION = 'competition',
  CELEBRATION = 'celebration',
  SPORTS = 'sports',
  CULTURAL = 'cultural',
  ACADEMIC = 'academic',
  SOCIAL = 'social',
  OTHER = 'other',
}

export enum EventStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
}

// Event configuration input for creating/updating events
export interface CreateEventConfigInput {
  eventDate?: Date | null;
  eventEndDate?: Date | null;
  location?: string | null;
  eventType?: EventType;
  status?: EventStatus;
  metadata?: Record<string, any>;
}

export interface UpdateEventConfigInput {
  eventDate?: Date | null;
  eventEndDate?: Date | null;
  location?: string | null;
  eventType?: EventType;
  status?: EventStatus;
  metadata?: Record<string, any>;
}

// Event configuration validation
export interface EventConfigValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Event configuration form data
export interface EventConfigFormData {
  eventDate: string; // ISO string for form input
  eventEndDate: string; // ISO string for form input
  location: string;
  eventType: EventType;
  status: EventStatus;
}

// Event configuration display helpers
export interface EventConfigDisplay {
  formattedDate: string;
  formattedTime: string;
  formattedDuration: string;
  locationDisplay: string;
  statusDisplay: string;
  typeDisplay: string;
}

// Event configuration constants
export const EVENT_TYPES = Object.values(EventType);
export const EVENT_STATUSES = Object.values(EventStatus);

// Event configuration validation rules
export const EVENT_CONFIG_VALIDATION_RULES = {
  eventDate: {
    required: true,
    message: 'Event date is required',
  },
  location: {
    required: true,
    minLength: 2,
    maxLength: 200,
    message: 'Location must be between 2 and 200 characters',
  },
  eventType: {
    required: true,
    message: 'Event type is required',
  },
} as const;
