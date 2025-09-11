import { useCallback } from 'react';
import { UserType, Action } from '@/types/enums';
import type { User, Permission } from '@/types';
import { Resource } from '@/lib/permissions/rbac';
import {
  ABACContext,
  UserAttributes,
  ResourceAttributes,
  EnvironmentAttributes,
} from '@/lib/permissions/abac';
import { usePermissions } from '@/contexts/PermissionContext';

// Custom hook for specific permission checks
export function usePermissionChecks() {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canManageUser,
    canCreate,
    canEdit,
    canView,
    canDelete,
    canPerformAction,
    isOwner,
    isSuperAdmin,
    isAdmin,
    isGuest,
    getRoleLevel,
  } = usePermissions();

  // Specific permission checks for common use cases
  const canManageUsers = useCallback(() => {
    return hasPermission(Action.EDIT, Resource.USER);
  }, [hasPermission]);

  const canManageColleges = useCallback(() => {
    return hasPermission(Action.EDIT, Resource.COLLEGE);
  }, [hasPermission]);

  const canManageSections = useCallback(() => {
    return hasPermission(Action.EDIT, Resource.SECTION);
  }, [hasPermission]);

  const canManageStatistics = useCallback(() => {
    return hasPermission(Action.EDIT, Resource.STATISTIC);
  }, [hasPermission]);

  const canViewAuditLogs = useCallback(() => {
    return hasPermission(Action.VIEW, Resource.AUDIT_LOG);
  }, [hasPermission]);

  const canManageSettings = useCallback(() => {
    return hasPermission(Action.EDIT, Resource.SETTINGS);
  }, [hasPermission]);

  const canAccessDashboard = useCallback(() => {
    return hasPermission(Action.VIEW, Resource.DASHBOARD);
  }, [hasPermission]);

  // Role-based checks
  const canManageRole = useCallback(
    (targetRole: UserType) => {
      const currentLevel = getRoleLevel();
      const targetLevel = getRoleLevelForRole(targetRole);
      return currentLevel > targetLevel;
    },
    [getRoleLevel]
  );

  const canAssignRole = useCallback(
    (targetRole: UserType) => {
      if (isOwner()) return true;
      if (isSuperAdmin() && targetRole !== UserType.OWNER) return true;
      if (isAdmin() && [UserType.GUEST, UserType.ADMIN].includes(targetRole))
        return true;
      return false;
    },
    [isOwner, isSuperAdmin, isAdmin]
  );

  // Resource-specific permission checks
  const canEditUser = useCallback(
    (targetUser: User) => {
      return canManageUser(targetUser);
    },
    [canManageUser]
  );

  const canDeleteUser = useCallback(
    (targetUser: User) => {
      return canManageUser(targetUser) && canDelete(Resource.USER);
    },
    [canManageUser, canDelete]
  );

  const canEditCollege = useCallback(
    (collegeId: string, targetUser?: User) => {
      return canPerformAction(Action.EDIT, Resource.COLLEGE, targetUser, {
        id: collegeId,
      });
    },
    [canPerformAction]
  );

  const canDeleteCollege = useCallback(
    (collegeId: string, targetUser?: User) => {
      return canPerformAction(Action.DELETE, Resource.COLLEGE, targetUser, {
        id: collegeId,
      });
    },
    [canPerformAction]
  );

  const canEditSection = useCallback(
    (sectionId: string, collegeId?: string, targetUser?: User) => {
      return canPerformAction(Action.EDIT, Resource.SECTION, targetUser, {
        id: sectionId,
        collegeId,
      });
    },
    [canPerformAction]
  );

  const canDeleteSection = useCallback(
    (sectionId: string, collegeId?: string, targetUser?: User) => {
      return canPerformAction(Action.DELETE, Resource.SECTION, targetUser, {
        id: sectionId,
        collegeId,
      });
    },
    [canPerformAction]
  );

  return {
    // Basic permission checks
    canManageUsers,
    canManageColleges,
    canManageSections,
    canManageStatistics,
    canViewAuditLogs,
    canManageSettings,
    canAccessDashboard,

    // Role management
    canManageRole,
    canAssignRole,

    // Resource-specific checks
    canEditUser,
    canDeleteUser,
    canEditCollege,
    canDeleteCollege,
    canEditSection,
    canDeleteSection,

    // Role checks
    isOwner,
    isSuperAdmin,
    isAdmin,
    isGuest,
    getRoleLevel,
  };
}

// Hook for permission-based UI rendering
export function usePermissionUI() {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreate,
    canEdit,
    canView,
    canDelete,
  } = usePermissions();

  // UI permission checks
  const showCreateButton = useCallback(
    (resource: Resource) => {
      return canCreate(resource);
    },
    [canCreate]
  );

  const showEditButton = useCallback(
    (resource: Resource) => {
      return canEdit(resource);
    },
    [canEdit]
  );

  const showDeleteButton = useCallback(
    (resource: Resource) => {
      return canDelete(resource);
    },
    [canDelete]
  );

  const showViewButton = useCallback(
    (resource: Resource) => {
      return canView(resource);
    },
    [canView]
  );

  const showActionButtons = useCallback(
    (resource: Resource, actions: Action[]) => {
      return hasAnyPermission(actions.map(action => ({ action, resource })));
    },
    [hasAnyPermission]
  );

  const hideIfNoPermission = useCallback(
    (resource: Resource, action: Action) => {
      return !hasPermission(action, resource);
    },
    [hasPermission]
  );

  const showIfHasAllPermissions = useCallback(
    (permissions: Array<{ action: Action; resource: Resource }>) => {
      return hasAllPermissions(permissions);
    },
    [hasAllPermissions]
  );

  return {
    showCreateButton,
    showEditButton,
    showDeleteButton,
    showViewButton,
    showActionButtons,
    hideIfNoPermission,
    showIfHasAllPermissions,
  };
}

// Hook for ABAC context creation
export function useABACContext() {
  const { user } = usePermissions();

  const createABACContext = useCallback(
    (
      action: Action,
      resource: Resource,
      resourceData?: any,
      environmentData?: Partial<EnvironmentAttributes>
    ): ABACContext | null => {
      if (!user) return null;

      const userAttributes: UserAttributes = {
        id: user.id,
        role: user.role,
        email: user.email,
        collegeId: user.College?.[0]?.id,
        universityId: user.College?.[0]?.universityId,
        createdAt: user.createdAt,
        isActive: true,
      };

      const resourceAttributes: ResourceAttributes | undefined = resourceData
        ? {
            id: resourceData.id,
            type: resource,
            ownerId: resourceData.ownerId || resourceData.userId,
            collegeId: resourceData.collegeId || resourceData.collageId,
            universityId: resourceData.universityId,
            isPublic: resourceData.isPublic || false,
            createdAt: resourceData.createdAt,
            updatedAt: resourceData.updatedAt,
          }
        : undefined;

      const environmentAttributes: EnvironmentAttributes = {
        time: new Date(),
        ipAddress: environmentData?.ipAddress,
        userAgent: environmentData?.userAgent,
        location: environmentData?.location,
      };

      return {
        user: userAttributes,
        resource: resourceAttributes,
        environment: environmentAttributes,
        action,
        resourceType: resource,
      };
    },
    [user]
  );

  return { createABACContext };
}

// Helper function to get role level
function getRoleLevelForRole(role: UserType): number {
  const roleHierarchy: Record<UserType, number> = {
    [UserType.GUEST]: 0,
    [UserType.ADMIN]: 1,
    [UserType.SUPERADMIN]: 2,
    [UserType.OWNER]: 3,
  };
  return roleHierarchy[role];
}
