import { UserType, Action } from '@/types/enums';
import type { User, Permission } from '@/types';
import { Resource } from './rbac';
import {
  ABACContext,
  UserAttributes,
  ResourceAttributes,
  EnvironmentAttributes,
} from './abac';

// Permission validation utilities
export class PermissionUtils {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(
    user: User,
    action: Action,
    resource: Resource,
    userPermissions: Permission[] = []
  ): boolean {
    // Owner has all permissions
    if (user.role === UserType.OWNER) {
      return true;
    }

    // Check explicit permissions
    const hasExplicitPermission = userPermissions.some(
      perm => perm.action === action && perm.resource === resource
    );

    return hasExplicitPermission;
  }

  /**
   * Check if user can perform action on another user
   */
  static canManageUser(
    currentUser: User,
    targetUser: User,
    userPermissions: Permission[] = []
  ): boolean {
    const currentUserLevel = this.getRoleLevel(currentUser.role);
    const targetUserLevel = this.getRoleLevel(targetUser.role);

    // Can only manage users with lower or equal role level
    if (currentUserLevel < targetUserLevel) {
      return false;
    }

    // Must have EDIT permission for USER resource
    return this.hasPermission(
      currentUser,
      Action.EDIT,
      Resource.USER,
      userPermissions
    );
  }

  /**
   * Get role hierarchy level
   */
  static getRoleLevel(role: UserType): number {
    const hierarchy: Record<UserType, number> = {
      [UserType.GUEST]: 0,
      [UserType.ADMIN]: 1,
      [UserType.SUPERADMIN]: 2,
      [UserType.OWNER]: 3,
    };
    return hierarchy[role];
  }

  /**
   * Check if user can assign a specific role
   */
  static canAssignRole(currentUser: User, targetRole: UserType): boolean {
    const currentLevel = this.getRoleLevel(currentUser.role);
    const targetLevel = this.getRoleLevel(targetRole);

    // Can only assign roles lower than or equal to current role
    return currentLevel >= targetLevel;
  }

  /**
   * Get all permissions for a user (role-based + explicit)
   */
  static getUserPermissions(
    user: User,
    explicitPermissions: Permission[] = []
  ): Array<{ action: Action; resource: Resource }> {
    const rolePermissions = this.getRolePermissions(user.role);
    const explicitPerms = explicitPermissions.map(perm => ({
      action: perm.action,
      resource: perm.resource as Resource,
    }));

    // Combine and deduplicate
    const allPermissions = [...rolePermissions, ...explicitPerms];
    return allPermissions.filter(
      (perm, index, self) =>
        index ===
        self.findIndex(
          p => p.action === perm.action && p.resource === perm.resource
        )
    );
  }

  /**
   * Get default permissions for a role
   */
  static getRolePermissions(
    role: UserType
  ): Array<{ action: Action; resource: Resource }> {
    const rolePermissions: Record<
      UserType,
      Array<{ action: Action; resource: Resource }>
    > = {
      [UserType.GUEST]: [{ action: Action.VIEW, resource: Resource.DASHBOARD }],
      [UserType.ADMIN]: [
        { action: Action.VIEW, resource: Resource.DASHBOARD },
        { action: Action.VIEW, resource: Resource.USER },
        { action: Action.VIEW, resource: Resource.COLLEGE },
        { action: Action.VIEW, resource: Resource.SECTION },
        { action: Action.VIEW, resource: Resource.STATISTIC },
        { action: Action.CREATE, resource: Resource.COLLEGE },
        { action: Action.EDIT, resource: Resource.COLLEGE },
        { action: Action.CREATE, resource: Resource.SECTION },
        { action: Action.EDIT, resource: Resource.SECTION },
        { action: Action.CREATE, resource: Resource.STATISTIC },
        { action: Action.EDIT, resource: Resource.STATISTIC },
      ],
      [UserType.SUPERADMIN]: [
        { action: Action.VIEW, resource: Resource.DASHBOARD },
        { action: Action.VIEW, resource: Resource.USER },
        { action: Action.VIEW, resource: Resource.UNIVERSITY },
        { action: Action.VIEW, resource: Resource.COLLEGE },
        { action: Action.VIEW, resource: Resource.SECTION },
        { action: Action.VIEW, resource: Resource.STATISTIC },
        { action: Action.VIEW, resource: Resource.AUDIT_LOG },
        { action: Action.CREATE, resource: Resource.USER },
        { action: Action.EDIT, resource: Resource.USER },
        { action: Action.CREATE, resource: Resource.UNIVERSITY },
        { action: Action.EDIT, resource: Resource.UNIVERSITY },
        { action: Action.CREATE, resource: Resource.COLLEGE },
        { action: Action.EDIT, resource: Resource.COLLEGE },
        { action: Action.DELETE, resource: Resource.COLLEGE },
        { action: Action.CREATE, resource: Resource.SECTION },
        { action: Action.EDIT, resource: Resource.SECTION },
        { action: Action.DELETE, resource: Resource.SECTION },
        { action: Action.CREATE, resource: Resource.STATISTIC },
        { action: Action.EDIT, resource: Resource.STATISTIC },
        { action: Action.DELETE, resource: Resource.STATISTIC },
      ],
      [UserType.OWNER]: [
        // Owner has all permissions
        ...Object.values(Resource).flatMap(resource =>
          Object.values(Action).map(action => ({ action, resource }))
        ),
      ],
    };

    return rolePermissions[role] || [];
  }

  /**
   * Validate permission input
   */
  static validatePermissionInput(permission: Partial<Permission>): string[] {
    const errors: string[] = [];

    if (!permission.userId) {
      errors.push('User ID is required');
    }

    if (!permission.action) {
      errors.push('Action is required');
    } else if (!Object.values(Action).includes(permission.action)) {
      errors.push('Invalid action');
    }

    if (!permission.resource) {
      errors.push('Resource is required');
    } else if (
      !Object.values(Resource).includes(permission.resource as Resource)
    ) {
      errors.push('Invalid resource');
    }

    if (!permission.title) {
      errors.push('Title is required');
    }

    return errors;
  }

  /**
   * Check if permission conflicts with role
   */
  static hasPermissionConflict(user: User, permission: Permission): boolean {
    const rolePermissions = this.getRolePermissions(user.role);
    const hasRolePermission = rolePermissions.some(
      rolePerm =>
        rolePerm.action === permission.action &&
        rolePerm.resource === permission.resource
    );

    // If user already has this permission through role, it's redundant
    return hasRolePermission;
  }

  /**
   * Get effective permissions for a user
   */
  static getEffectivePermissions(
    user: User,
    explicitPermissions: Permission[] = []
  ): Array<{
    action: Action;
    resource: Resource;
    source: 'role' | 'explicit';
  }> {
    const rolePermissions = this.getRolePermissions(user.role);
    const explicitPerms = explicitPermissions.map(perm => ({
      action: perm.action,
      resource: perm.resource as Resource,
      source: 'explicit' as const,
    }));

    const rolePerms = rolePermissions.map(perm => ({
      ...perm,
      source: 'role' as const,
    }));

    // Combine and deduplicate (explicit permissions override role permissions)
    const allPermissions = [...rolePerms, ...explicitPerms];
    const uniquePermissions = allPermissions.filter(
      (perm, index, self) =>
        index ===
        self.findIndex(
          p => p.action === perm.action && p.resource === perm.resource
        )
    );

    return uniquePermissions;
  }
}

// ABAC utility functions
export class ABACUtils {
  /**
   * Create user attributes from user data
   */
  static createUserAttributes(
    user: User,
    college?: any,
    university?: any
  ): UserAttributes {
    return {
      id: user.id,
      role: user.role,
      email: user.email,
      collegeId: college?.id,
      universityId: university?.id,
      createdAt: user.createdAt,
      isActive: true,
    };
  }

  /**
   * Create resource attributes from resource data
   */
  static createResourceAttributes(
    resource: any,
    resourceType: Resource,
    ownerId?: string
  ): ResourceAttributes {
    return {
      id: resource.id,
      type: resourceType,
      ownerId,
      collegeId: resource.collegeId || resource.collageId,
      universityId: resource.universityId,
      isPublic: resource.isPublic || false,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }

  /**
   * Create environment attributes
   */
  static createEnvironmentAttributes(
    ipAddress?: string,
    userAgent?: string,
    location?: string
  ): EnvironmentAttributes {
    return {
      time: new Date(),
      ipAddress,
      userAgent,
      location,
    };
  }

  /**
   * Create ABAC context
   */
  static createABACContext(
    user: User,
    action: Action,
    resource: Resource,
    resourceData?: any,
    environmentData?: Partial<EnvironmentAttributes>,
    college?: any,
    university?: any
  ): ABACContext {
    const userAttributes = this.createUserAttributes(user, college, university);
    const resourceAttributes = resourceData
      ? this.createResourceAttributes(resourceData, resource)
      : undefined;
    const environmentAttributes = this.createEnvironmentAttributes(
      environmentData?.ipAddress,
      environmentData?.userAgent,
      environmentData?.location
    );

    return {
      user: userAttributes,
      resource: resourceAttributes,
      environment: environmentAttributes,
      action,
      resourceType: resource,
    };
  }

  /**
   * Check if context is valid
   */
  static validateABACContext(context: ABACContext): string[] {
    const errors: string[] = [];

    if (!context.user) {
      errors.push('User attributes are required');
    } else {
      if (!context.user.id) errors.push('User ID is required');
      if (!context.user.role) errors.push('User role is required');
      if (!context.user.email) errors.push('User email is required');
    }

    if (!context.action) {
      errors.push('Action is required');
    } else if (!Object.values(Action).includes(context.action)) {
      errors.push('Invalid action');
    }

    if (!context.resourceType) {
      errors.push('Resource type is required');
    } else if (!Object.values(Resource).includes(context.resourceType)) {
      errors.push('Invalid resource type');
    }

    if (!context.environment) {
      errors.push('Environment attributes are required');
    }

    return errors;
  }
}

// Permission middleware utilities
export class PermissionMiddleware {
  /**
   * Create permission check middleware for API routes
   */
  static createPermissionCheck(
    action: Action,
    resource: Resource,
    options: {
      requireOwnership?: boolean;
      allowSelf?: boolean;
      customCheck?: (user: User, context: any) => boolean;
    } = {}
  ) {
    return (
      user: User,
      userPermissions: Permission[],
      context?: any
    ): boolean => {
      // Check basic permission
      if (
        !PermissionUtils.hasPermission(user, action, resource, userPermissions)
      ) {
        return false;
      }

      // Check ownership if required
      if (options.requireOwnership && context?.resourceOwnerId) {
        if (user.id !== context.resourceOwnerId) {
          return false;
        }
      }

      // Allow self access if specified
      if (options.allowSelf && context?.targetUserId) {
        if (user.id === context.targetUserId) {
          return true;
        }
      }

      // Custom check
      if (options.customCheck) {
        return options.customCheck(user, context);
      }

      return true;
    };
  }

  /**
   * Create role-based middleware
   */
  static createRoleCheck(
    requiredRoles: UserType[],
    allowHigher: boolean = true
  ) {
    return (user: User): boolean => {
      if (requiredRoles.includes(user.role)) {
        return true;
      }

      if (allowHigher) {
        const userLevel = PermissionUtils.getRoleLevel(user.role);
        const requiredLevel = Math.min(
          ...requiredRoles.map(role => PermissionUtils.getRoleLevel(role))
        );
        return userLevel > requiredLevel;
      }

      return false;
    };
  }
}

// Export utility functions
export const {
  hasPermission,
  canManageUser,
  getRoleLevel,
  canAssignRole,
  getUserPermissions,
  getRolePermissions,
  validatePermissionInput,
  hasPermissionConflict,
  getEffectivePermissions,
} = PermissionUtils;

export const {
  createUserAttributes,
  createResourceAttributes,
  createEnvironmentAttributes,
  createABACContext,
  validateABACContext,
} = ABACUtils;
