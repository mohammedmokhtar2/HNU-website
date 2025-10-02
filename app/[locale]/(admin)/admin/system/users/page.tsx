'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Edit,
  Crown,
  Shield,
  User as UserIcon,
  Search,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { UserService } from '@/services/user.service';
import { CollegeService } from '@/services/collage.service';
import { UserResponse } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { useAuthStatus } from '@/hooks/use-auth';
import { UserType } from '@/types/enums';

interface UserWithCollages extends UserResponse {
  College?: any[];
  _count?: {
    College: number;
  };
}

interface EditUserData {
  name: string;
  email: string;
  role: UserType;
}

function UsersPage() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { success, error, warning, info, loading } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<UserWithCollages | null>(null);
  const [editData, setEditData] = useState<EditUserData>({
    name: '',
    email: '',
    role: UserType.GUEST,
  });
  const [assigningUserToCollage, setAssigningUserToCollage] =
    useState<UserWithCollages | null>(null);
  const [selectedCollageId, setSelectedCollageId] = useState<string>('');
  const { isOwner } = useAuthStatus();

  // Fetch users with React Query
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => UserService.getUsers({ includeCollege: true }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  console.log('usersData', usersData);

  const users = usersData?.data || [];

  // // Fetch user collages with React Query
  // const {
  //     data: userCollages,
  //     isLoading: collagesLoading
  // } = useQuery({
  //     queryKey: ['user-collages', viewingUserCollages?.id],
  //     queryFn: () => CollegeService.getColleges({ createdById: viewingUserCollages?.id || '' }),
  //     enabled: !!viewingUserCollages?.id,
  //     staleTime: 1000 * 60 * 2, // 2 minutes
  // })

  // Fetching the collages to use them when moving user to collage
  const { data: allCollages, isLoading: allCollagesLoading } = useQuery({
    queryKey: ['all-collages'],
    queryFn: () => CollegeService.getColleges(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: EditUserData;
    }) => UserService.updateUser(userId, updates),
    onSuccess: data => {
      success('User updated successfully', {
        description: `${data.name} has been updated successfully`,
      });
      setEditingUser(null);
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      error('Failed to update user', {
        description:
          error.response?.data?.error ||
          'An unexpected error occurred while updating the user',
      });
    },
  });

  // Move user to collage mutation
  const moveUserToCollageMutation = useMutation({
    mutationFn: ({
      userId,
      collageId,
    }: {
      userId: string;
      collageId: string;
    }) => UserService.moveUserToCollage(userId, collageId),
    onSuccess: data => {
      success('User moved to collage successfully', {
        description: `${data.name} has been assigned to the selected college`,
      });
      setAssigningUserToCollage(null);
      setSelectedCollageId('');
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
    onError: (error: any) => {
      console.error('Error moving user to collage:', error);
      error('Failed to move user to collage', {
        description:
          error.response?.data?.error ||
          'An unexpected error occurred while assigning the user to the college',
      });
    },
  });

  // Toggle user role mutation
  const toggleUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserType }) =>
      UserService.toggleUserRole(userId, role),
    onSuccess: data => {
      success('User role updated successfully', {
        description: `${data.name}'s role has been changed to ${data.role}`,
      });
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
    onError: (error: any) => {
      console.error('Error updating user role:', error);
      error('Failed to update user role', {
        description:
          error.response?.data?.error ||
          'An unexpected error occurred while updating the user role',
      });
    },
  });

  // Handle assign user to collage
  const handleAssignToCollage = (user: UserWithCollages) => {
    setAssigningUserToCollage(user);
    setSelectedCollageId('');
  };

  // Handle move user to collage
  const handleMoveToCollage = () => {
    if (!assigningUserToCollage || !selectedCollageId) return;
    moveUserToCollageMutation.mutate({
      userId: assigningUserToCollage.id,
      collageId: selectedCollageId,
    });
  };

  // Handle role change
  const handleRoleChange = (userId: string, newRole: UserType) => {
    toggleUserRoleMutation.mutate({ userId, role: newRole });
  };

  // Filter users
  const filteredUsers = users.filter((user: UserWithCollages) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Initialize edit form
  const handleEditUser = (user: UserWithCollages) => {
    setEditingUser(user);
    setEditData({
      name: user.name || '',
      email: user.email,
      role: user.role,
    });
  };

  // Handle update user
  const handleUpdateUser = () => {
    if (!editingUser) return;
    updateUserMutation.mutate({ userId: editingUser.id, updates: editData });
  };

  const getRoleIcon = (role: UserType) => {
    switch (role) {
      case UserType.OWNER:
        return (
          <Shield className='w-5 h-5 text-white bg-gradient-to-br from-blue-600 to-blue-800 p-1 rounded-lg shadow-md' />
        );
      case UserType.SUPERADMIN:
        return (
          <Crown className='w-5 h-5 text-white bg-gradient-to-br from-yellow-500 to-yellow-700 p-1 rounded-lg shadow-md' />
        );
      case UserType.ADMIN:
        return (
          <Shield className='w-4.5 h-4.5 text-white bg-gradient-to-br from-purple-600 to-purple-800 p-1 rounded-md shadow-sm' />
        );
      case UserType.GUEST:
        return (
          <UserIcon className='w-4 h-4 text-gray-600 bg-gray-100 p-1 rounded-full' />
        );
      default:
        return (
          <UserIcon className='w-4 h-4 text-gray-400 bg-gray-50 p-1 rounded-full' />
        );
    }
  };

  const getRoleBadge = (role: UserType) => {
    switch (role) {
      case UserType.OWNER:
        return (
          <Badge variant='default' className='bg-blue-500 hover:bg-blue-600'>
            Owner
          </Badge>
        );
      case UserType.SUPERADMIN:
        return (
          <Badge
            variant='default'
            className='bg-yellow-500 hover:bg-yellow-600'
          >
            Super Admin
          </Badge>
        );
      case UserType.ADMIN:
        return <Badge variant='secondary'>Admin</Badge>;
      case UserType.GUEST:
        return <Badge variant='outline'>Guest</Badge>;
      default:
        return <Badge variant='outline'>User</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <RefreshCw className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>Failed to load users</p>
          <Button onClick={() => refetch()} variant='outline'>
            <RefreshCw className='w-4 h-4 mr-2' />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return <div>You are not authorized to access this page</div>;
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-white'>
            User Management
          </h1>
          <p className='text-muted-foreground'>
            Manage all users, their roles, and view their created collages
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant='outline'
          className='bg-transparent hover:bg-gray-500/20 hover:text-white text-white'
        >
          <RefreshCw className='w-4 h-4 mr-2' />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className='border-dashed border-white text-white'>
        <CardHeader>
          <CardTitle className='text-lg'>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4'>
            <div className='flex-1'>
              <Label className='pb-2' htmlFor='search'>
                Search Users
              </Label>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='search'
                  placeholder='Search by name or email...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <div className='w-48'>
              <Label htmlFor='role-filter' className='mb-2'>
                Filter by Role
              </Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='All roles' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Roles</SelectItem>
                  <SelectItem value={UserType.OWNER}>Owner</SelectItem>
                  <SelectItem value={UserType.SUPERADMIN}>
                    Super Admin
                  </SelectItem>
                  <SelectItem value={UserType.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserType.GUEST}>Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className='border-dashed border-white text-white'>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            All registered users with their roles and collage counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-gray-200/10'>
                <TableHead className='text-white'>User</TableHead>
                <TableHead className='text-white'>Role</TableHead>
                <TableHead className='text-white'>Collages Created</TableHead>
                <TableHead className='text-white'>Collage</TableHead>
                <TableHead className='text-white'>Joined</TableHead>
                <TableHead className='text-right text-white'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: UserWithCollages) => (
                <TableRow key={user.id} className='hover:bg-gray-200/10'>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={user.image || ''}
                          alt={user.name || ''}
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0) || user.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>
                          {user.name || 'No name'}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-auto p-0'
                        >
                          <div className='flex items-center gap-2'>
                            {getRoleIcon(user.role)}
                            {getRoleBadge(user.role)}
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, UserType.GUEST)
                          }
                        >
                          <div className='flex items-center gap-2'>
                            {getRoleIcon(UserType.GUEST)}
                            <span
                              className={
                                user.role === UserType.GUEST
                                  ? 'font-semibold'
                                  : ''
                              }
                            >
                              Guest
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, UserType.ADMIN)
                          }
                        >
                          <div className='flex items-center gap-2'>
                            {getRoleIcon(UserType.ADMIN)}
                            <span
                              className={
                                user.role === UserType.ADMIN
                                  ? 'font-semibold'
                                  : ''
                              }
                            >
                              Admin
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, UserType.SUPERADMIN)
                          }
                        >
                          <div className='flex items-center gap-2'>
                            {getRoleIcon(UserType.SUPERADMIN)}
                            <span
                              className={
                                user.role === UserType.SUPERADMIN
                                  ? 'font-semibold'
                                  : ''
                              }
                            >
                              Super Admin
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, UserType.OWNER)
                          }
                        >
                          <div className='flex items-center gap-2'>
                            {getRoleIcon(UserType.OWNER)}
                            <span
                              className={
                                user.role === UserType.OWNER
                                  ? 'font-semibold'
                                  : ''
                              }
                            >
                              Owner
                            </span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>
                        {user.College?.length || 0}
                      </span>
                      <span className='text-muted-foreground'>colleges</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='text-sm text-muted-foreground'>
                      {user.College && user.College.length > 0 ? (
                        <div className='flex flex-wrap gap-1'>
                          {user.College.slice(0, 2).map((college: any) => (
                            <Badge
                              key={college.id}
                              variant='outline'
                              className='text-xs'
                            >
                              {typeof college.name === 'string'
                                ? college.name
                                : college.name?.en || 'N/A'}
                            </Badge>
                          ))}
                          {user.College.length > 2 && (
                            <Badge variant='outline' className='text-xs'>
                              +{user.College.length - 2} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        'No colleges'
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='text-sm text-muted-foreground'>
                      {new Date(user.createdAt).toLocaleDateString(locale)}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2 '>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleAssignToCollage(user)}
                        className='bg-transparent hover:bg-gray-500/20 hover:text-white text-white'
                      >
                        <Building2 className='w-4 h-4 mr-1' />
                        Assign
                      </Button>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditUser(user)}
                        className='bg-transparent hover:bg-gray-500/20 hover:text-white text-white'
                      >
                        <Edit className='w-4 h-4 mr-1' />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className='text-center py-8 text-muted-foreground'>
              No users found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={editData.name}
                onChange={e =>
                  setEditData({ ...editData, name: e.target.value })
                }
                placeholder='Enter user name'
              />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={editData.email}
                onChange={e =>
                  setEditData({ ...editData, email: e.target.value })
                }
                placeholder='Enter user email'
              />
            </div>
            <div>
              <Label htmlFor='role'>Role</Label>
              <Select
                value={editData.role}
                onValueChange={(value: UserType) =>
                  setEditData({ ...editData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserType.OWNER}>
                    <div className='flex items-center gap-2'>
                      {getRoleIcon(UserType.OWNER)}
                      Owner
                    </div>
                  </SelectItem>
                  <SelectItem value={UserType.SUPERADMIN}>
                    <div className='flex items-center gap-2'>
                      {getRoleIcon(UserType.SUPERADMIN)}
                      Super Admin
                    </div>
                  </SelectItem>
                  <SelectItem value={UserType.ADMIN}>
                    <div className='flex items-center gap-2'>
                      {getRoleIcon(UserType.ADMIN)}
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value={UserType.GUEST}>
                    <div className='flex items-center gap-2'>
                      {getRoleIcon(UserType.GUEST)}
                      Guest
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
                <>
                  <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign User to Collage Dialog */}
      <Dialog
        open={!!assigningUserToCollage}
        onOpenChange={() => setAssigningUserToCollage(null)}
      >
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>Assign User to Collage</DialogTitle>
            <DialogDescription>
              Assign{' '}
              {assigningUserToCollage?.name || assigningUserToCollage?.email} to
              a collage
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            {allCollagesLoading ? (
              <div className='flex items-center justify-center py-8'>
                <RefreshCw className='w-6 h-6 animate-spin' />
                <span className='ml-2'>Loading collages...</span>
              </div>
            ) : allCollages && allCollages.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto'>
                {allCollages.map(collage => (
                  <Card
                    key={collage.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedCollageId === collage.id
                        ? 'border-2 border-blue-500'
                        : 'hover:bg-slate-700'
                    }`}
                    onClick={() => setSelectedCollageId(collage.id)}
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex flex-col items-center gap-3'>
                          <div
                            className={`p-2 rounded-lg ${
                              selectedCollageId === collage.id
                                ? 'bg-blue-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            <Building2
                              className={`w-5 h-5 ${
                                selectedCollageId === collage.id
                                  ? 'text-blue-600'
                                  : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <div className='text-center justify-center items-center'>
                            <h4 className='font-medium'>
                              {typeof collage.name === 'string'
                                ? collage.name
                                : collage.name?.en || 'N/A'}
                            </h4>
                            <p className='text-sm text-muted-foreground'>
                              {collage.slug}
                            </p>
                          </div>
                        </div>
                        {selectedCollageId === collage.id && (
                          <div className='text-blue-600'>
                            <svg
                              className='w-5 h-5'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-muted-foreground'>
                No collages available
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setAssigningUserToCollage(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMoveToCollage}
              disabled={
                moveUserToCollageMutation.isPending || !selectedCollageId
              }
            >
              {moveUserToCollageMutation.isPending ? (
                <>
                  <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                  Assigning...
                </>
              ) : (
                'Assign to Collage'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UsersPage;
