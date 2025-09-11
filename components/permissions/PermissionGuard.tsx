'use client';

import React, { ReactNode } from 'react';
import { Action } from '@/types/enums';
import { Resource } from '@/lib/permissions/rbac';
import { usePermissions } from '@/contexts/PermissionContext';
import { usePermissionChecks } from '@/hooks/use-permissions';

// Permission Guard Props
interface PermissionGuardProps {
  children: ReactNode;
  action: Action;
  resource: Resource;
  fallback?: ReactNode;
  requireAll?: boolean;
  permissions?: Array<{ action: Action; resource: Resource }>;
  user?: any; // Target user for user-specific checks
  resourceData?: any; // Resource data for ABAC checks
  className?: string;
}

// Role Guard Props
interface RoleGuardProps {
  children: ReactNode;
  roles: string[];
  allowHigher?: boolean;
  fallback?: ReactNode;
  className?: string;
}

// Conditional Render Props
interface ConditionalRenderProps {
  children: ReactNode;
  condition: boolean;
  fallback?: ReactNode;
  className?: string;
}

// Permission Guard Component
export function PermissionGuard({
  children,
  action,
  resource,
  fallback = null,
  requireAll = false,
  permissions,
  user,
  resourceData,
  className,
}: PermissionGuardProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canPerformAction,
  } = usePermissions();

  const hasAccess = React.useMemo(() => {
    if (permissions) {
      return requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }

    if (user || resourceData) {
      return canPerformAction(action, resource, user, resourceData);
    }

    return hasPermission(action, resource);
  }, [
    action,
    resource,
    permissions,
    requireAll,
    user,
    resourceData,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canPerformAction,
  ]);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

// Role Guard Component
export function RoleGuard({
  children,
  roles,
  allowHigher = true,
  fallback = null,
  className,
}: RoleGuardProps) {
  const { user, getRoleLevel } = usePermissions();

  const hasAccess = React.useMemo(() => {
    if (!user) return false;

    const userRole = user.role;
    const userLevel = getRoleLevel();

    // Check if user has exact role
    if (roles.includes(userRole)) {
      return true;
    }

    // Check if user has higher role (if allowed)
    if (allowHigher) {
      const requiredLevels = roles.map(role => {
        const roleHierarchy: Record<string, number> = {
          GUEST: 0,
          ADMIN: 1,
          SUPERADMIN: 2,
          OWNER: 3,
        };
        return roleHierarchy[role] || 0;
      });

      const minRequiredLevel = Math.min(...requiredLevels);
      return userLevel > minRequiredLevel;
    }

    return false;
  }, [user, roles, allowHigher, getRoleLevel]);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

// Conditional Render Component
export function ConditionalRender({
  children,
  condition,
  fallback = null,
  className,
}: ConditionalRenderProps) {
  if (!condition) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

// Specific Permission Guards
export function CanCreate({
  children,
  resource,
  fallback = null,
  className,
}: {
  children: ReactNode;
  resource: Resource;
  fallback?: ReactNode;
  className?: string;
}) {
  const { canCreate } = usePermissions();

  if (!canCreate(resource)) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

export function CanEdit({
  children,
  resource,
  fallback = null,
  className,
}: {
  children: ReactNode;
  resource: Resource;
  fallback?: ReactNode;
  className?: string;
}) {
  const { canEdit } = usePermissions();

  if (!canEdit(resource)) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

export function CanView({
  children,
  resource,
  fallback = null,
  className,
}: {
  children: ReactNode;
  resource: Resource;
  fallback?: ReactNode;
  className?: string;
}) {
  const { canView } = usePermissions();

  if (!canView(resource)) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

export function CanDelete({
  children,
  resource,
  fallback = null,
  className,
}: {
  children: ReactNode;
  resource: Resource;
  fallback?: ReactNode;
  className?: string;
}) {
  const { canDelete } = usePermissions();

  if (!canDelete(resource)) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

// User Management Guards
export function CanManageUser({
  children,
  targetUser,
  fallback = null,
  className,
}: {
  children: ReactNode;
  targetUser: any;
  fallback?: ReactNode;
  className?: string;
}) {
  const { canManageUser } = usePermissions();

  if (!canManageUser(targetUser)) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

// Admin Panel Guards
export function AdminOnly({
  children,
  fallback = null,
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  const { isAdmin, isSuperAdmin, isOwner } = usePermissions();

  if (!isAdmin() && !isSuperAdmin() && !isOwner()) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

export function SuperAdminOnly({
  children,
  fallback = null,
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  const { isSuperAdmin, isOwner } = usePermissions();

  if (!isSuperAdmin() && !isOwner()) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

export function OwnerOnly({
  children,
  fallback = null,
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  const { isOwner } = usePermissions();

  if (!isOwner()) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

// Dashboard Guards
export function CanAccessDashboard({
  children,
  fallback = null,
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  const { canAccessDashboard } = usePermissionChecks();

  if (!canAccessDashboard()) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

// Audit Log Guards
export function CanViewAuditLogs({
  children,
  fallback = null,
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  const { canViewAuditLogs } = usePermissionChecks();

  if (!canViewAuditLogs()) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

// Settings Guards
export function CanManageSettings({
  children,
  fallback = null,
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  const { canManageSettings } = usePermissionChecks();

  if (!canManageSettings()) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}
