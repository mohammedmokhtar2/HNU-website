# Dynamic Permissions Management System

This system allows you to dynamically manage permissions for any new components or pages you add to your project without modifying the core permission system.

## 🚀 Features

- **Dynamic Component Registration**: Automatically register new pages/components with permissions
- **Permission Templates**: Create reusable permission templates for common patterns
- **Auto-Detection**: Automatically detect and register new admin pages
- **Role-Based Access**: Integrate with existing RBAC system
- **Real-time Management**: Manage permissions through a web interface
- **Audit Logging**: Track all permission changes

## 📁 File Structure

```
lib/permissions/
├── rbac.ts              # Core RBAC system
├── abac.ts              # Attribute-based access control
├── utils.ts             # Utility functions
├── auto-register.ts     # Dynamic component registration
└── DYNAMIC_PERMISSIONS.md # This documentation

app/api/permissions/
├── route.ts             # Main permissions API
├── [id]/route.ts        # Individual permission operations
├── [id]/toggle/route.ts # Toggle permission status
└── search.ts            # Search permissions

app/[locale]/(admin)/admin/dashboard/permissions/
└── page.tsx             # Permissions management UI

services/
└── permission.service.ts # Permission service layer

scripts/
└── init-permissions.ts  # Initialize permission templates
```

## 🔧 Setup

### 1. Initialize Permission Templates

Run the initialization script to create default permission templates:

```bash
npx tsx scripts/init-permissions.ts
```

### 2. Database Migration

Make sure to run the Prisma migration to create the new tables:

```bash
npx prisma db push
```

### 3. Access Permissions Management

Navigate to `/admin/dashboard/permissions` in your admin panel (requires Owner or SuperAdmin role).

## 🎯 Usage

### Adding a New Page/Component

#### Method 1: Automatic Registration

When you create a new admin page, the system can automatically detect and register it:

```typescript
// In your new page component
import { registerNewPage } from '@/lib/permissions/auto-register';

// Register the new page
await registerNewPage(
  'Product Management',           // Page name
  'PRODUCT',                     // Resource identifier
  '/admin/products',             // Route path
  'Content Management',          // Category
  [Action.VIEW, Action.CREATE, Action.EDIT, Action.DELETE], // Actions
  'Package'                      // Icon name
);
```

#### Method 2: Manual Registration

Use the permissions management UI to manually create permission templates:

1. Go to `/admin/dashboard/permissions`
2. Click "New Template"
3. Fill in the template details
4. Save the template

#### Method 3: Programmatic Registration

```typescript
import { registerComponent } from '@/lib/permissions/auto-register';

const newComponent = {
  name: 'Order Management',
  description: 'Manage orders and transactions',
  resource: 'ORDER',
  actions: [Action.VIEW, Action.EDIT],
  category: 'E-commerce',
  icon: 'ShoppingCart',
  path: '/admin/orders',
  order: 10,
};

await registerComponent(newComponent);
```

### Using Permissions in Components

#### 1. Permission Guards

```tsx
import { PermissionGuard, CanView, CanEdit } from '@/components/permissions';
import { Resource } from '@/lib/permissions/rbac';
import { Action } from '@/types/enums';

function MyComponent() {
  return (
    <div>
      {/* Basic permission guard */}
      <PermissionGuard action={Action.VIEW} resource={Resource.PRODUCT}>
        <ProductList />
      </PermissionGuard>

      {/* Specific permission guards */}
      <CanView resource={Resource.PRODUCT}>
        <ViewProductButton />
      </CanView>

      <CanEdit resource={Resource.PRODUCT}>
        <EditProductButton />
      </CanEdit>
    </div>
  );
}
```

#### 2. Permission Hooks

```tsx
import { usePermissions } from '@/contexts/PermissionContext';
import { usePermissionChecks } from '@/hooks/use-permissions';

function MyComponent() {
  const { hasPermission, canEdit } = usePermissions();
  const { canManageProducts } = usePermissionChecks();

  if (!hasPermission(Action.VIEW, Resource.PRODUCT)) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      {canEdit(Resource.PRODUCT) && <EditButton />}
      {canManageProducts() && <ManageButton />}
    </div>
  );
}
```

#### 3. Permission Buttons

```tsx
import { ActionButton, ManageProductButton } from '@/components/permissions';

function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      
      {/* Action button group */}
      <ActionButton
        resource={Resource.PRODUCT}
        onView={() => viewProduct(product.id)}
        onEdit={() => editProduct(product.id)}
        onDelete={() => deleteProduct(product.id)}
        user={product.owner}
        resourceData={product}
      />

      {/* Or use specific button group */}
      <ManageProductButton
        product={product}
        onView={() => viewProduct(product.id)}
        onEdit={() => editProduct(product.id)}
        onDelete={() => deleteProduct(product.id)}
      />
    </div>
  );
}
```

### Managing Permissions

#### 1. Assign Permissions to Users

```typescript
import { PermissionService } from '@/services/permission.service';

// Create individual permission
await PermissionService.createPermission({
  userId: 'user123',
  action: Action.VIEW,
  resource: 'PRODUCT',
  title: 'View Products',
  description: 'Can view product listings',
});

// Bulk assign permissions
await PermissionService.assignPermissionsToUser('user123', [
  {
    userId: 'user123',
    action: Action.VIEW,
    resource: 'PRODUCT',
    title: 'View Products',
  },
  {
    userId: 'user123',
    action: Action.EDIT,
    resource: 'PRODUCT',
    title: 'Edit Products',
  },
]);
```

#### 2. Generate Permissions from Templates

```typescript
// Generate all permissions for a user from a template
await PermissionService.generatePermissionsFromTemplate('user123', 'template123');

// Copy permissions from one user to another
await PermissionService.copyPermissionsFromUser('admin123', 'user123');
```

#### 3. Search and Filter Permissions

```typescript
// Search permissions
const permissions = await PermissionService.searchPermissions('product', {
  userId: 'user123',
  resource: 'PRODUCT',
  isActive: true,
});

// Get permission analysis
const analysis = await PermissionService.getPermissionAnalysis('user123');
```

## 🔄 Auto-Detection System

The system can automatically detect new admin pages and register them with appropriate permissions:

### 1. File System Scanning

```typescript
import { autoDetectAndRegister } from '@/lib/permissions/auto-register';

// This will scan for new admin pages and register them
await autoDetectAndRegister();
```

### 2. Convention-Based Registration

The system follows these conventions:

- **Path Pattern**: `/admin/**` → Admin pages
- **Resource Naming**: Last segment of path → Resource name
- **Default Actions**: `[VIEW, CREATE, EDIT, DELETE]` for CRUD pages
- **Category**: Based on path structure

### 3. Custom Detection Rules

```typescript
// Add custom detection rules
const customRules = [
  {
    pattern: /\/admin\/reports\/.*/,
    actions: [Action.VIEW],
    category: 'Reports',
  },
  {
    pattern: /\/admin\/settings\/.*/,
    actions: [Action.VIEW, Action.EDIT],
    category: 'Settings',
  },
];
```

## 📊 Permission Templates

### Default Templates

The system comes with these default templates:

- **User Management**: Manage users and roles
- **College Management**: Manage colleges and content
- **Section Management**: Manage page sections
- **Statistics Management**: Manage analytics
- **Audit Logs**: View system activity
- **Settings**: System configuration
- **Dashboard**: Admin dashboard access

### Creating Custom Templates

```typescript
import { PermissionService } from '@/services/permission.service';

await PermissionService.createPermissionTemplate({
  name: 'Blog Management',
  description: 'Manage blog posts and articles',
  resource: 'BLOG',
  actions: [Action.VIEW, Action.CREATE, Action.EDIT, Action.DELETE],
  category: 'Content Management',
  icon: 'FileText',
  path: '/admin/blog',
  order: 15,
});
```

### Template Categories

- **User Management**: User-related permissions
- **Content Management**: Content creation and editing
- **Analytics**: Data and reporting
- **Security**: Audit and security features
- **System**: System configuration
- **Navigation**: Dashboard and navigation

## 🎨 UI Components

### Permission Management Page

The permissions management page (`/admin/dashboard/permissions`) provides:

- **Permissions Tab**: View and manage individual permissions
- **Templates Tab**: Create and manage permission templates
- **Analysis Tab**: Permission usage analytics
- **Search & Filter**: Find specific permissions
- **Bulk Operations**: Mass assign/remove permissions

### Key Features

- **Real-time Updates**: Changes reflect immediately
- **Role-based Access**: Only owners/super admins can manage permissions
- **Audit Trail**: All changes are logged
- **Export/Import**: Backup and restore permissions
- **Template Library**: Reusable permission patterns

## 🔒 Security Considerations

### 1. Access Control

- Only owners and super admins can access permissions management
- All permission changes are audited
- Sensitive operations require confirmation

### 2. Validation

- All permission inputs are validated
- Resource names must be unique
- Actions must be from predefined enum
- User IDs must exist in the system

### 3. Audit Logging

```typescript
// All permission operations are automatically logged
{
  action: 'CREATE_PERMISSION',
  entity: 'Permission',
  entityId: 'perm123',
  metadata: {
    userId: 'user123',
    resource: 'PRODUCT',
    action: 'VIEW'
  },
  userId: 'admin123',
  createdAt: '2024-01-01T00:00:00Z'
}
```

## 🚀 Advanced Features

### 1. Dynamic Resource Discovery

```typescript
// Automatically discover resources from your codebase
import { discoverResources } from '@/lib/permissions/auto-register';

const resources = await discoverResources({
  scanPaths: ['/app/admin', '/components/admin'],
  excludePatterns: ['**/*.test.*', '**/*.spec.*'],
});
```

### 2. Permission Inheritance

```typescript
// Create permission hierarchies
const parentPermission = {
  resource: 'PRODUCT',
  actions: [Action.VIEW, Action.EDIT],
};

const childPermission = {
  resource: 'PRODUCT_REVIEW',
  parentResource: 'PRODUCT',
  actions: [Action.VIEW],
};
```

### 3. Conditional Permissions

```typescript
// Permissions that depend on context
const conditionalPermission = {
  resource: 'PRODUCT',
  action: Action.EDIT,
  conditions: [
    { field: 'ownerId', operator: 'equals', value: 'user.id' },
    { field: 'status', operator: 'not_equals', value: 'ARCHIVED' },
  ],
};
```

### 4. Permission Groups

```typescript
// Group related permissions
const permissionGroup = {
  name: 'E-commerce Manager',
  permissions: [
    { resource: 'PRODUCT', actions: [Action.VIEW, Action.EDIT] },
    { resource: 'ORDER', actions: [Action.VIEW, Action.EDIT] },
    { resource: 'CUSTOMER', actions: [Action.VIEW] },
  ],
};
```

## 🧪 Testing

### Unit Tests

```typescript
// Test permission creation
describe('PermissionService', () => {
  it('should create permission successfully', async () => {
    const permission = await PermissionService.createPermission({
      userId: 'user123',
      action: Action.VIEW,
      resource: 'PRODUCT',
      title: 'View Products',
    });
    
    expect(permission).toBeDefined();
    expect(permission.resource).toBe('PRODUCT');
  });
});
```

### Integration Tests

```typescript
// Test permission guards
describe('PermissionGuard', () => {
  it('should render content when user has permission', () => {
    render(
      <PermissionProvider initialUser={mockUser}>
        <PermissionGuard action={Action.VIEW} resource={Resource.PRODUCT}>
          <div>Protected Content</div>
        </PermissionGuard>
      </PermissionProvider>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
```

## 📈 Performance

### Optimization Strategies

1. **Permission Caching**: Cache frequently accessed permissions
2. **Lazy Loading**: Load permissions only when needed
3. **Batch Operations**: Group multiple permission operations
4. **Indexing**: Database indexes on frequently queried fields

### Monitoring

```typescript
// Monitor permission system performance
const metrics = {
  permissionChecksPerSecond: 1000,
  averageCheckTime: 2.5, // ms
  cacheHitRate: 0.95,
  errorRate: 0.001,
};
```

## 🔧 Troubleshooting

### Common Issues

1. **Permission Not Working**
   - Check if permission is active
   - Verify user has the correct role
   - Check resource name spelling

2. **Template Not Creating**
   - Ensure resource name is unique
   - Check required fields are provided
   - Verify database connection

3. **Auto-Detection Not Working**
   - Check file path patterns
   - Verify component exports
   - Check console for errors

### Debug Mode

```typescript
// Enable debug logging
process.env.PERMISSION_DEBUG = 'true';

// This will log all permission checks
console.log('Permission check:', { user, action, resource, result });
```

## 📚 API Reference

### Permission Service

```typescript
class PermissionService {
  // CRUD operations
  static async getPermissions(userId?: string): Promise<Permission[]>
  static async createPermission(data: CreatePermissionInput): Promise<Permission>
  static async updatePermission(id: string, data: UpdatePermissionInput): Promise<Permission>
  static async deletePermission(id: string): Promise<void>
  
  // Bulk operations
  static async assignPermissionsToUser(userId: string, permissions: CreatePermissionInput[]): Promise<Permission[]>
  static async copyPermissionsFromUser(fromUserId: string, toUserId: string): Promise<Permission[]>
  
  // Analysis
  static async getPermissionAnalysis(userId: string): Promise<PermissionAnalysis>
  static async searchPermissions(query: string, filters?: PermissionFilters): Promise<Permission[]>
}
```

### Auto-Register

```typescript
// Component registration
async function registerComponent(registration: ComponentRegistration): Promise<void>
async function registerNewPage(name: string, resource: string, path: string, ...): Promise<void>
async function initializeDefaultTemplates(): Promise<void>

// Management
async function getRegisteredComponents(): Promise<ComponentRegistration[]>
async function updateComponentRegistration(resource: string, updates: Partial<ComponentRegistration>): Promise<void>
async function removeComponentRegistration(resource: string): Promise<void>
```

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all permission checks are secure

## 📄 License

This dynamic permissions system is part of the HNU Official Website project.
