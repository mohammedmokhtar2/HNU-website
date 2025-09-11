'use client';

import React from 'react';
import { Action } from '@/types/enums';
import { Resource } from '@/lib/permissions/rbac';
import { usePermissions } from '@/contexts/PermissionContext';
import { Button } from '@/components/ui/button';

// Permission Button Props
interface PermissionButtonProps {
  action: Action;
  resource: Resource;
  onClick: () => void;
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  fallback?: React.ReactNode;
  user?: any; // Target user for user-specific checks
  resourceData?: any; // Resource data for ABAC checks
  permissions?: Array<{ action: Action; resource: Resource }>;
  requireAll?: boolean;
}

// Action Button Props
interface ActionButtonProps {
  resource: Resource;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCreate?: () => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  user?: any;
  resourceData?: any;
  showLabels?: boolean;
}

// Permission Button Component
export function PermissionButton({
  action,
  resource,
  onClick,
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  className,
  fallback = null,
  user,
  resourceData,
  permissions,
  requireAll = false,
}: PermissionButtonProps) {
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

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
}

// Action Button Component (shows multiple actions)
export function ActionButton({
  resource,
  onView,
  onEdit,
  onDelete,
  onCreate,
  variant = 'outline',
  size = 'sm',
  className,
  showLabels = false,
}: ActionButtonProps) {
  const { canView, canEdit, canDelete, canCreate } = usePermissions();

  const canViewResource = canView(resource);
  const canEditResource = canEdit(resource);
  const canDeleteResource = canDelete(resource);
  const canCreateResource = canCreate(resource);

  const hasAnyPermission =
    canViewResource ||
    canEditResource ||
    canDeleteResource ||
    canCreateResource;

  if (!hasAnyPermission) {
    return null;
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {canViewResource && onView && (
        <Button variant={variant} size={size} onClick={onView}>
          {showLabels ? 'View' : '👁️'}
        </Button>
      )}

      {canEditResource && onEdit && (
        <Button variant={variant} size={size} onClick={onEdit}>
          {showLabels ? 'Edit' : '✏️'}
        </Button>
      )}

      {canCreateResource && onCreate && (
        <Button variant={variant} size={size} onClick={onCreate}>
          {showLabels ? 'Create' : '➕'}
        </Button>
      )}

      {canDeleteResource && onDelete && (
        <Button variant='destructive' size={size} onClick={onDelete}>
          {showLabels ? 'Delete' : '🗑️'}
        </Button>
      )}
    </div>
  );
}

// Specific Action Buttons
export function ViewButton({
  resource,
  onClick,
  children = 'View',
  ...props
}: {
  resource: Resource;
  onClick: () => void;
  children?: React.ReactNode;
} & Omit<PermissionButtonProps, 'action' | 'children' | 'onClick'>) {
  return (
    <PermissionButton
      action={Action.VIEW}
      resource={resource}
      onClick={onClick}
      {...props}
    >
      {children}
    </PermissionButton>
  );
}

export function EditButton({
  resource,
  onClick,
  children = 'Edit',
  ...props
}: {
  resource: Resource;
  onClick: () => void;
  children?: React.ReactNode;
} & Omit<PermissionButtonProps, 'action' | 'children' | 'onClick'>) {
  return (
    <PermissionButton
      action={Action.EDIT}
      resource={resource}
      onClick={onClick}
      {...props}
    >
      {children}
    </PermissionButton>
  );
}

export function DeleteButton({
  resource,
  onClick,
  children = 'Delete',
  ...props
}: {
  resource: Resource;
  onClick: () => void;
  children?: React.ReactNode;
} & Omit<PermissionButtonProps, 'action' | 'children' | 'onClick'>) {
  return (
    <PermissionButton
      action={Action.DELETE}
      resource={resource}
      onClick={onClick}
      variant='destructive'
      {...props}
    >
      {children}
    </PermissionButton>
  );
}

export function CreateButton({
  resource,
  onClick,
  children = 'Create',
  ...props
}: {
  resource: Resource;
  onClick: () => void;
  children?: React.ReactNode;
} & Omit<PermissionButtonProps, 'action' | 'children' | 'onClick'>) {
  return (
    <PermissionButton
      action={Action.CREATE}
      resource={resource}
      onClick={onClick}
      {...props}
    >
      {children}
    </PermissionButton>
  );
}

// User Management Buttons
export function ManageUserButton({
  targetUser,
  onEdit,
  onDelete,
  ...props
}: {
  targetUser: any;
  onEdit?: () => void;
  onDelete?: () => void;
} & Omit<ActionButtonProps, 'resource' | 'onView' | 'onCreate'>) {
  return (
    <ActionButton
      resource={Resource.USER}
      onEdit={onEdit}
      onDelete={onDelete}
      user={targetUser}
      resourceData={targetUser}
      {...props}
    />
  );
}

// College Management Buttons
export function ManageCollegeButton({
  college,
  onView,
  onEdit,
  onDelete,
  ...props
}: {
  college: any;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
} & Omit<ActionButtonProps, 'resource' | 'onCreate'>) {
  return (
    <ActionButton
      resource={Resource.COLLEGE}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      resourceData={college}
      {...props}
    />
  );
}

// Section Management Buttons
export function ManageSectionButton({
  section,
  onView,
  onEdit,
  onDelete,
  ...props
}: {
  section: any;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
} & Omit<ActionButtonProps, 'resource' | 'onCreate'>) {
  return (
    <ActionButton
      resource={Resource.SECTION}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      resourceData={section}
      {...props}
    />
  );
}
