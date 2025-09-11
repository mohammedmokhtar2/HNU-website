import { UserType, Action } from '@/types/enums';
import { User } from '@/types/user';

// Resource types that can be protected
export enum Resource {
  USER = 'USER',
  UNIVERSITY = 'UNIVERSITY',
  COLLEGE = 'COLLEGE',
  SECTION = 'SECTION',
  STATISTIC = 'STATISTIC',
  AUDIT_LOG = 'AUDIT_LOG',
  PERMISSION = 'PERMISSION',
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
}

// Permission interface
export interface Permission {
  action: Action;
  resource: Resource;
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserType, Permission[]> = {
  [UserType.GUEST]: [{ action: Action.VIEW, resource: Resource.DASHBOARD }],
  [UserType.ADMIN]: [
    { action: Action.VIEW, resource: Resource.DASHBOARD },
    { action: Action.VIEW, resource: Resource.USER },
    { action: Action.VIEW, resource: Resource.UNIVERSITY },
    { action: Action.VIEW, resource: Resource.COLLEGE },
    { action: Action.VIEW, resource: Resource.SECTION },
    { action: Action.VIEW, resource: Resource.STATISTIC },
    { action: Action.CREATE, resource: Resource.UNIVERSITY },
    { action: Action.EDIT, resource: Resource.UNIVERSITY },
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
    { action: Action.VIEW, resource: Resource.PERMISSION },
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
    { action: Action.CREATE, resource: Resource.PERMISSION },
    { action: Action.EDIT, resource: Resource.PERMISSION },
    { action: Action.DELETE, resource: Resource.PERMISSION },
  ],
  [UserType.OWNER]: [
    // Owner has all permissions
    ...Object.values(Resource).flatMap(resource =>
      Object.values(Action).map(action => ({ action, resource }))
    ),
  ],
};

// Check if a user has a specific permission
export function hasPermission(
  userRole: UserType,
  action: Action,
  resource: Resource
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

  return rolePermissions.some(
    permission =>
      permission.action === action && permission.resource === resource
  );
}

// Get all permissions for a role
export function getRolePermissions(userRole: UserType): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}

// Check if user can perform action on resource
export function canPerformAction(
  userRole: UserType,
  action: Action,
  resource: Resource
): boolean {
  return hasPermission(userRole, action, resource);
}

// Get available actions for a resource based on role
export function getAvailableActions(
  userRole: UserType,
  resource: Resource
): Action[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

  return rolePermissions
    .filter(permission => permission.resource === resource)
    .map(permission => permission.action);
}

// Check if user has any permission for a resource
export function hasAnyPermissionForResource(
  userRole: UserType,
  resource: Resource
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

  return rolePermissions.some(permission => permission.resource === resource);
}

// Check if user can view a resource
export function canView(userRole: UserType, resource: Resource): boolean {
  return hasPermission(userRole, Action.VIEW, resource);
}

// Check if user can create a resource
export function canCreate(userRole: UserType, resource: Resource): boolean {
  return hasPermission(userRole, Action.CREATE, resource);
}

// Check if user can edit a resource
export function canEdit(userRole: UserType, resource: Resource): boolean {
  return hasPermission(userRole, Action.EDIT, resource);
}

// Check if user can delete a resource
export function canDelete(userRole: UserType, resource: Resource): boolean {
  return hasPermission(userRole, Action.DELETE, resource);
}

// Check if user is owner
export function isOwner(userRole: UserType): boolean {
  return userRole === UserType.OWNER;
}

// Check if user is super admin
export function isSuperAdmin(userRole: UserType): boolean {
  return userRole === UserType.SUPERADMIN || userRole === UserType.OWNER;
}

// Check if user is admin or higher
export function isAdmin(userRole: UserType): boolean {
  return [UserType.ADMIN, UserType.SUPERADMIN, UserType.OWNER].includes(
    userRole
  );
}

// Get user role hierarchy level (higher number = more permissions)
export function getRoleLevel(userRole: UserType): number {
  const roleLevels: Record<UserType, number> = {
    [UserType.GUEST]: 0,
    [UserType.ADMIN]: 1,
    [UserType.SUPERADMIN]: 2,
    [UserType.OWNER]: 3,
  };

  return roleLevels[userRole] || 0;
}

// Check if one role is higher than another
export function isRoleHigher(role1: UserType, role2: UserType): boolean {
  return getRoleLevel(role1) > getRoleLevel(role2);
}

// Get all resources that a role can access
export function getAccessibleResources(userRole: UserType): Resource[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  const resources = new Set<Resource>();

  rolePermissions.forEach(permission => {
    resources.add(permission.resource);
  });

  return Array.from(resources);
}

// Check if user can manage users (specific permission check)
export function canManageUsers(userRole: UserType): boolean {
  return canEdit(userRole, Resource.USER) || canDelete(userRole, Resource.USER);
}

// Check if user can manage permissions (specific permission check)
export function canManagePermissions(userRole: UserType): boolean {
  return (
    canEdit(userRole, Resource.PERMISSION) ||
    canDelete(userRole, Resource.PERMISSION)
  );
}

// Check if user can view audit logs
export function canViewAuditLogs(userRole: UserType): boolean {
  return canView(userRole, Resource.AUDIT_LOG);
}

// Check if user can access admin dashboard
export function canAccessDashboard(userRole: UserType): boolean {
  return canView(userRole, Resource.DASHBOARD);
}

// Check if user can access settings
export function canAccessSettings(userRole: UserType): boolean {
  return canView(userRole, Resource.SETTINGS);
}

// Get permission summary for a role
export function getPermissionSummary(userRole: UserType): {
  totalPermissions: number;
  resources: Resource[];
  actions: Action[];
  canManageUsers: boolean;
  canManagePermissions: boolean;
  canViewAuditLogs: boolean;
  canAccessDashboard: boolean;
  canAccessSettings: boolean;
} {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  const resources = new Set<Resource>();
  const actions = new Set<Action>();

  rolePermissions.forEach(permission => {
    resources.add(permission.resource);
    actions.add(permission.action);
  });

  return {
    totalPermissions: rolePermissions.length,
    resources: Array.from(resources),
    actions: Array.from(actions),
    canManageUsers: canManageUsers(userRole),
    canManagePermissions: canManagePermissions(userRole),
    canViewAuditLogs: canViewAuditLogs(userRole),
    canAccessDashboard: canAccessDashboard(userRole),
    canAccessSettings: canAccessSettings(userRole),
  };
}

/**
 * RBAC Permission Checker Class
 *
 * A comprehensive class for checking Role-Based Access Control permissions.
 * Provides methods for basic permission checks, resource-specific checks,
 * user management, and utility functions.
 */
export class RBACPermissionChecker {
  private user: User;
  private permissions: Permission[];
  private rolePermissions: Permission[];

  constructor(user: User, permissions: Permission[] = []) {
    this.user = user;
    this.permissions = permissions;
    this.rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(action: Action, resource: Resource): boolean {
    // Check role-based permissions first
    const hasRolePermission = this.rolePermissions.some(
      permission =>
        permission.action === action && permission.resource === resource
    );

    if (hasRolePermission) return true;

    // Check custom permissions
    return this.permissions.some(
      permission =>
        permission.action === action && permission.resource === resource
    );
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission =>
      this.hasPermission(permission.action, permission.resource)
    );
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission =>
      this.hasPermission(permission.action, permission.resource)
    );
  }

  /**
   * Check if user can create a specific resource
   */
  canCreate(resource: Resource): boolean {
    return this.hasPermission(Action.CREATE, resource);
  }

  /**
   * Check if user can edit a specific resource
   */
  canEdit(resource: Resource): boolean {
    return this.hasPermission(Action.EDIT, resource);
  }

  /**
   * Check if user can view a specific resource
   */
  canView(resource: Resource): boolean {
    return this.hasPermission(Action.VIEW, resource);
  }

  /**
   * Check if user can delete a specific resource
   */
  canDelete(resource: Resource): boolean {
    return this.hasPermission(Action.DELETE, resource);
  }

  /**
   * Check if user can manage another user
   */
  canManageUser(targetUser: User): boolean {
    // Owners can manage anyone
    if (this.user.role === UserType.OWNER) {
      return true;
    }

    // Super admins can manage everyone except owners
    if (this.user.role === UserType.SUPERADMIN) {
      return targetUser.role !== UserType.OWNER;
    }

    // Admins can only manage guests
    if (this.user.role === UserType.ADMIN) {
      return targetUser.role === UserType.GUEST;
    }

    // Guests cannot manage anyone
    return false;
  }

  /**
   * Check if user can perform a specific action on a resource with target user context
   */
  canPerformAction(
    action: Action,
    resource: Resource,
    targetUser?: User
  ): boolean {
    // Basic permission check
    if (!this.hasPermission(action, resource)) {
      return false;
    }

    // If target user is provided, check management permissions
    if (targetUser && resource === Resource.USER) {
      return this.canManageUser(targetUser);
    }

    return true;
  }

  /**
   * Get all permissions for the user (role + custom)
   */
  getAllPermissions(): Permission[] {
    const allPermissions = [...this.rolePermissions];

    // Add custom permissions that don't conflict with role permissions
    this.permissions.forEach(customPerm => {
      const hasRolePermission = this.rolePermissions.some(
        rolePerm =>
          rolePerm.action === customPerm.action &&
          rolePerm.resource === customPerm.resource
      );

      if (!hasRolePermission) {
        allPermissions.push(customPerm);
      }
    });

    return allPermissions;
  }

  /**
   * Get the role level of the user
   */
  getRoleLevel(): number {
    return getRoleLevel(this.user.role);
  }

  /**
   * Get all resources the user has access to
   */
  getAccessibleResources(): Resource[] {
    const resources = new Set<Resource>();

    // Add resources from role permissions
    this.rolePermissions.forEach(permission => {
      resources.add(permission.resource);
    });

    // Add resources from custom permissions
    this.permissions.forEach(permission => {
      resources.add(permission.resource);
    });

    return Array.from(resources);
  }

  /**
   * Get all actions the user can perform on a specific resource
   */
  getActionsForResource(resource: Resource): Action[] {
    const actions = new Set<Action>();

    // Add actions from role permissions
    this.rolePermissions
      .filter(permission => permission.resource === resource)
      .forEach(permission => actions.add(permission.action));

    // Add actions from custom permissions
    this.permissions
      .filter(permission => permission.resource === resource)
      .forEach(permission => actions.add(permission.action));

    return Array.from(actions);
  }

  /**
   * Check if user has permission to manage permissions
   */
  canManagePermissions(): boolean {
    return (
      this.canEdit(Resource.PERMISSION) || this.canDelete(Resource.PERMISSION)
    );
  }

  /**
   * Get permission summary for the user
   */
  getPermissionSummary(): {
    totalPermissions: number;
    rolePermissions: number;
    customPermissions: number;
    resources: Resource[];
    actions: Action[];
  } {
    const allPermissions = this.getAllPermissions();
    const resources = new Set<Resource>();
    const actions = new Set<Action>();

    allPermissions.forEach(permission => {
      resources.add(permission.resource);
      actions.add(permission.action);
    });

    return {
      totalPermissions: allPermissions.length,
      rolePermissions: this.rolePermissions.length,
      customPermissions: this.permissions.length,
      resources: Array.from(resources),
      actions: Array.from(actions),
    };
  }

  /**
   * Check if user can access a specific feature
   */
  canAccessFeature(feature: string): boolean {
    // Map features to resources
    const featureMap: Record<string, Resource> = {
      dashboard: Resource.DASHBOARD,
      users: Resource.USER,
      colleges: Resource.COLLEGE,
      sections: Resource.SECTION,
      statistics: Resource.STATISTIC,
      'audit-logs': Resource.AUDIT_LOG,
      permissions: Resource.PERMISSION,
      settings: Resource.SETTINGS,
    };

    const resource = featureMap[feature];
    if (!resource) return false;

    return this.canView(resource);
  }

  /**
   * Check if user can perform bulk operations
   */
  canPerformBulkOperation(operation: string, resource: Resource): boolean {
    const bulkOperations = ['bulk-edit', 'bulk-delete', 'bulk-export'];

    if (!bulkOperations.includes(operation)) {
      return false;
    }

    // Check if user has edit permission for the resource
    return this.canEdit(resource);
  }

  /**
   * Check if user can export data
   */
  canExport(resource: Resource): boolean {
    return this.canView(resource);
  }

  /**
   * Check if user can import data
   */
  canImport(resource: Resource): boolean {
    return this.canCreate(resource);
  }

  /**
   * Check if user can manage system settings
   */
  canManageSettings(): boolean {
    return this.canEdit(Resource.SETTINGS);
  }

  /**
   * Check if user can view audit logs
   */
  canViewAuditLogs(): boolean {
    return this.canView(Resource.AUDIT_LOG);
  }

  /**
   * Check if user can manage audit logs
   */
  canManageAuditLogs(): boolean {
    return (
      this.canEdit(Resource.AUDIT_LOG) || this.canDelete(Resource.AUDIT_LOG)
    );
  }

  /**
   * Get user role information
   */
  getRoleInfo(): {
    role: UserType;
    level: number;
    isOwner: boolean;
    isSuperAdmin: boolean;
    isAdmin: boolean;
    isGuest: boolean;
  } {
    return {
      role: this.user.role,
      level: this.getRoleLevel(),
      isOwner: this.user.role === UserType.OWNER,
      isSuperAdmin: this.user.role === UserType.SUPERADMIN,
      isAdmin: isAdmin(this.user.role),
      isGuest: this.user.role === UserType.GUEST,
    };
  }

  /**
   * Update user permissions
   */
  updatePermissions(newPermissions: Permission[]): void {
    this.permissions = newPermissions;
  }

  /**
   * Add a permission
   */
  addPermission(permission: Permission): void {
    const existingIndex = this.permissions.findIndex(
      p => p.action === permission.action && p.resource === permission.resource
    );

    if (existingIndex >= 0) {
      this.permissions[existingIndex] = permission;
    } else {
      this.permissions.push(permission);
    }
  }

  /**
   * Remove a permission
   */
  removePermission(action: Action, resource: Resource): void {
    this.permissions = this.permissions.filter(
      p => !(p.action === action && p.resource === resource)
    );
  }

  /**
   * Check if permission exists
   */
  hasCustomPermission(action: Action, resource: Resource): boolean {
    return this.permissions.some(
      p => p.action === action && p.resource === resource
    );
  }

  /**
   * Get permissions by resource
   */
  getPermissionsByResource(resource: Resource): Permission[] {
    return this.permissions.filter(p => p.resource === resource);
  }

  /**
   * Get permissions by action
   */
  getPermissionsByAction(action: Action): Permission[] {
    return this.permissions.filter(p => p.action === action);
  }

  /**
   * Check if user has elevated permissions
   */
  hasElevatedPermissions(): boolean {
    return (
      this.user.role === UserType.OWNER ||
      this.user.role === UserType.SUPERADMIN
    );
  }

  /**
   * Check if user can delegate permissions
   */
  canDelegatePermissions(): boolean {
    return (
      this.user.role === UserType.OWNER ||
      this.user.role === UserType.SUPERADMIN
    );
  }

  /**
   * Check if user can revoke permissions
   */
  canRevokePermissions(): boolean {
    return (
      this.user.role === UserType.OWNER ||
      this.user.role === UserType.SUPERADMIN
    );
  }

  /**
   * Get user context for permission checks
   */
  getUserContext(): {
    userId: string;
    role: UserType;
    email: string;
    collegeId?: string;
    universityId?: string;
    isActive: boolean;
  } {
    return {
      userId: this.user.id,
      role: this.user.role,
      email: this.user.email,
      collegeId: undefined, // User type doesn't have collegeId
      universityId: undefined, // User type doesn't have universityId
      isActive: true, // User type doesn't have isActive
    };
  }
}

/**
 * Create a permission checker instance
 */
export function createPermissionChecker(
  user: User,
  permissions: Permission[] = []
): RBACPermissionChecker {
  return new RBACPermissionChecker(user, permissions);
}

/**
 * Quick permission check function (with user object)
 */
export function hasPermissionWithUser(
  user: User,
  action: Action,
  resource: Resource,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.hasPermission(action, resource);
}

/**
 * Quick user management check (with user object)
 */
export function canManageUserWithUser(
  user: User,
  targetUser: User,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.canManageUser(targetUser);
}

/**
 * Quick permission check for multiple permissions
 */
export function hasAnyPermission(
  user: User,
  permissions: Permission[],
  userPermissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, userPermissions);
  return checker.hasAnyPermission(permissions);
}

/**
 * Quick permission check for all permissions
 */
export function hasAllPermissions(
  user: User,
  permissions: Permission[],
  userPermissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, userPermissions);
  return checker.hasAllPermissions(permissions);
}

/**
 * Get user's accessible resources (with user object)
 */
export function getAccessibleResourcesWithUser(
  user: User,
  permissions: Permission[] = []
): Resource[] {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.getAccessibleResources();
}

/**
 * Get user's actions for a specific resource
 */
export function getActionsForResource(
  user: User,
  resource: Resource,
  permissions: Permission[] = []
): Action[] {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.getActionsForResource(resource);
}

/**
 * Check if user can access a feature
 */
export function canAccessFeature(
  user: User,
  feature: string,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.canAccessFeature(feature);
}

/**
 * Get user's permission summary (with user object)
 */
export function getPermissionSummaryWithUser(
  user: User,
  permissions: Permission[] = []
): {
  totalPermissions: number;
  rolePermissions: number;
  customPermissions: number;
  resources: Resource[];
  actions: Action[];
} {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.getPermissionSummary();
}

/**
 * Check if user has elevated permissions
 */
export function hasElevatedPermissions(user: User): boolean {
  return user.role === UserType.OWNER || user.role === UserType.SUPERADMIN;
}

/**
 * Check if user can delegate permissions
 */
export function canDelegatePermissions(user: User): boolean {
  return user.role === UserType.OWNER || user.role === UserType.SUPERADMIN;
}

/**
 * Check if user can revoke permissions
 */
export function canRevokePermissions(user: User): boolean {
  return user.role === UserType.OWNER || user.role === UserType.SUPERADMIN;
}

/**
 * Get user's role information
 */
export function getRoleInfo(user: User): {
  role: UserType;
  level: number;
  isOwner: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isGuest: boolean;
} {
  return {
    role: user.role,
    level: getRoleLevel(user.role),
    isOwner: user.role === UserType.OWNER,
    isSuperAdmin: user.role === UserType.SUPERADMIN,
    isAdmin: isAdmin(user.role),
    isGuest: user.role === UserType.GUEST,
  };
}

/**
 * Check if user can perform bulk operations
 */
export function canPerformBulkOperation(
  user: User,
  operation: string,
  resource: Resource,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.canPerformBulkOperation(operation, resource);
}

/**
 * Check if user can export data
 */
export function canExport(
  user: User,
  resource: Resource,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.canExport(resource);
}

/**
 * Check if user can import data
 */
export function canImport(
  user: User,
  resource: Resource,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.canImport(resource);
}

/**
 * Check if user can manage settings
 */
export function canManageSettings(
  user: User,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.canManageSettings();
}

/**
 * Check if user can view audit logs (with user object)
 */
export function canViewAuditLogsWithUser(
  user: User,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.canViewAuditLogs();
}

/**
 * Check if user can manage audit logs
 */
export function canManageAuditLogs(
  user: User,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.canManageAuditLogs();
}

/**
 * Check if user can manage permissions (with user object)
 */
export function canManagePermissionsWithUser(
  user: User,
  permissions: Permission[] = []
): boolean {
  const checker = new RBACPermissionChecker(user, permissions);
  return checker.canManagePermissions();
}

/**
 * Get user context for permission checks
 */
export function getUserContext(user: User): {
  userId: string;
  role: UserType;
  email: string;
  collegeId?: string;
  universityId?: string;
  isActive: boolean;
} {
  return {
    userId: user.id,
    role: user.role,
    email: user.email,
    collegeId: undefined, // User type doesn't have collegeId
    universityId: undefined, // User type doesn't have universityId
    isActive: true, // User type doesn't have isActive
  };
}
