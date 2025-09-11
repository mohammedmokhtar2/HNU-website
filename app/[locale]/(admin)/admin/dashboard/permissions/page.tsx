'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePermissions } from '@/contexts/PermissionContext';
import { Action } from '@/types/enums';

import { PermissionService } from '@/services/permission.service';
import type {
  Permission,
  PermissionTemplate,
  CreatePermissionInput,
  UpdatePermissionInput,
  CreatePermissionTemplateInput,
  UpdatePermissionTemplateInput,
} from '@/types/permission';
import { UserService } from '@/services/user.service';
import type { UserResponse } from '@/types/user';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Settings,
  Users,
  Shield,
  Eye,
  EyeOff,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

// Permission Management Component
export default function PermissionsManagementPage() {
  const { isOwner, isSuperAdmin } = usePermissions();
  const queryClient = useQueryClient();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<Action | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [editingTemplate, setEditingTemplate] =
    useState<PermissionTemplate | null>(null);
  const [showCreatePermission, setShowCreatePermission] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);

  // Fetch data
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => UserService.getAllUsers({ includeCollege: true }),
  });

  const { data: permissions = [], isLoading: permissionsLoading } = useQuery({
    queryKey: [
      'permissions',
      {
        searchTerm,
        selectedUser,
        selectedResource,
        selectedAction,
        showInactive,
      },
    ],
    queryFn: () =>
      PermissionService.searchPermissions(searchTerm, {
        userId: selectedUser === 'all' ? undefined : selectedUser || undefined,
        resource:
          selectedResource === 'all'
            ? undefined
            : selectedResource || undefined,
        action:
          selectedAction === 'all' ? undefined : selectedAction || undefined,
        isActive: showInactive ? undefined : true,
      }),
  });
  console.log('permissions from the page', permissions);

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['permission-templates'],
    queryFn: () => PermissionService.getPermissionTemplates(),
  });

  const { data: availableResources } = useQuery({
    queryKey: ['available-resources'],
    queryFn: () => PermissionService.getAvailableResources(),
  });

  // Mutations
  const createPermissionMutation = useMutation({
    mutationFn: (data: CreatePermissionInput) =>
      PermissionService.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      setShowCreatePermission(false);
      toast.success('Permission created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create permission');
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionInput }) =>
      PermissionService.updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      setEditingPermission(null);
      toast.success('Permission updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update permission');
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: (id: string) => PermissionService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permission deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete permission');
    },
  });

  const togglePermissionMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      PermissionService.togglePermission(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permission toggled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to toggle permission');
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: (data: CreatePermissionTemplateInput) =>
      PermissionService.createPermissionTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permission-templates'] });
      setShowCreateTemplate(false);
      toast.success('Permission template created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create template');
    },
  });

  // Debug logging
  console.log('🔍 Permissions Page Debug Info:', {
    users,
    usersLoading,
    usersError,
    permissions,
    permissionsLoading,
    templates,
    templatesLoading,
  });

  // Check access
  if (!isOwner() && !isSuperAdmin()) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-500 mb-4'>
            Access Denied
          </h2>
          <p className='text-muted-foreground'>
            You need owner or super admin privileges to access permissions
            management.
          </p>
        </div>
      </div>
    );
  }

  const getActionBadgeColor = (action: Action) => {
    switch (action) {
      case Action.VIEW:
        return 'bg-blue-500';
      case Action.CREATE:
        return 'bg-green-500';
      case Action.EDIT:
        return 'bg-yellow-500';
      case Action.DELETE:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'USER':
        return <Users className='h-4 w-4' />;
      case 'COLLEGE':
        return <Shield className='h-4 w-4' />;
      case 'SECTION':
        return <Settings className='h-4 w-4' />;
      case 'STATISTIC':
        return <Eye className='h-4 w-4' />;
      default:
        return <Shield className='h-4 w-4' />;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Permissions Management
          </h1>
          <p className='text-muted-foreground'>
            Manage user permissions and create dynamic permission templates for
            new components.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => setShowCreateTemplate(true)}>
            <Plus className='h-4 w-4 mr-2' />
            New Template
          </Button>
          <Button onClick={() => setShowCreatePermission(true)}>
            <Plus className='h-4 w-4 mr-2' />
            New Permission
          </Button>
        </div>
      </div>

      <Tabs defaultValue='permissions' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='permissions'>Permissions</TabsTrigger>
          <TabsTrigger value='templates'>Templates</TabsTrigger>
          <TabsTrigger value='analysis'>Analysis</TabsTrigger>
        </TabsList>

        {/* Permissions Tab */}
        <TabsContent value='permissions' className='space-y-4'>
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                <div>
                  <Label htmlFor='search'>Search</Label>
                  <div className='relative'>
                    <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Input
                      id='search'
                      placeholder='Search permissions...'
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className='pl-10'
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor='user'>User</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          usersLoading ? 'Loading users...' : 'All users'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All users</SelectItem>
                      {usersLoading ? (
                        <SelectItem value='loading' disabled>
                          Loading users...
                        </SelectItem>
                      ) : usersError ? (
                        <SelectItem value='error' disabled>
                          Error loading users
                        </SelectItem>
                      ) : (
                        users.map((user: UserResponse) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name || user.email}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='resource'>Resource</Label>
                  <Select
                    value={selectedResource}
                    onValueChange={setSelectedResource}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='All resources' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All resources</SelectItem>
                      {availableResources?.resources.map(resource => (
                        <SelectItem key={resource} value={resource}>
                          {resource}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='action'>Action</Label>
                  <Select
                    value={selectedAction}
                    onValueChange={value => setSelectedAction(value as Action)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='All actions' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All actions</SelectItem>
                      {Object.values(Action).map(action => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='show-inactive'
                    checked={showInactive}
                    onCheckedChange={setShowInactive}
                  />
                  <Label htmlFor='show-inactive'>Show inactive</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions ({permissions.length})</CardTitle>
              <CardDescription>
                Manage individual user permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {permissionsLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <RefreshCw className='h-6 w-6 animate-spin' />
                  <span className='ml-2'>Loading permissions...</span>
                </div>
              ) : usersError ? (
                <div className='flex items-center justify-center py-8 text-red-500'>
                  <div className='text-center'>
                    <p className='font-medium'>Error loading users</p>
                    <p className='text-sm text-muted-foreground'>
                      {usersError instanceof Error
                        ? usersError.message
                        : 'Unknown error'}
                    </p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map(permission => {
                      const user = users.find(
                        (u: UserResponse) => u.id === permission.userId
                      );
                      return (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                                <Users className='h-4 w-4' />
                              </div>
                              <div>
                                <div className='font-medium'>
                                  {user?.name || 'Unknown'}
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  {user?.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              {getResourceIcon(permission.resource)}
                              <span className='font-medium'>
                                {permission.resource}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getActionBadgeColor(permission.action)}
                            >
                              {permission.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className='font-medium'>
                                {permission.title}
                              </div>
                              {permission.description && (
                                <div className='text-sm text-muted-foreground'>
                                  {permission.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              {permission.isActive ? (
                                <Badge
                                  variant='default'
                                  className='bg-green-500'
                                >
                                  <Eye className='h-3 w-3 mr-1' />
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant='secondary'>
                                  <EyeOff className='h-3 w-3 mr-1' />
                                  Inactive
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='text-sm text-muted-foreground'>
                              {new Date(
                                permission.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className='text-right'>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm'>
                                  <MoreHorizontal className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    setEditingPermission(permission)
                                  }
                                >
                                  <Edit className='h-4 w-4 mr-2' />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    togglePermissionMutation.mutate({
                                      id: permission.id,
                                      isActive: !permission.isActive,
                                    })
                                  }
                                >
                                  {permission.isActive ? (
                                    <>
                                      <EyeOff className='h-4 w-4 mr-2' />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Eye className='h-4 w-4 mr-2' />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    deletePermissionMutation.mutate(
                                      permission.id
                                    )
                                  }
                                  className='text-red-600'
                                >
                                  <Trash2 className='h-4 w-4 mr-2' />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value='templates' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Permission Templates</CardTitle>
              <CardDescription>
                Create and manage permission templates for new components and
                pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <RefreshCw className='h-6 w-6 animate-spin' />
                </div>
              ) : (
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {templates.map(template => (
                    <Card key={template.id}>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          {getResourceIcon(template.resource)}
                          {template.name}
                        </CardTitle>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-2'>
                          <div className='flex flex-wrap gap-1'>
                            {template.actions.map((action: Action) => (
                              <Badge
                                key={action}
                                className={getActionBadgeColor(action)}
                              >
                                {action}
                              </Badge>
                            ))}
                          </div>
                          {template.category && (
                            <Badge variant='outline'>{template.category}</Badge>
                          )}
                          {template.path && (
                            <div className='text-sm text-muted-foreground'>
                              Path: {template.path}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value='analysis' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Permission Analysis</CardTitle>
              <CardDescription>
                Analyze permission distribution and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-center py-8 text-muted-foreground'>
                Analysis features coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Permission Dialog */}
      <Dialog
        open={!!editingPermission || showCreatePermission}
        onOpenChange={() => {
          setEditingPermission(null);
          setShowCreatePermission(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPermission ? 'Edit Permission' : 'Create Permission'}
            </DialogTitle>
            <DialogDescription>
              {editingPermission
                ? 'Update permission details'
                : 'Create a new permission'}
            </DialogDescription>
          </DialogHeader>
          <PermissionForm
            permission={editingPermission}
            users={users}
            availableResources={availableResources}
            onSubmit={data => {
              if (editingPermission) {
                updatePermissionMutation.mutate({
                  id: editingPermission.id,
                  data,
                });
              } else {
                createPermissionMutation.mutate(data as CreatePermissionInput);
              }
            }}
            onCancel={() => {
              setEditingPermission(null);
              setShowCreatePermission(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Create/Edit Template Dialog */}
      <Dialog
        open={!!editingTemplate || showCreateTemplate}
        onOpenChange={() => {
          setEditingTemplate(null);
          setShowCreateTemplate(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? 'Update template details'
                : 'Create a new permission template'}
            </DialogDescription>
          </DialogHeader>
          <TemplateForm
            template={editingTemplate}
            availableResources={availableResources}
            onSubmit={data => {
              if (editingTemplate) {
                // Update template logic here
                console.log('Update template:', data);
              } else {
                createTemplateMutation.mutate(
                  data as CreatePermissionTemplateInput
                );
              }
            }}
            onCancel={() => {
              setEditingTemplate(null);
              setShowCreateTemplate(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Permission Form Component
function PermissionForm({
  permission,
  users,
  availableResources,
  onSubmit,
  onCancel,
}: {
  permission?: Permission | null;
  users: UserResponse[];
  availableResources?: { resources: string[]; actions: Action[] };
  onSubmit: (data: CreatePermissionInput | UpdatePermissionInput) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    userId: permission?.userId || 'none',
    action: permission?.action || Action.VIEW,
    resource: permission?.resource || 'none',
    title: permission?.title || '',
    description: permission?.description || '',
    isActive: permission?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (formData.userId === 'none' || formData.resource === 'none') {
      toast.error('Please select a user and resource');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='userId'>User</Label>
        <Select
          value={formData.userId}
          onValueChange={value => setFormData({ ...formData, userId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select user' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='none' disabled>
              Select a user
            </SelectItem>
            {users.length === 0 ? (
              <SelectItem value='no-users' disabled>
                No users available
              </SelectItem>
            ) : (
              users.map((user: UserResponse) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name || user.email}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor='resource'>Resource</Label>
        <Select
          value={formData.resource}
          onValueChange={value => setFormData({ ...formData, resource: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select resource' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='none' disabled>
              Select a resource
            </SelectItem>
            {availableResources?.resources.map(resource => (
              <SelectItem key={resource} value={resource}>
                {resource}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor='action'>Action</Label>
        <Select
          value={formData.action}
          onValueChange={value =>
            setFormData({ ...formData, action: value as Action })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select action' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Action).map(action => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder='Permission title'
        />
      </div>

      <div>
        <Label htmlFor='description'>Description</Label>
        <Input
          id='description'
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder='Permission description'
        />
      </div>

      <div className='flex items-center space-x-2'>
        <Switch
          id='isActive'
          checked={formData.isActive}
          onCheckedChange={checked =>
            setFormData({ ...formData, isActive: checked })
          }
        />
        <Label htmlFor='isActive'>Active</Label>
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit'>{permission ? 'Update' : 'Create'}</Button>
      </DialogFooter>
    </form>
  );
}

// Template Form Component
function TemplateForm({
  template,
  availableResources,
  onSubmit,
  onCancel,
}: {
  template?: PermissionTemplate | null;
  availableResources?: {
    resources: string[];
    actions: Action[];
    categories: string[];
  };
  onSubmit: (
    data: CreatePermissionTemplateInput | UpdatePermissionTemplateInput
  ) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    resource: template?.resource || 'none',
    actions: template?.actions || [Action.VIEW],
    category: template?.category || 'none',
    icon: template?.icon || '',
    path: template?.path || '',
    order: template?.order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (formData.resource === 'none' || formData.category === 'none') {
      toast.error('Please select a resource and category');
      return;
    }

    onSubmit(formData);
  };

  const toggleAction = (action: Action) => {
    setFormData({
      ...formData,
      actions: formData.actions.includes(action)
        ? formData.actions.filter((a: Action) => a !== action)
        : [...formData.actions, action],
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='name'>Template Name</Label>
        <Input
          id='name'
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder='e.g., User Management'
        />
      </div>

      <div>
        <Label htmlFor='description'>Description</Label>
        <Input
          id='description'
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder='Template description'
        />
      </div>

      <div>
        <Label htmlFor='resource'>Resource</Label>
        <Select
          value={formData.resource}
          onValueChange={value => setFormData({ ...formData, resource: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select resource' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='none' disabled>
              Select a resource
            </SelectItem>
            {availableResources?.resources.map(resource => (
              <SelectItem key={resource} value={resource}>
                {resource}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Actions</Label>
        <div className='flex flex-wrap gap-2 mt-2'>
          {Object.values(Action).map(action => (
            <Button
              key={action}
              type='button'
              variant={
                formData.actions.includes(action) ? 'default' : 'outline'
              }
              size='sm'
              onClick={() => toggleAction(action)}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor='category'>Category</Label>
        <Select
          value={formData.category}
          onValueChange={value => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='none' disabled>
              Select a category
            </SelectItem>
            {availableResources?.categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor='icon'>Icon</Label>
        <Input
          id='icon'
          value={formData.icon}
          onChange={e => setFormData({ ...formData, icon: e.target.value })}
          placeholder='e.g., Users, Settings'
        />
      </div>

      <div>
        <Label htmlFor='path'>Path</Label>
        <Input
          id='path'
          value={formData.path}
          onChange={e => setFormData({ ...formData, path: e.target.value })}
          placeholder='e.g., /admin/users'
        />
      </div>

      <div>
        <Label htmlFor='order'>Order</Label>
        <Input
          id='order'
          type='number'
          value={formData.order}
          onChange={e =>
            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
          }
          placeholder='Display order'
        />
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit'>{template ? 'Update' : 'Create'}</Button>
      </DialogFooter>
    </form>
  );
}
