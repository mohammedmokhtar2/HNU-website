// Export all permission components
export * from './PermissionGuard';
export * from './PermissionButton';

// Re-export commonly used components for convenience
export {
  PermissionGuard,
  RoleGuard,
  ConditionalRender,
  CanCreate,
  CanEdit,
  CanView,
  CanDelete,
  CanManageUser,
  AdminOnly,
  SuperAdminOnly,
  OwnerOnly,
  CanAccessDashboard,
  CanViewAuditLogs,
  CanManageSettings,
} from './PermissionGuard';

export {
  PermissionButton,
  ActionButton,
  ViewButton,
  EditButton,
  DeleteButton,
  CreateButton,
  ManageUserButton,
  ManageCollegeButton,
  ManageSectionButton,
} from './PermissionButton';
