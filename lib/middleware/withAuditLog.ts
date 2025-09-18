import { NextRequest } from 'next/server';
import { AuditAction, logAction } from '@/utils/auditLogger';

type WithAuditOptions = {
  action: AuditAction;
  extract: (
    req: NextRequest,
    ...args: any[]
  ) =>
    | Promise<{
        userId?: string;
        entity?: string;
        entityId?: string;
        metadata?: any;
      }>
    | {
        userId?: string;
        entity?: string;
        entityId?: string;
        metadata?: any;
      };
};

export function withAuditLog(handler: any, options: WithAuditOptions) {
  return async (req: NextRequest, ...args: any[]) => {
    const res = await handler(req, ...args);

    // log the action
    const data = await options.extract(req, ...args);
    await logAction({
      action: options.action,
      ...data,
    });

    return res;
  };
}
