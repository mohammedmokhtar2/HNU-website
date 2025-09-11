// utils/auditLogger.ts

import { db } from '@/lib/db';

export type AuditAction =
  | 'CREATE_COLLEGE'
  | 'UPDATE_COLLEGE'
  | 'DELETE_USER'
  | 'SUBMIT_FORM'
  | 'CREATE_SECTION'
  | 'CREATE_FORM_SECTION'
  | 'CREATE_FORM_FIELD'
  | 'GET_COLLEGES'
  | 'CREATE_COLLEGE'
  | 'UPDATE_COLLEGE'
  | 'DELETE_COLLEGE'
  | 'CREATE_SECTION'
  | 'UPDATE_SECTION'
  | 'DELETE_SECTION'
  | 'DELETE_FORM_SECTION'
  | 'DELETE_FORM_FIELD'
  | 'DELETE_FORM_SUBMISSION'
  | 'DELETE_FORM_FIELD'
  | 'DELETE_FORM_SECTION'
  | 'DELETE_SECTION'
  | 'DELETE_USER'
  | 'SUBMIT_FORM'
  | 'CREATE_SECTION'
  | 'CREATE_FORM_SECTION'
  | 'CREATE_FORM_FIELD'
  | 'GET_COLLEGE_WITH_SECTIONS'
  | 'GET_COLLEGE_BY_SLUG'
  | 'CREATE_UNIVERSITY'
  | 'UPDATE_UNIVERSITY'
  | 'DELETE_UNIVERSITY'
  | 'CREATE_STATISTIC'
  | 'UPDATE_STATISTIC'
  | 'DELETE_STATISTIC'
  | 'CREATE_PERMISSION'
  | 'UPDATE_PERMISSION'
  | 'DELETE_PERMISSION'
  | 'CUSTOM'
  | `${string}_${string}`;

export async function logAction({
  action,
  userId,
  entity,
  entityId,
  metadata,
}: {
  action: AuditAction;
  userId?: string;
  entity?: string;
  entityId?: string;
  metadata?: any;
}) {
  if (action.startsWith('GET_')) {
    console.log('GET_ action detected, skipping audit log');
    return;
  }

  // Convert Clerk userId to database userId if needed
  let dbUserId = userId;
  if (userId && !userId.startsWith('cm')) {
    // This looks like a Clerk ID, find the corresponding database user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    dbUserId = user?.id || undefined;
  }

  await db.auditLog.create({
    data: {
      action,
      entity: entity || 'Unknown',
      entityId: entityId || undefined,
      userId: dbUserId,
      metadata,
    },
  });
  console.log('Audit log created with userId:', dbUserId);
}

// Example usage
// logAction({
//   action: "CREATE_COLLEGE",
//   userId: "12345",
//   entity: "College",
//   entityId: "67890",
//   metadata: { additionalInfo: "Some extra data" },
// });
