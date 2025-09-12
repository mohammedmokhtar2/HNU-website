'use client';
import { CollegeService } from '@/services/collage.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  FileText,
  Calendar,
  MoreVertical,
  Crown,
  UserCheck,
  Building2,
  Loader2,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from 'next-intl';
import { CollageCard } from './_components/collage/CollageCard';
import { College } from '@/types/college';
import {
  useCurrentUser,
  useIsSuperAdmin,
  useIsOwner,
} from '@/contexts/userContext';
import { CollegeFormDialog } from './_components/collage/college-form-dialog';
import { DeleteCollegeDialog } from './_components/collage/delete-college-dialog';

function Collages() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const isSuperAdmin = useIsSuperAdmin();
  const isOwner = useIsOwner();
  const { success, error, warning, info, loading } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [deletingCollege, setDeletingCollege] = useState<College | null>(null);

  // OPTIMIZED FETCHING LOGIC:
  // - If user is OWNER: Only fetch all colleges (1 API call)
  // - If user is NOT owner: Only fetch created + member colleges (2 API calls)
  // This reduces unnecessary API calls and improves performance

  // Fetch all collages for owners (only if user is owner)
  const {
    data: allCollagesForOwner,
    isLoading: allCollagesLoading,
    isError: allCollagesError,
  } = useQuery({
    queryKey: ['collages', 'all'],
    queryFn: () => CollegeService.getColleges(),
    enabled: isOwner && !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  // Fetch collages created by current user (only if user is not owner)
  const {
    data: createdCollages,
    isLoading: createdLoading,
    isError: createdError,
  } = useQuery({
    queryKey: ['collages', 'created', currentUser?.id],
    queryFn: () => {
      if (!currentUser?.id) throw new Error('User ID is required');
      return CollegeService.getColleges({ createdById: currentUser.id });
    },
    enabled: !isOwner && !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  // Fetch collages where current user is assigned (member) (only if user is not owner)
  const {
    data: memberCollages,
    isLoading: memberLoading,
    isError: memberError,
  } = useQuery({
    queryKey: ['collages', 'member', currentUser?.id],
    queryFn: () => {
      if (!currentUser?.id) throw new Error('User ID is required');
      return CollegeService.getColleges({ assignedToUserId: currentUser.id });
    },
    enabled: !isOwner && !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  // Combine both datasets for filtering
  const allCollages = [...(createdCollages || []), ...(memberCollages || [])];
  const uniqueCollages = allCollages.filter(
    (college, index, self) => index === self.findIndex(c => c.id === college.id)
  );

  // Optimized loading and error states based on user role
  const isLoading = isOwner
    ? allCollagesLoading
    : createdLoading || memberLoading;
  const isError = isOwner ? allCollagesError : createdError || memberError;
  const data = isOwner ? allCollagesForOwner : uniqueCollages;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CollegeService.deleteCollege(id),
    onSuccess: () => {
      // Only invalidate queries that are actually being used
      if (isOwner) {
        queryClient.invalidateQueries({ queryKey: ['collages', 'all'] });
      } else {
        queryClient.invalidateQueries({
          queryKey: ['collages', 'created', currentUser?.id],
        });
        queryClient.invalidateQueries({
          queryKey: ['collages', 'member', currentUser?.id],
        });
      }
      success('College deleted successfully', {
        description: 'The college has been permanently removed from the system',
      });
      setDeletingCollege(null);
    },
    onError: (error: any) => {
      error('Failed to delete college', {
        description:
          error?.message ||
          'An unexpected error occurred while deleting the college',
      });
      console.error('Delete error:', error);
    },
  });

  const handleDelete = (college: College) => {
    setDeletingCollege(college);
  };

  const confirmDelete = () => {
    if (deletingCollege) {
      const collegeName =
        typeof deletingCollege.name === 'string'
          ? deletingCollege.name
          : deletingCollege.name?.en || deletingCollege.name?.ar || 'Unknown';

      const toastId = loading('Deleting college...');

      deleteMutation
        .mutateAsync(deletingCollege.id)
        .then(() => {
          success('College deleted successfully', {
            description: `${collegeName} has been permanently removed from the system`,
          });
        })
        .catch((error: any) => {
          error('Failed to delete college', {
            description:
              error?.message ||
              'An unexpected error occurred while deleting the college',
          });
        });
    }
  };

  // Filter function for search and type
  const filterCollages = (collages: College[]) => {
    return collages.filter(college => {
      const collegeName =
        typeof college.name === 'string'
          ? college.name
          : college.name?.[locale] || college.name?.en || '';

      const matchesSearch =
        collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || college.type === typeFilter;
      return matchesSearch && matchesType;
    });
  };

  if (!currentUser) {
    return (
      <div className='space-y-6 sm:space-y-8 p-4 sm:p-0'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl sm:text-3xl font-bold text-white'>
            Colleges
          </h1>
        </div>
        <div className='flex items-center justify-center py-12'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-400' />
            <p className='text-gray-400 text-sm'>Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  // if (error) {
  //     return (
  //         <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] space-y-4 p-4 sm:p-0">
  //             <div className="text-red-400 text-base sm:text-lg font-semibold text-center">Error loading colleges</div>
  //             <div className="text-gray-400 text-sm sm:text-base text-center">{error?.toString()}</div>
  //             <Button onClick={() => window.location.reload()} className="bg-gray-800 hover:bg-gray-700 text-white">Try Again</Button>
  //         </div>
  //     )
  // }

  const totalCount = data?.length || 0;

  return (
    <div className='space-y-6 sm:space-y-8 p-4 sm:p-0'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center'>
        <div className='space-y-2'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
            <h1 className='text-2xl sm:text-3xl font-bold text-white'>
              Colleges
            </h1>
            {isOwner && (
              <Badge className='bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 w-fit'>
                Owner
              </Badge>
            )}
            {isSuperAdmin && !isOwner && (
              <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 w-fit'>
                Super Admin
              </Badge>
            )}
          </div>
          <p className='text-gray-400 text-sm sm:text-base'>
            {isOwner
              ? 'View and manage all colleges in the system'
              : 'Manage your colleges and collaborate with others'}
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          <span className='hidden sm:inline'>Add College</span>
          <span className='sm:hidden'>Add</span>
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className='flex items-center justify-center py-12'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-400' />
            <p className='text-gray-400 text-sm'>
              {isOwner ? 'Loading all colleges...' : 'Loading your colleges...'}
            </p>
          </div>
        </div>
      )}

      {/* Content - Only show when not loading */}
      {!isLoading && (
        <>
          {/* Filters */}
          <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Search colleges...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600'
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className='w-full sm:w-48 bg-gray-900/50 border-gray-700 text-white focus:border-gray-600 focus:ring-gray-600'>
                <SelectValue placeholder='Filter by type' />
              </SelectTrigger>
              <SelectContent className='bg-gray-900 border-gray-700'>
                <SelectItem
                  value='all'
                  className='text-gray-300 hover:text-white hover:bg-gray-800'
                >
                  All Types
                </SelectItem>
                <SelectItem
                  value='TECHNICAL'
                  className='text-gray-300 hover:text-white hover:bg-gray-800'
                >
                  Technical
                </SelectItem>
                <SelectItem
                  value='MEDICAL'
                  className='text-gray-300 hover:text-white hover:bg-gray-800'
                >
                  Medical
                </SelectItem>
                <SelectItem
                  value='ARTS'
                  className='text-gray-300 hover:text-white hover:bg-gray-800'
                >
                  Arts
                </SelectItem>
                <SelectItem
                  value='OTHER'
                  className='text-gray-300 hover:text-white hover:bg-gray-800'
                >
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
            <Card className='bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50'>
              <CardContent className='p-4 sm:p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-2xl sm:text-3xl font-bold text-white'>
                      {totalCount}
                    </div>
                    <div className='text-xs sm:text-sm text-blue-200'>
                      Total Colleges
                    </div>
                  </div>
                  <Building2 className='h-6 w-6 sm:h-8 sm:w-8 text-blue-300' />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Colleges Section for Owners */}
          {isOwner && (
            <div className='space-y-4'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
                  <div className='flex items-center gap-2 sm:gap-3'>
                    <Building2 className='h-5 w-5 sm:h-6 sm:w-6 text-blue-400' />
                    <h2 className='text-xl sm:text-2xl font-semibold text-white'>
                      All Colleges
                    </h2>
                  </div>
                  <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 w-fit'>
                    {allCollagesForOwner?.length || 0}
                  </Badge>
                </div>
              </div>

              {(allCollagesForOwner?.length || 0) === 0 ? (
                <Card className='p-8 sm:p-12 text-center bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-700/30'>
                  <Building2 className='h-10 w-10 sm:h-12 sm:w-12 text-blue-400 mx-auto mb-4' />
                  <div className='text-blue-200 text-base sm:text-lg mb-2'>
                    No colleges found
                  </div>
                  <div className='text-blue-300 text-sm sm:text-base mb-6'>
                    No colleges have been created yet
                  </div>
                </Card>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                  {filterCollages(allCollagesForOwner || []).map(college => (
                    <CollageCard
                      key={college.id}
                      college={college}
                      isSuperAdmin={isSuperAdmin}
                      onEdit={setEditingCollege}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Created Colleges Section */}
          {!isOwner && (
            <div className='space-y-4'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
                  <div className='flex items-center gap-2 sm:gap-3'>
                    <Crown className='h-5 w-5 sm:h-6 sm:w-6 text-purple-400' />
                    <h2 className='text-xl sm:text-2xl font-semibold text-white'>
                      Colleges You Created
                    </h2>
                  </div>
                  <Badge className='bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 w-fit'>
                    {createdCollages?.length || 0}
                  </Badge>
                </div>
                {(createdCollages?.length || 0) === 0 && (
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    <span className='hidden sm:inline'>
                      Create Your First College
                    </span>
                    <span className='sm:hidden'>Create College</span>
                  </Button>
                )}
              </div>

              {(createdCollages?.length || 0) === 0 ? (
                <Card className='p-8 sm:p-12 text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/30'>
                  <Crown className='h-10 w-10 sm:h-12 sm:w-12 text-purple-400 mx-auto mb-4' />
                  <div className='text-purple-200 text-base sm:text-lg mb-2'>
                    No colleges created yet
                  </div>
                  <div className='text-purple-300 text-sm sm:text-base mb-6'>
                    Start building your college portfolio by creating your first
                    college
                  </div>
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Create College
                  </Button>
                </Card>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                  {filterCollages(createdCollages || []).map(college => (
                    <CollageCard
                      key={college.id}
                      college={college}
                      isSuperAdmin={isSuperAdmin}
                      onEdit={setEditingCollege}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Member Colleges Section */}
          {!isOwner && (memberCollages?.length || 0) > 0 && (
            <div className='space-y-4'>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <UserCheck className='h-5 w-5 sm:h-6 sm:w-6 text-green-400' />
                  <h2 className='text-xl sm:text-2xl font-semibold text-white'>
                    Colleges You&apos;re Member Of
                  </h2>
                </div>
                <Badge className='bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 w-fit'>
                  {memberCollages?.length || 0}
                </Badge>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                {filterCollages(memberCollages || []).map(college => (
                  <CollageCard
                    key={college.id}
                    college={college}
                    isSuperAdmin={isSuperAdmin}
                    onEdit={setEditingCollege}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {searchQuery &&
            totalCount > 0 &&
            data?.length === 0 &&
            data?.length &&
            data.length === 0 && (
              <Card className='p-8 sm:p-12 text-center bg-gray-900/50 border-gray-800'>
                <Search className='h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4' />
                <div className='text-gray-400 text-base sm:text-lg mb-2'>
                  No colleges found
                </div>
                <div className='text-gray-500 text-sm sm:text-base'>
                  Try adjusting your search or filters
                </div>
              </Card>
            )}
        </>
      )}

      {/* Dialogs */}
      <CollegeFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          // Only invalidate queries that are actually being used
          if (isOwner) {
            queryClient.invalidateQueries({ queryKey: ['collages', 'all'] });
          } else {
            queryClient.invalidateQueries({
              queryKey: ['collages', 'created', currentUser?.id],
            });
            queryClient.invalidateQueries({
              queryKey: ['collages', 'member', currentUser?.id],
            });
          }
          setIsAddDialogOpen(false);
        }}
      />

      <CollegeFormDialog
        open={!!editingCollege}
        onOpenChange={open => !open && setEditingCollege(null)}
        college={editingCollege}
        onSuccess={() => {
          // Only invalidate queries that are actually being used
          if (isOwner) {
            queryClient.invalidateQueries({ queryKey: ['collages', 'all'] });
          } else {
            queryClient.invalidateQueries({
              queryKey: ['collages', 'created', currentUser?.id],
            });
            queryClient.invalidateQueries({
              queryKey: ['collages', 'member', currentUser?.id],
            });
          }
          setEditingCollege(null);
        }}
      />

      <DeleteCollegeDialog
        open={!!deletingCollege}
        onOpenChange={open => !open && setDeletingCollege(null)}
        college={deletingCollege}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default Collages;
