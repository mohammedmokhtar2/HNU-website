import { z } from 'zod';

// Message Status Enum
export enum MessageStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  SCHEDULED = 'SCHEDULED',
}

// Message Type Enum
export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
}

// Message Priority Enum
export enum MessagePriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Message Config Schema
export const MessageConfigSchema = z.object({
  from: z.string().email().optional(),
  to: z.union([z.string().email(), z.array(z.string().email())]),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1),
  htmlBody: z.string().optional(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        content: z.string(), // base64 encoded
        contentType: z.string(),
      })
    )
    .optional(),
  status: z.nativeEnum(MessageStatus).default(MessageStatus.PENDING),
  type: z.nativeEnum(MessageType).default(MessageType.EMAIL),
  priority: z.nativeEnum(MessagePriority).default(MessagePriority.NORMAL),
  scheduledAt: z.string().optional(),
  retryCount: z.number().min(0).default(0),
  maxRetries: z.number().min(0).default(3),
  metadata: z.record(z.string(), z.any()).optional(),
  templateId: z.string().optional(),
  templateData: z.record(z.string(), z.any()).optional(),
});

// Base Message Model (from Prisma)
export interface Message {
  id: string;
  messageConfig: MessageConfig | null;
  createdAt: Date;
  updatedAt: Date;
}

// Message Config Type
export type MessageConfig = z.infer<typeof MessageConfigSchema>;

// Create Message Input
export const CreateMessageInputSchema = z.object({
  messageConfig: MessageConfigSchema,
});

export type CreateMessageInput = z.infer<typeof CreateMessageInputSchema>;

// Update Message Input
export const UpdateMessageInputSchema = z.object({
  messageConfig: MessageConfigSchema.partial(),
});

export type UpdateMessageInput = z.infer<typeof UpdateMessageInputSchema>;

// Message Query Parameters
export const MessageQueryParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  status: z.nativeEnum(MessageStatus).optional(),
  type: z.nativeEnum(MessageType).optional(),
  priority: z.nativeEnum(MessagePriority).optional(),
  search: z.string().optional(),
  from: z.string().email().optional(),
  to: z.string().email().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  orderBy: z
    .enum(['createdAt', 'updatedAt', 'status', 'priority'])
    .default('createdAt'),
  orderDirection: z.enum(['asc', 'desc']).default('desc'),
});

export type MessageQueryParams = z.infer<typeof MessageQueryParamsSchema>;

// Message Response Types
export interface MessageResponse {
  id: string;
  messageConfig: MessageConfig | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageWithRelationsResponse extends MessageResponse {
  // Add any relations here if needed in the future
  // This interface can be extended when relations are added
  _relations?: Record<string, any>;
}

// Paginated Message Response
export interface PaginatedMessageResponse {
  data: MessageResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Message Stats
export interface MessageStats {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  scheduled: number;
  byType: Record<MessageType, number>;
  byPriority: Record<MessagePriority, number>;
  recentActivity: {
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
}

// Email Template Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface NotificationConfig {
  id: string;
  userId: string;
  messageId: string;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

// Cron Job Types
export interface CronJobConfig {
  id: string;
  name: string;
  schedule: string; // cron expression
  isActive: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Unread Messages Count
export interface UnreadMessagesCount {
  total: number;
  byType: Record<MessageType, number>;
  byPriority: Record<MessagePriority, number>;
}

// Message Service Response
export interface MessageServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// NodeMailer Configuration
export interface NodeMailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
}

// Email Send Result
export interface EmailSendResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
  pending: string[];
  response: string;
}
