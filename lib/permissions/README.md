# RBAC & ABAC Permission System

A comprehensive Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) system for the HNU Official Website admin panel.

## 🏗️ Architecture

### RBAC (Role-Based Access Control)
- **Roles**: GUEST, ADMIN, SUPERADMIN, OWNER
- **Resources**: USER, UNIVERSITY, COLLEGE, SECTION, STATISTIC, AUDIT_LOG, PERMISSION, DASHBOARD, SETTINGS
- **Actions**: VIEW, EDIT, DELETE, CREATE
- **Hierarchy**: GUEST < ADMIN < SUPERADMIN < OWNER

### ABAC (Attribute-Based Access Control)
- **User Attributes**: ID, role, email, collegeId, universityId, createdAt, isActive
- **Resource Attributes**: ID, type, ownerId, collegeId, universityId, isPublic, createdAt, updatedAt
- **Environment Attributes**: time, ipAddress, userAgent, location
- **Policies**: Configurable rules with conditions and effects

## 📁 File Structure

```
lib/permissions/
├── rbac.ts              # RBAC system implementation
├── abac.ts              # ABAC system implementation
├── utils.ts             # Utility functions
└── README.md            # This documentation

contexts/
└── PermissionContext.tsx # React context for permissions

hooks/
└── use-permissions.ts   # Custom hooks for permission checks

components/permissions/
├── PermissionGuard.tsx  # Guard components
├── PermissionButton.tsx # Button components
└── index.ts            # Exports
```

## 🚀 Quick Start

### 1. Setup Permission Provider

```tsx
// app/layout.tsx or your root component
import { PermissionProvider } from '@/contexts/PermissionContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionProvider
      initialUser={user}
      initialPermissions={permissions}
    >
      {children}
    </PermissionProvider>
  );
}
```

### 2. Use Permission Hooks

```tsx
// In your components
import { usePermissions, usePermissionChecks } from '@/hooks/use-permissions';

function MyComponent() {
  const { hasPermission, canEdit, isAdmin } = usePermissions();
  const { canManageUsers, canAccessDashboard } = usePermissionChecks();

  // Check specific permissions
  if (hasPermission(Action.EDIT, Resource.USER)) {
    // User can edit users
  }

  // Check role
  if (isAdmin()) {
    // User is admin or higher
  }

  // Check specific capabilities
  if (canManageUsers()) {
    // User can manage users
  }
}
```

### 3. Use Permission Guards

```tsx
import { PermissionGuard, CanEdit, AdminOnly } from '@/components/permissions';

function UserManagement() {
  return (
    <div>
      {/* Basic permission guard */}
      <PermissionGuard action={Action.EDIT} resource={Resource.USER}>
        <EditUserForm />
      </PermissionGuard>

      {/* Specific permission guards */}
      <CanEdit resource={Resource.COLLEGE}>
        <EditCollegeForm />
      </CanEdit>

      {/* Role-based guards */}
      <AdminOnly>
        <AdminPanel />
      </AdminOnly>
    </div>
  );
}
```

### 4. Use Permission Buttons

```tsx
import { PermissionButton, ActionButton, EditButton } from '@/components/permissions';

function UserCard({ user }) {
  return (
    <div>
      <h3>{user.name}</h3>
      
      {/* Single action button */}
      <EditButton
        resource={Resource.USER}
        onClick={() => editUser(user.id)}
        user={user}
      />

      {/* Multiple action buttons */}
      <ActionButton
        resource={Resource.USER}
        onView={() => viewUser(user.id)}
        onEdit={() => editUser(user.id)}
        onDelete={() => deleteUser(user.id)}
        user={user}
        resourceData={user}
      />
    </div>
  );
}
```

## 🔧 API Reference

### RBAC System

#### RBACPermissionChecker Class

```typescript
const checker = new RBACPermissionChecker(user, permissions);

// Basic permission checks
checker.hasPermission(action, resource);
checker.hasAnyPermission(permissions);
checker.hasAllPermissions(permissions);

// Resource-specific checks
checker.canCreate(resource);
checker.canEdit(resource);
checker.canView(resource);
checker.canDelete(resource);

// User management
checker.canManageUser(targetUser);
checker.canPerformAction(action, resource, targetUser);

// Utility methods
checker.getAllPermissions();
checker.getRoleLevel();
```

#### Utility Functions

```typescript
import { hasPermission, canManageUser, createPermissionChecker } from '@/lib/permissions/rbac';

// Quick permission checks
hasPermission(user, Action.EDIT, Resource.USER, permissions);
canManageUser(user, targetUser, permissions);

// Create checker instance
const checker = createPermissionChecker(user, permissions);
```

### ABAC System

#### ABACPermissionChecker Class

```typescript
const checker = new ABACPermissionChecker(policies);

// Evaluate permission
const context: ABACContext = {
  user: userAttributes,
  resource: resourceAttributes,
  environment: environmentAttributes,
  action: Action.EDIT,
  resourceType: Resource.USER,
};

const allowed = checker.evaluate(context);

// Policy management
checker.addPolicy(policy);
checker.removePolicy(policyId);
checker.getPolicies();
```

#### Utility Functions

```typescript
import { 
  createABACChecker, 
  createUserAttributes, 
  createResourceAttributes,
  createEnvironmentAttributes 
} from '@/lib/permissions/abac';

// Create ABAC context
const userAttributes = createUserAttributes(user, college, university);
const resourceAttributes = createResourceAttributes(resource, Resource.USER);
const environmentAttributes = createEnvironmentAttributes(ipAddress, userAgent);

const checker = createABACChecker(policies);
```

### React Context

#### usePermissions Hook

```typescript
const {
  // State
  user,
  userPermissions,
  isLoading,
  error,
  
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
} = usePermissions();
```

#### usePermissionChecks Hook

```typescript
const {
  // Specific permission checks
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
} = usePermissionChecks();
```

#### usePermissionUI Hook

```typescript
const {
  showCreateButton,
  showEditButton,
  showDeleteButton,
  showViewButton,
  showActionButtons,
  hideIfNoPermission,
  showIfHasAllPermissions,
} = usePermissionUI();
```

### Permission Guards

#### Basic Guards

```tsx
// Permission-based guard
<PermissionGuard 
  action={Action.EDIT} 
  resource={Resource.USER}
  fallback={<div>No permission</div>}
>
  <EditForm />
</PermissionGuard>

// Role-based guard
<RoleGuard 
  roles={['ADMIN', 'SUPERADMIN']}
  allowHigher={true}
  fallback={<div>Insufficient role</div>}
>
  <AdminContent />
</RoleGuard>

// Conditional render
<ConditionalRender 
  condition={hasPermission(Action.VIEW, Resource.DASHBOARD)}
  fallback={<div>Access denied</div>}
>
  <Dashboard />
</ConditionalRender>
```

#### Specific Guards

```tsx
// Resource-specific guards
<CanCreate resource={Resource.USER}>
  <CreateUserButton />
</CanCreate>

<CanEdit resource={Resource.COLLEGE}>
  <EditCollegeForm />
</CanEdit>

<CanView resource={Resource.AUDIT_LOG}>
  <AuditLogTable />
</CanView>

<CanDelete resource={Resource.SECTION}>
  <DeleteSectionButton />
</CanDelete>

// User management guards
<CanManageUser targetUser={user}>
  <UserManagementPanel />
</CanManageUser>

// Role-based guards
<AdminOnly>
  <AdminPanel />
</AdminOnly>

<SuperAdminOnly>
  <SuperAdminPanel />
</SuperAdminOnly>

<OwnerOnly>
  <OwnerPanel />
</OwnerOnly>

// Feature-specific guards
<CanAccessDashboard>
  <Dashboard />
</CanAccessDashboard>

<CanViewAuditLogs>
  <AuditLogs />
</CanViewAuditLogs>

<CanManageSettings>
  <Settings />
</CanManageSettings>
```

### Permission Buttons

#### Basic Buttons

```tsx
// Single action button
<PermissionButton
  action={Action.EDIT}
  resource={Resource.USER}
  onClick={() => editUser(user.id)}
  variant="outline"
  size="sm"
>
  Edit User
</PermissionButton>

// Action button group
<ActionButton
  resource={Resource.USER}
  onView={() => viewUser(user.id)}
  onEdit={() => editUser(user.id)}
  onDelete={() => deleteUser(user.id)}
  showLabels={true}
/>
```

#### Specific Buttons

```tsx
// Individual action buttons
<ViewButton resource={Resource.USER} onClick={() => viewUser(user.id)}>
  View Details
</ViewButton>

<EditButton resource={Resource.COLLEGE} onClick={() => editCollege(college.id)}>
  Edit College
</EditButton>

<DeleteButton resource={Resource.SECTION} onClick={() => deleteSection(section.id)}>
  Delete Section
</DeleteButton>

<CreateButton resource={Resource.STATISTIC} onClick={() => createStatistic()}>
  Add Statistic
</CreateButton>

// Resource-specific button groups
<ManageUserButton
  targetUser={user}
  onEdit={() => editUser(user.id)}
  onDelete={() => deleteUser(user.id)}
/>

<ManageCollegeButton
  college={college}
  onView={() => viewCollege(college.id)}
  onEdit={() => editCollege(college.id)}
  onDelete={() => deleteCollege(college.id)}
/>

<ManageSectionButton
  section={section}
  onView={() => viewSection(section.id)}
  onEdit={() => editSection(section.id)}
  onDelete={() => deleteSection(section.id)}
/>
```

## 🎯 Use Cases

### 1. Admin Panel Navigation

```tsx
function AdminSidebar() {
  const { canAccessDashboard, canManageUsers, canManageColleges, canViewAuditLogs } = usePermissionChecks();

  return (
    <nav>
      {canAccessDashboard() && (
        <Link href="/admin/dashboard">Dashboard</Link>
      )}
      {canManageUsers() && (
        <Link href="/admin/users">Users</Link>
      )}
      {canManageColleges() && (
        <Link href="/admin/colleges">Colleges</Link>
      )}
      {canViewAuditLogs() && (
        <Link href="/admin/audit-logs">Audit Logs</Link>
      )}
    </nav>
  );
}
```

### 2. User Management Table

```tsx
function UserTable({ users }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <ManageUserButton
                targetUser={user}
                onEdit={() => editUser(user.id)}
                onDelete={() => deleteUser(user.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 3. College Management

```tsx
function CollegeCard({ college }) {
  return (
    <div className="college-card">
      <h3>{college.name}</h3>
      <p>{college.description}</p>
      
      <div className="actions">
        <CanView resource={Resource.COLLEGE}>
          <Button onClick={() => viewCollege(college.id)}>
            View Details
          </Button>
        </CanView>
        
        <CanEdit resource={Resource.COLLEGE}>
          <Button onClick={() => editCollege(college.id)}>
            Edit College
          </Button>
        </CanEdit>
        
        <CanDelete resource={Resource.COLLEGE}>
          <Button 
            variant="destructive"
            onClick={() => deleteCollege(college.id)}
          >
            Delete College
          </Button>
        </CanDelete>
      </div>
    </div>
  );
}
```

### 4. Dynamic Form Fields

```tsx
function UserForm({ user, isEditing }) {
  const { canAssignRole, canEditUser } = usePermissionChecks();

  return (
    <form>
      <input name="name" defaultValue={user?.name} />
      <input name="email" defaultValue={user?.email} />
      
      {canAssignRole(user?.role) && (
        <select name="role" defaultValue={user?.role}>
          <option value="GUEST">Guest</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPERADMIN">Super Admin</option>
        </select>
      )}
      
      <CanEdit resource={Resource.USER}>
        <Button type="submit">
          {isEditing ? 'Update User' : 'Create User'}
        </Button>
      </CanEdit>
    </form>
  );
}
```

### 5. API Route Protection

```tsx
// app/api/users/[id]/route.ts
import { PermissionMiddleware } from '@/lib/permissions/utils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const userPermissions = await getUserPermissions(user.id);
  
  const checkPermission = PermissionMiddleware.createPermissionCheck(
    Action.EDIT,
    Resource.USER,
    { allowSelf: true }
  );
  
  if (!checkPermission(user, userPermissions, { targetUserId: params.id })) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Proceed with user update
}
```

## 🔒 Security Best Practices

### 1. Always Validate on Server

```typescript
// ✅ Good: Server-side validation
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const hasPermission = await checkUserPermission(user.id, Action.DELETE, Resource.USER);
  
  if (!hasPermission) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Delete user
}

// ❌ Bad: Client-side only validation
function DeleteButton({ userId }) {
  const { canDelete } = usePermissions();
  
  if (canDelete(Resource.USER)) {
    // This can be bypassed!
    return <Button onClick={() => deleteUser(userId)}>Delete</Button>;
  }
}
```

### 2. Use ABAC for Complex Rules

```typescript
// ✅ Good: ABAC for complex business rules
const policy: ABACPolicyRule = {
  id: 'college-admin-own-college',
  effect: 'ALLOW',
  conditions: [
    { attribute: 'user.role', operator: 'equals', value: UserType.ADMIN },
    { attribute: 'user.collegeId', operator: 'equals', value: 'resource.collegeId' },
    { attribute: 'action', operator: 'equals', value: Action.EDIT },
  ],
  actions: [Action.EDIT],
  resources: [Resource.COLLEGE],
  priority: 90,
};
```

### 3. Implement Audit Logging

```typescript
// ✅ Good: Log permission checks
export async function checkPermission(userId: string, action: Action, resource: Resource) {
  const hasPermission = await performPermissionCheck(userId, action, resource);
  
  // Log the check
  await auditLogger.log({
    userId,
    action: 'PERMISSION_CHECK',
    entity: 'Permission',
    metadata: { action, resource, result: hasPermission },
  });
  
  return hasPermission;
}
```

### 4. Regular Permission Audits

```typescript
// ✅ Good: Regular permission audits
export async function auditUserPermissions(userId: string) {
  const user = await getUser(userId);
  const permissions = await getUserPermissions(userId);
  
  // Check for redundant permissions
  const redundantPermissions = permissions.filter(perm => 
    PermissionUtils.hasPermissionConflict(user, perm, permissions)
  );
  
  // Check for missing permissions
  const rolePermissions = PermissionUtils.getRolePermissions(user.role);
  const missingPermissions = rolePermissions.filter(rolePerm => 
    !permissions.some(perm => 
      perm.action === rolePerm.action && perm.resource === rolePerm.resource
    )
  );
  
  return { redundantPermissions, missingPermissions };
}
```

## 🧪 Testing

### Unit Tests

```typescript
// Test RBAC permissions
describe('RBACPermissionChecker', () => {
  it('should allow admin to edit users', () => {
    const user = { id: '1', role: UserType.ADMIN, email: 'admin@test.com' };
    const checker = new RBACPermissionChecker(user, []);
    
    expect(checker.hasPermission(Action.EDIT, Resource.USER)).toBe(true);
  });
  
  it('should deny guest from editing users', () => {
    const user = { id: '1', role: UserType.GUEST, email: 'guest@test.com' };
    const checker = new RBACPermissionChecker(user, []);
    
    expect(checker.hasPermission(Action.EDIT, Resource.USER)).toBe(false);
  });
});

// Test ABAC policies
describe('ABACPermissionChecker', () => {
  it('should allow college admin to edit own college', () => {
    const context: ABACContext = {
      user: { id: '1', role: UserType.ADMIN, collegeId: 'college-1' },
      resource: { id: 'college-1', type: Resource.COLLEGE, collegeId: 'college-1' },
      environment: { time: new Date() },
      action: Action.EDIT,
      resourceType: Resource.COLLEGE,
    };
    
    const checker = new ABACPermissionChecker();
    expect(checker.evaluate(context)).toBe(true);
  });
});
```

### Integration Tests

```typescript
// Test permission context
describe('PermissionContext', () => {
  it('should provide permission methods', () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: ({ children }) => (
        <PermissionProvider initialUser={mockUser}>
          {children}
        </PermissionProvider>
      ),
    });
    
    expect(result.current.hasPermission).toBeDefined();
    expect(result.current.canEdit).toBeDefined();
    expect(result.current.isAdmin).toBeDefined();
  });
});
```

## 🚀 Performance Considerations

### 1. Memoize Permission Checks

```typescript
// ✅ Good: Memoized permission checks
const canEditUser = useMemo(() => {
  return hasPermission(Action.EDIT, Resource.USER);
}, [hasPermission]);

// ❌ Bad: Recalculated on every render
const canEditUser = hasPermission(Action.EDIT, Resource.USER);
```

### 2. Batch Permission Checks

```typescript
// ✅ Good: Batch multiple permission checks
const permissions = useMemo(() => ({
  canEdit: hasPermission(Action.EDIT, Resource.USER),
  canDelete: hasPermission(Action.DELETE, Resource.USER),
  canCreate: hasPermission(Action.CREATE, Resource.USER),
}), [hasPermission]);
```

### 3. Lazy Load Permission Data

```typescript
// ✅ Good: Lazy load permissions
const { permissions, isLoading } = usePermissions();

if (isLoading) {
  return <LoadingSpinner />;
}
```

## 🔧 Configuration

### Environment Variables

```env
# Permission system configuration
PERMISSION_CACHE_TTL=300000  # 5 minutes
PERMISSION_AUDIT_ENABLED=true
PERMISSION_STRICT_MODE=true
```

### Custom Policies

```typescript
// Add custom ABAC policies
const customPolicies: ABACPolicyRule[] = [
  {
    id: 'custom-business-hours',
    name: 'Business Hours Only',
    effect: 'ALLOW',
    conditions: [
      { attribute: 'environment.time', operator: 'greater_than', value: '09:00' },
      { attribute: 'environment.time', operator: 'less_than', value: '17:00' },
    ],
    actions: [Action.EDIT, Action.DELETE],
    resources: [Resource.USER, Resource.COLLEGE],
    priority: 50,
  },
];

const abacChecker = new ABACPermissionChecker(customPolicies);
```

## 📚 Additional Resources

- [RBAC vs ABAC Comparison](https://en.wikipedia.org/wiki/Role-based_access_control)
- [OWASP Access Control Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all permission checks are secure

## 📄 License

This permission system is part of the HNU Official Website project.
