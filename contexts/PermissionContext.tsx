'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { UserType, Action } from '@/types/enums';
import type { User, Permission } from '@/types';
import { RBACPermissionChecker, Resource } from '@/lib/permissions/rbac';
import {
  ABACPermissionChecker,
  ABACContext,
  UserAttributes,
  ResourceAttributes,
  EnvironmentAttributes,
} from '@/lib/permissions/abac';
import { useUser } from './userContext';

// Type conversion utilities
type RBACPermission = {
  action: Action;
  resource: Resource;
};

// Convert Permission type to RBACPermission type
function convertToRBACPermissions(permissions: Permission[]): RBACPermission[] {
  return permissions.map(permission => ({
    action: permission.action as Action,
    resource: permission.resource as Resource,
  }));
}

// Permission State
interface PermissionState {
  user: User | null;
  userPermissions: Permission[];
  rbacPermissions: RBACPermission[];
  rbacChecker: RBACPermissionChecker | null;
  abacChecker: ABACPermissionChecker;
  isLoading: boolean;
  error: string | null;
}

// Permission Actions
type PermissionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PERMISSIONS'; payload: Permission[] }
  | { type: 'ADD_PERMISSION'; payload: Permission }
  | { type: 'REMOVE_PERMISSION'; payload: string }
  | { type: 'UPDATE_USER_ROLE'; payload: UserType }
  | { type: 'RESET' };

// Permission Context Type
interface PermissionContextType {
  // State
  user: User | null;
  userPermissions: Permission[];
  isLoading: boolean;
  error: string | null;

  // RBAC Methods
  hasPermission: (action: Action, resource: Resource) => boolean;
  hasAnyPermission: (
    permissions: Array<{ action: Action; resource: Resource }>
  ) => boolean;
  hasAllPermissions: (
    permissions: Array<{ action: Action; resource: Resource }>
  ) => boolean;
  canManageUser: (targetUser: User) => boolean;
  canCreate: (resource: Resource) => boolean;
  canEdit: (resource: Resource) => boolean;
  canView: (resource: Resource) => boolean;
  canDelete: (resource: Resource) => boolean;
  getAllPermissions: () => Array<{ action: Action; resource: Resource }>;

  // ABAC Methods
  evaluateABAC: (context: ABACContext) => boolean;
  canPerformAction: (
    action: Action,
    resource: Resource,
    targetUser?: User,
    resourceData?: any
  ) => boolean;

  // Utility Methods
  isOwner: () => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isGuest: () => boolean;
  getRoleLevel: () => number;

  // Actions
  setUser: (user: User | null) => void;
  setPermissions: (permissions: Permission[]) => void;
  addPermission: (permission: Permission) => void;
  removePermission: (permissionId: string) => void;
  updateUserRole: (role: UserType) => void;
  reset: () => void;
}

// Initial State
const initialState: PermissionState = {
  user: null,
  userPermissions: [],
  rbacPermissions: [],
  rbacChecker: null,
  abacChecker: new ABACPermissionChecker(),
  isLoading: false,
  error: null,
};

// Permission Reducer
function permissionReducer(
  state: PermissionState,
  action: PermissionAction
): PermissionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_USER':
      const newUser = action.payload;
      const rbacPermissions = convertToRBACPermissions(state.userPermissions);
      const rbacChecker = newUser
        ? new RBACPermissionChecker(newUser, rbacPermissions)
        : null;
      return {
        ...state,
        user: newUser,
        rbacPermissions,
        rbacChecker,
      };

    case 'SET_PERMISSIONS':
      const newPermissions = action.payload;
      const convertedRbacPermissions = convertToRBACPermissions(newPermissions);
      const updatedRbacChecker = state.user
        ? new RBACPermissionChecker(state.user, convertedRbacPermissions)
        : null;
      return {
        ...state,
        userPermissions: newPermissions,
        rbacPermissions: convertedRbacPermissions,
        rbacChecker: updatedRbacChecker,
      };

    case 'ADD_PERMISSION':
      const updatedPermissions = [...state.userPermissions, action.payload];
      const addedRbacPermissions = convertToRBACPermissions(updatedPermissions);
      const rbacCheckerWithNewPermission = state.user
        ? new RBACPermissionChecker(state.user, addedRbacPermissions)
        : null;
      return {
        ...state,
        userPermissions: updatedPermissions,
        rbacPermissions: addedRbacPermissions,
        rbacChecker: rbacCheckerWithNewPermission,
      };

    case 'REMOVE_PERMISSION':
      const filteredPermissions = state.userPermissions.filter(
        p => p.id !== action.payload
      );
      const filteredRbacPermissions =
        convertToRBACPermissions(filteredPermissions);
      const rbacCheckerWithoutPermission = state.user
        ? new RBACPermissionChecker(state.user, filteredRbacPermissions)
        : null;
      return {
        ...state,
        userPermissions: filteredPermissions,
        rbacPermissions: filteredRbacPermissions,
        rbacChecker: rbacCheckerWithoutPermission,
      };

    case 'UPDATE_USER_ROLE':
      if (!state.user) return state;
      const updatedUser = { ...state.user, role: action.payload };
      const rbacCheckerWithNewRole = new RBACPermissionChecker(
        updatedUser,
        state.rbacPermissions
      );
      return {
        ...state,
        user: updatedUser,
        rbacChecker: rbacCheckerWithNewRole,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// Create Context
const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

// Permission Provider Props
interface PermissionProviderProps {
  children: ReactNode;
  initialUser?: User | null;
  initialPermissions?: Permission[];
}

// Permission Provider Component
export function PermissionProvider({
  children,
  initialUser = null,
  initialPermissions = [],
}: PermissionProviderProps) {
  const { user: userContextUser, loading: userLoading } = useUser();
  const [state, dispatch] = useReducer(permissionReducer, {
    ...initialState,
    user: initialUser,
    userPermissions: initialPermissions,
    rbacPermissions: convertToRBACPermissions(initialPermissions),
    rbacChecker: initialUser
      ? new RBACPermissionChecker(
          initialUser,
          convertToRBACPermissions(initialPermissions)
        )
      : null,
  });

  // Actions
  const setUser = useCallback((user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  // Sync with UserContext
  useEffect(() => {
    if (!userLoading && userContextUser !== state.user) {
      console.log('🔄 PermissionContext: Syncing user data from UserContext', {
        userContextUser,
        currentUser: state.user,
        userLoading,
      });
      setUser(userContextUser);
    }
  }, [userContextUser, userLoading, state.user, setUser]);

  // RBAC Methods
  const hasPermission = (action: Action, resource: Resource): boolean => {
    if (!state.rbacChecker) return false;
    return state.rbacChecker.hasPermission(action, resource);
  };

  const hasAnyPermission = (
    permissions: Array<{ action: Action; resource: Resource }>
  ): boolean => {
    if (!state.rbacChecker) return false;
    return state.rbacChecker.hasAnyPermission(permissions);
  };

  const hasAllPermissions = (
    permissions: Array<{ action: Action; resource: Resource }>
  ): boolean => {
    if (!state.rbacChecker) return false;
    return state.rbacChecker.hasAllPermissions(permissions);
  };

  const canManageUser = (targetUser: User): boolean => {
    if (!state.rbacChecker) return false;
    return state.rbacChecker.canManageUser(targetUser);
  };

  const canCreate = (resource: Resource): boolean => {
    if (!state.rbacChecker) return false;
    return state.rbacChecker.canCreate(resource);
  };

  const canEdit = (resource: Resource): boolean => {
    if (!state.rbacChecker) return false;
    return state.rbacChecker.canEdit(resource);
  };

  const canView = (resource: Resource): boolean => {
    if (!state.rbacChecker) return false;
    return state.rbacChecker.canView(resource);
  };

  const canDelete = (resource: Resource): boolean => {
    if (!state.rbacChecker) return false;
    return state.rbacChecker.canDelete(resource);
  };

  const getAllPermissions = (): Array<{
    action: Action;
    resource: Resource;
  }> => {
    if (!state.rbacChecker) return [];
    return state.rbacChecker.getAllPermissions();
  };

  // ABAC Methods
  const evaluateABAC = (context: ABACContext): boolean => {
    return state.abacChecker.evaluate(context);
  };

  const canPerformAction = (
    action: Action,
    resource: Resource,
    targetUser?: User,
    resourceData?: any
  ): boolean => {
    if (!state.user) return false;

    // First check RBAC
    if (!hasPermission(action, resource)) {
      return false;
    }

    // Then check ABAC if additional context is provided
    if (targetUser || resourceData) {
      const userAttributes: UserAttributes = {
        id: state.user.id,
        role: state.user.role,
        email: state.user.email,
        collegeId: state.user.College?.[0]?.id,
        universityId: state.user.College?.[0]?.universityId,
        createdAt: state.user.createdAt,
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
        ipAddress: undefined, // You can get this from request headers
        userAgent: undefined, // You can get this from request headers
        location: undefined,
      };

      const abacContext: ABACContext = {
        user: userAttributes,
        resource: resourceAttributes,
        environment: environmentAttributes,
        action,
        resourceType: resource,
      };

      return evaluateABAC(abacContext);
    }

    return true;
  };

  // Utility Methods
  const isOwner = (): boolean => {
    const result = state.user?.role === UserType.OWNER;
    console.log('🔍 PermissionContext: isOwner() check', {
      user: state.user,
      userRole: state.user?.role,
      expectedRole: UserType.OWNER,
      result,
    });
    return result;
  };

  const isSuperAdmin = (): boolean => {
    return state.user?.role === UserType.SUPERADMIN;
  };

  const isAdmin = (): boolean => {
    return state.user?.role === UserType.ADMIN;
  };

  const isGuest = (): boolean => {
    return state.user?.role === UserType.GUEST;
  };

  const getRoleLevel = (): number => {
    if (!state.rbacChecker) return 0;
    return state.rbacChecker.getRoleLevel();
  };

  const setPermissions = useCallback((permissions: Permission[]) => {
    dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
  }, []);

  const addPermission = useCallback((permission: Permission) => {
    dispatch({ type: 'ADD_PERMISSION', payload: permission });
  }, []);

  const removePermission = useCallback((permissionId: string) => {
    dispatch({ type: 'REMOVE_PERMISSION', payload: permissionId });
  }, []);

  const updateUserRole = useCallback((role: UserType) => {
    dispatch({ type: 'UPDATE_USER_ROLE', payload: role });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const contextValue: PermissionContextType = {
    // State
    user: state.user,
    userPermissions: state.userPermissions,
    isLoading: state.isLoading,
    error: state.error,

    // RBAC Methods
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canManageUser,
    canCreate,
    canEdit,
    canView,
    canDelete,
    getAllPermissions,

    // ABAC Methods
    evaluateABAC,
    canPerformAction,

    // Utility Methods
    isOwner,
    isSuperAdmin,
    isAdmin,
    isGuest,
    getRoleLevel,

    // Actions
    setUser,
    setPermissions,
    addPermission,
    removePermission,
    updateUserRole,
    reset,
  };

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
}

// Custom Hook to use Permission Context
export function usePermissions(): PermissionContextType {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

// Export the context for advanced usage
export { PermissionContext };
