'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePermissions } from '@/contexts/PermissionContext';
import { usePermissionChecks, usePermissionUI } from '@/hooks/use-permissions';
import { Action } from '@/types/enums';
import { Resource } from '@/lib/permissions/rbac';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  Edit,
  Trash2,
  Users,
  Settings,
  AlertTriangle,
  Info,
  TestTube,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock college data for testing
const mockColleges = [
  {
    id: '1',
    name: 'College of Engineering',
    type: 'TECHNICAL',
    description: 'Engineering and technology programs',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    ownerId: 'user1',
    collegeId: 'college1',
    universityId: 'university1',
    isPublic: true,
  },
  {
    id: '2',
    name: 'College of Medicine',
    type: 'MEDICAL',
    description: 'Medical and health sciences programs',
    isActive: true,
    createdAt: '2024-01-20T10:00:00Z',
    ownerId: 'user2',
    collegeId: 'college2',
    universityId: 'university1',
    isPublic: false,
  },
  {
    id: '3',
    name: 'College of Arts',
    type: 'ARTS',
    description: 'Liberal arts and humanities programs',
    isActive: false,
    createdAt: '2024-02-01T10:00:00Z',
    ownerId: 'user1',
    collegeId: 'college3',
    universityId: 'university1',
    isPublic: true,
  },
];

export default function CollagesPage() {
  const {
    user,
    hasAnyPermission,
    hasAllPermissions,
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

  const { canManageColleges, canEditCollege, canDeleteCollege } =
    usePermissionChecks();

  const {
    showCreateButton,
    showEditButton,
    showDeleteButton,
    showViewButton,
    showActionButtons,
    hideIfNoPermission,
  } = usePermissionUI();

  const [selectedCollege, setSelectedCollege] = useState(mockColleges[0]);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [actionLog, setActionLog] = useState<string[]>([]);

  const addToActionLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  }, []);

  // Test all permission checks
  const runPermissionTests = useCallback(() => {
    const results: Record<string, boolean> = {};

    // Basic RBAC permission checks
    results['canViewColleges'] = canView(Resource.COLLEGE);
    results['canCreateColleges'] = canCreate(Resource.COLLEGE);
    results['canEditColleges'] = canEdit(Resource.COLLEGE);
    results['canDeleteColleges'] = canDelete(Resource.COLLEGE);

    // Specific permission checks
    results['canManageColleges'] = canManageColleges();

    // Multiple permission checks
    results['canViewAndEdit'] = hasAllPermissions([
      { action: Action.VIEW, resource: Resource.COLLEGE },
      { action: Action.EDIT, resource: Resource.COLLEGE },
    ]);

    results['canViewOrCreate'] = hasAnyPermission([
      { action: Action.VIEW, resource: Resource.COLLEGE },
      { action: Action.CREATE, resource: Resource.COLLEGE },
    ]);

    // Role-based checks
    results['isOwner'] = isOwner();
    results['isSuperAdmin'] = isSuperAdmin();
    results['isAdmin'] = isAdmin();
    results['isGuest'] = isGuest();

    // ABAC context-based checks
    results['canEditSelectedCollege'] = canPerformAction(
      Action.EDIT,
      Resource.COLLEGE,
      user || undefined,
      selectedCollege
    );
    results['canDeleteSelectedCollege'] = canPerformAction(
      Action.DELETE,
      Resource.COLLEGE,
      user || undefined,
      selectedCollege
    );

    // Specific college permission checks
    results['canEditCollege1'] = canEditCollege(
      selectedCollege.id,
      user || undefined
    );
    results['canDeleteCollege1'] = canDeleteCollege(
      selectedCollege.id,
      user || undefined
    );

    setTestResults(results);
    addToActionLog('Permission tests completed');
  }, [
    canView,
    canCreate,
    canEdit,
    canDelete,
    canManageColleges,
    hasAllPermissions,
    hasAnyPermission,
    isOwner,
    isSuperAdmin,
    isAdmin,
    isGuest,
    canPerformAction,
    canEditCollege,
    canDeleteCollege,
    selectedCollege,
    user,
    addToActionLog,
  ]);

  const handleAction = (action: string, collegeId: string) => {
    addToActionLog(`Attempted ${action} on college ${collegeId}`);
    toast.success(`Action: ${action} on college ${collegeId}`);
  };

  const handleCreateCollege = () => {
    if (!canCreate(Resource.COLLEGE)) {
      toast.error('You do not have permission to create colleges');
      return;
    }
    handleAction('CREATE', 'new');
  };

  const handleEditCollege = (collegeId: string) => {
    if (!canEdit(Resource.COLLEGE)) {
      toast.error('You do not have permission to edit colleges');
      return;
    }
    handleAction('EDIT', collegeId);
  };

  const handleDeleteCollege = (collegeId: string) => {
    if (!canDelete(Resource.COLLEGE)) {
      toast.error('You do not have permission to delete colleges');
      return;
    }
    handleAction('DELETE', collegeId);
  };

  const handleViewCollege = (collegeId: string) => {
    if (!canView(Resource.COLLEGE)) {
      toast.error('You do not have permission to view colleges');
      return;
    }
    handleAction('VIEW', collegeId);
  };

  useEffect(() => {
    runPermissionTests();
  }, [runPermissionTests]);

  const PermissionTestCard = ({
    title,
    testKey,
    description,
  }: {
    title: string;
    testKey: string;
    description: string;
  }) => {
    const hasPermission = testResults[testKey] ?? false;
    return (
      <Card className='w-full'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              {hasPermission ? (
                <CheckCircle className='h-5 w-5 text-green-500' />
              ) : (
                <XCircle className='h-5 w-5 text-red-500' />
              )}
              <div>
                <h4 className='font-medium'>{title}</h4>
                <p className='text-sm text-muted-foreground'>{description}</p>
              </div>
            </div>
            <Badge variant={hasPermission ? 'default' : 'secondary'}>
              {hasPermission ? 'ALLOWED' : 'DENIED'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Collages Permissions Testing
          </h1>
          <p className='text-muted-foreground'>
            Comprehensive testing interface for COLLEGE resource permissions
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className='flex items-center gap-1'>
            <TestTube className='h-3 w-3' />
            Testing Mode
          </Badge>
          <Button onClick={runPermissionTests} variant='outline'>
            <TestTube className='h-4 w-4 mr-2' />
            Run Tests
          </Button>
        </div>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Current User Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <h4 className='font-medium'>User Role</h4>
              <Badge
                variant={
                  isOwner()
                    ? 'default'
                    : isSuperAdmin()
                      ? 'secondary'
                      : 'outline'
                }
              >
                {user?.role || 'Unknown'}
              </Badge>
            </div>
            <div>
              <h4 className='font-medium'>Role Level</h4>
              <span className='text-sm text-muted-foreground'>
                {getRoleLevel()}
              </span>
            </div>
            <div>
              <h4 className='font-medium'>User ID</h4>
              <span className='text-sm text-muted-foreground font-mono'>
                {user?.id || 'Not logged in'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue='permissions' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='permissions'>Permission Tests</TabsTrigger>
          <TabsTrigger value='actions'>Action Testing</TabsTrigger>
          <TabsTrigger value='ui'>UI Permission Tests</TabsTrigger>
          <TabsTrigger value='abac'>ABAC Context Tests</TabsTrigger>
        </TabsList>

        {/* Permission Tests Tab */}
        <TabsContent value='permissions' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <PermissionTestCard
              title='Can View Colleges'
              testKey='canViewColleges'
              description='Basic VIEW permission for COLLEGE resource'
            />
            <PermissionTestCard
              title='Can Create Colleges'
              testKey='canCreateColleges'
              description='Basic CREATE permission for COLLEGE resource'
            />
            <PermissionTestCard
              title='Can Edit Colleges'
              testKey='canEditColleges'
              description='Basic EDIT permission for COLLEGE resource'
            />
            <PermissionTestCard
              title='Can Delete Colleges'
              testKey='canDeleteColleges'
              description='Basic DELETE permission for COLLEGE resource'
            />
            <PermissionTestCard
              title='Can Manage Colleges'
              testKey='canManageColleges'
              description='Specific college management permission'
            />
            <PermissionTestCard
              title='Can View AND Edit'
              testKey='canViewAndEdit'
              description='Multiple permission check (both required)'
            />
            <PermissionTestCard
              title='Can View OR Create'
              testKey='canViewOrCreate'
              description='Multiple permission check (either required)'
            />
            <PermissionTestCard
              title='Is Owner'
              testKey='isOwner'
              description='Owner role check'
            />
            <PermissionTestCard
              title='Is Super Admin'
              testKey='isSuperAdmin'
              description='Super Admin role check'
            />
            <PermissionTestCard
              title='Is Admin'
              testKey='isAdmin'
              description='Admin role check'
            />
            <PermissionTestCard
              title='Is Guest'
              testKey='isGuest'
              description='Guest role check'
            />
          </div>
        </TabsContent>

        {/* Action Testing Tab */}
        <TabsContent value='actions' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>College Actions Testing</CardTitle>
              <CardDescription>
                Test actual CRUD operations on college data
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Create Action */}
              <div className='flex items-center justify-between p-4 border rounded-lg'>
                <div className='flex items-center gap-3'>
                  <Plus className='h-5 w-5' />
                  <div>
                    <h4 className='font-medium'>Create College</h4>
                    <p className='text-sm text-muted-foreground'>
                      Test college creation permission
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCreateCollege}
                  disabled={!canCreate(Resource.COLLEGE)}
                  variant={canCreate(Resource.COLLEGE) ? 'default' : 'outline'}
                >
                  {canCreate(Resource.COLLEGE)
                    ? 'Create College'
                    : 'No Permission'}
                </Button>
              </div>

              {/* College List with Actions */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Available Colleges</h4>
                {mockColleges.map(college => (
                  <div
                    key={college.id}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <div>
                        <h5 className='font-medium'>{college.name}</h5>
                        <p className='text-sm text-muted-foreground'>
                          {college.type} • {college.description}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleViewCollege(college.id)}
                        disabled={!canView(Resource.COLLEGE)}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleEditCollege(college.id)}
                        disabled={!canEdit(Resource.COLLEGE)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleDeleteCollege(college.id)}
                        disabled={!canDelete(Resource.COLLEGE)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UI Permission Tests Tab */}
        <TabsContent value='ui' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>UI Permission Visibility Tests</CardTitle>
              <CardDescription>
                Test how UI elements are shown/hidden based on permissions
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium'>Button Visibility Tests</h4>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm'>Create Button:</span>
                      {showCreateButton(Resource.COLLEGE) ? (
                        <Badge variant='default'>VISIBLE</Badge>
                      ) : (
                        <Badge variant='secondary'>HIDDEN</Badge>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm'>Edit Button:</span>
                      {showEditButton(Resource.COLLEGE) ? (
                        <Badge variant='default'>VISIBLE</Badge>
                      ) : (
                        <Badge variant='secondary'>HIDDEN</Badge>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm'>Delete Button:</span>
                      {showDeleteButton(Resource.COLLEGE) ? (
                        <Badge variant='default'>VISIBLE</Badge>
                      ) : (
                        <Badge variant='secondary'>HIDDEN</Badge>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm'>View Button:</span>
                      {showViewButton(Resource.COLLEGE) ? (
                        <Badge variant='default'>VISIBLE</Badge>
                      ) : (
                        <Badge variant='secondary'>HIDDEN</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Action Button Combinations</h4>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm'>View + Edit:</span>
                      {showActionButtons(Resource.COLLEGE, [
                        Action.VIEW,
                        Action.EDIT,
                      ]) ? (
                        <Badge variant='default'>ANY ALLOWED</Badge>
                      ) : (
                        <Badge variant='secondary'>NONE ALLOWED</Badge>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm'>All CRUD:</span>
                      {showActionButtons(Resource.COLLEGE, [
                        Action.VIEW,
                        Action.CREATE,
                        Action.EDIT,
                        Action.DELETE,
                      ]) ? (
                        <Badge variant='default'>ANY ALLOWED</Badge>
                      ) : (
                        <Badge variant='secondary'>NONE ALLOWED</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditional UI Elements */}
              <div className='space-y-4'>
                <h4 className='font-medium'>Conditional UI Elements</h4>

                {!hideIfNoPermission(Resource.COLLEGE, Action.VIEW) && (
                  <div className='p-4 border border-green-200 bg-green-50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <Info className='h-4 w-4 text-green-600' />
                      <p className='text-sm text-green-800'>
                        This alert is only visible if you have VIEW permission
                        for COLLEGE resource.
                      </p>
                    </div>
                  </div>
                )}

                {hideIfNoPermission(Resource.COLLEGE, Action.VIEW) && (
                  <div className='p-4 border border-red-200 bg-red-50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <AlertTriangle className='h-4 w-4 text-red-600' />
                      <p className='text-sm text-red-800'>
                        This alert is only visible if you DON&apos;T have VIEW
                        permission for COLLEGE resource.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABAC Context Tests Tab */}
        <TabsContent value='abac' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>ABAC Context-Based Permission Tests</CardTitle>
              <CardDescription>
                Test permissions based on user, resource, and environment
                attributes
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium mb-2'>
                    Select College for Context Testing
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                    {mockColleges.map(college => (
                      <Button
                        key={college.id}
                        variant={
                          selectedCollege.id === college.id
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => setSelectedCollege(college)}
                        className='justify-start'
                      >
                        {college.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <PermissionTestCard
                    title='Can Edit Selected College'
                    testKey='canEditSelectedCollege'
                    description='ABAC context-based edit permission'
                  />
                  <PermissionTestCard
                    title='Can Delete Selected College'
                    testKey='canDeleteSelectedCollege'
                    description='ABAC context-based delete permission'
                  />
                  <PermissionTestCard
                    title='Can Edit College (Specific)'
                    testKey='canEditCollege1'
                    description='Specific college edit permission'
                  />
                  <PermissionTestCard
                    title='Can Delete College (Specific)'
                    testKey='canDeleteCollege1'
                    description='Specific college delete permission'
                  />
                </div>

                <div className='p-4 bg-muted rounded-lg'>
                  <h4 className='font-medium mb-2'>Selected College Context</h4>
                  <div className='text-sm space-y-1'>
                    <p>
                      <strong>ID:</strong> {selectedCollege.id}
                    </p>
                    <p>
                      <strong>Name:</strong> {selectedCollege.name}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedCollege.type}
                    </p>
                    <p>
                      <strong>Owner ID:</strong> {selectedCollege.ownerId}
                    </p>
                    <p>
                      <strong>Is Public:</strong>{' '}
                      {selectedCollege.isPublic ? 'Yes' : 'No'}
                    </p>
                    <p>
                      <strong>Is Active:</strong>{' '}
                      {selectedCollege.isActive ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Log */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Action Log
          </CardTitle>
          <CardDescription>
            Recent actions and permission checks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-1 max-h-32 overflow-y-auto'>
            {actionLog.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No actions yet</p>
            ) : (
              actionLog.map((log, index) => (
                <div
                  key={index}
                  className='text-sm font-mono text-muted-foreground'
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
