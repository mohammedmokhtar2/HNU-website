'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePermissions } from '@/contexts/PermissionContext';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Trash2,
  RefreshCw,
  User,
  Activity,
  BarChart3,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: any;
  userId?: string;
  createdAt: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}

// interface LogStats {
//   totalLogs: number;
//   logsByAction: Array<{ action: string; _count: { action: number } }>;
//   logsByEntity: Array<{ entity: string; _count: { entity: number } }>;
//   userStats: Array<{
//     userId: string;
//     userName: string;
//     userEmail: string;
//     userRole: string;
//     count: number;
//   }>;
//   dailyStats: Array<{ date: string; count: number }>;
//   recentLogs: AuditLog[];
// }

// API functions
const LogsAPI = {
  getLogs: async (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    const response = await fetch(`/api/logs?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch logs');
    return response.json();
  },

  searchLogs: async (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    const response = await fetch(`/api/logs/search?${searchParams}`);
    if (!response.ok) throw new Error('Failed to search logs');
    return response.json();
  },

  getStats: async (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    const response = await fetch(`/api/logs/stats?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  deleteLogs: async (data: { logIds?: string[]; filters?: any }) => {
    const response = await fetch('/api/logs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to delete logs');
    return response.json();
  },
};

export default function LogsPage() {
  const { isOwner, isSuperAdmin } = usePermissions();
  const queryClient = useQueryClient();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'selected' | 'filtered'>(
    'selected'
  );

  const limit = 20;

  // Query parameters
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit,
      userId: selectedUser === 'all' ? undefined : selectedUser,
      action: selectedAction === 'all' ? undefined : selectedAction,
      entity: selectedEntity === 'all' ? undefined : selectedEntity,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [
      currentPage,
      selectedUser,
      selectedAction,
      selectedEntity,
      startDate,
      endDate,
    ]
  );

  // Fetch data
  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsError,
  } = useQuery({
    queryKey: ['logs', queryParams],
    queryFn: () => LogsAPI.getLogs(queryParams),
  });

  const { data: searchData } = useQuery({
    queryKey: ['logs-search', { ...queryParams, query: searchQuery }],
    queryFn: () => LogsAPI.searchLogs({ ...queryParams, query: searchQuery }),
    enabled: !!searchQuery,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['logs-stats', { startDate, endDate }],
    queryFn: () => LogsAPI.getStats({ startDate, endDate }),
  });

  // Mutations
  const deleteLogsMutation = useMutation({
    mutationFn: LogsAPI.deleteLogs,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['logs-search'] });
      queryClient.invalidateQueries({ queryKey: ['logs-stats'] });
      setSelectedLogs([]);
      setShowDeleteDialog(false);
      toast.success(`Successfully deleted ${data.deletedCount} logs`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete logs');
    },
  });

  // Get current data (search results or regular logs)
  const currentData = searchQuery ? searchData : logsData;
  const logs = useMemo(() => currentData?.logs || [], [currentData]);
  const pagination = currentData?.pagination;

  // Handlers
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedUser('all');
    setSelectedAction('all');
    setSelectedEntity('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    setSelectedLogs([]);
  }, []);

  const handleSelectLog = useCallback((logId: string) => {
    setSelectedLogs(prev =>
      prev.includes(logId) ? prev.filter(id => id !== logId) : [...prev, logId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedLogs.length === logs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(logs.map((log: AuditLog) => log.id));
    }
  }, [selectedLogs.length, logs]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedLogs.length === 0) {
      toast.error('Please select logs to delete');
      return;
    }
    setDeleteMode('selected');
    setShowDeleteDialog(true);
  }, [selectedLogs]);

  const handleDeleteFiltered = useCallback(() => {
    setDeleteMode('filtered');
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteMode === 'selected') {
      deleteLogsMutation.mutate({ logIds: selectedLogs });
    } else {
      deleteLogsMutation.mutate({ filters: queryParams });
    }
  }, [deleteMode, selectedLogs, queryParams, deleteLogsMutation]);

  // Check access
  if (!isOwner() && !isSuperAdmin()) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-500 mb-4'>
            Access Denied
          </h2>
          <p className='text-muted-foreground'>
            You need owner or super admin privileges to access audit logs.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-500';
    if (action.includes('UPDATE') || action.includes('EDIT'))
      return 'bg-blue-500';
    if (action.includes('DELETE')) return 'bg-red-500';
    if (action.includes('GET')) return 'bg-gray-500';
    return 'bg-purple-500';
  };

  const getEntityIcon = (entity: string) => {
    switch (entity.toLowerCase()) {
      case 'user':
        return '👤';
      case 'college':
        return '🏫';
      case 'university':
        return '🎓';
      case 'section':
        return '📄';
      case 'permission':
        return '🔐';
      default:
        return '📝';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Audit Logs</h1>
          <p className='text-muted-foreground'>
            Monitor and analyze system activity and user actions
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['logs'] })
            }
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
          <Button
            variant='outline'
            onClick={handleDeleteFiltered}
            disabled={!logs.length}
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Delete Filtered
          </Button>
        </div>
      </div>

      <Tabs defaultValue='logs' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='logs'>Logs</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>

        {/* Logs Tab */}
        <TabsContent value='logs' className='space-y-4'>
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
                <div>
                  <Label htmlFor='search'>Search</Label>
                  <div className='relative'>
                    <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Input
                      id='search'
                      placeholder='Search logs...'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className='pl-10'
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor='action'>Action</Label>
                  <Select
                    value={selectedAction}
                    onValueChange={setSelectedAction}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='All actions' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All actions</SelectItem>
                      <SelectItem value='CREATE'>CREATE</SelectItem>
                      <SelectItem value='UPDATE'>UPDATE</SelectItem>
                      <SelectItem value='DELETE'>DELETE</SelectItem>
                      <SelectItem value='GET'>GET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='entity'>Entity</Label>
                  <Select
                    value={selectedEntity}
                    onValueChange={setSelectedEntity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='All entities' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All entities</SelectItem>
                      <SelectItem value='User'>User</SelectItem>
                      <SelectItem value='College'>College</SelectItem>
                      <SelectItem value='University'>University</SelectItem>
                      <SelectItem value='Section'>Section</SelectItem>
                      <SelectItem value='Permission'>Permission</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='startDate'>Start Date</Label>
                  <Input
                    id='startDate'
                    type='date'
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor='endDate'>End Date</Label>
                  <Input
                    id='endDate'
                    type='date'
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
                <div className='flex items-end gap-2'>
                  <Button onClick={handleSearch} className='flex-1'>
                    <Search className='h-4 w-4 mr-2' />
                    Search
                  </Button>
                  <Button variant='outline' onClick={handleClearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>
                    Audit Logs ({pagination?.totalCount || 0})
                  </CardTitle>
                  <CardDescription>
                    System activity and user actions
                  </CardDescription>
                </div>
                {selectedLogs.length > 0 && (
                  <Button
                    variant='destructive'
                    onClick={handleDeleteSelected}
                    disabled={selectedLogs.length > 100}
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Delete Selected ({selectedLogs.length})
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <RefreshCw className='h-6 w-6 animate-spin' />
                  <span className='ml-2'>Loading logs...</span>
                </div>
              ) : logsError ? (
                <div className='flex items-center justify-center py-8 text-red-500'>
                  <div className='text-center'>
                    <p className='font-medium'>Error loading logs</p>
                    <p className='text-sm text-muted-foreground'>
                      {logsError instanceof Error
                        ? logsError.message
                        : 'Unknown error'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-12'>
                          <input
                            type='checkbox'
                            checked={
                              selectedLogs.length === logs.length &&
                              logs.length > 0
                            }
                            onChange={handleSelectAll}
                            className='rounded'
                          />
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log: AuditLog) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <input
                              type='checkbox'
                              checked={selectedLogs.includes(log.id)}
                              onChange={() => handleSelectLog(log.id)}
                              className='rounded'
                            />
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                                <User className='h-4 w-4' />
                              </div>
                              <div>
                                <div className='font-medium'>
                                  {log.user?.name || 'Unknown User'}
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  {log.user?.email}
                                </div>
                                <Badge variant='outline' className='text-xs'>
                                  {log.user?.role}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getActionBadgeColor(log.action)}>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <span>{getEntityIcon(log.entity)}</span>
                              <span className='font-medium'>{log.entity}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='max-w-xs'>
                              {log.entityId && (
                                <div className='text-sm text-muted-foreground'>
                                  ID: {log.entityId}
                                </div>
                              )}
                              {log.metadata && (
                                <div className='text-xs text-muted-foreground truncate'>
                                  {JSON.stringify(log.metadata)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='text-sm text-muted-foreground'>
                              {formatDate(log.createdAt)}
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
                                  onClick={() => handleSelectLog(log.id)}
                                >
                                  {selectedLogs.includes(log.id)
                                    ? 'Deselect'
                                    : 'Select'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    deleteLogsMutation.mutate({
                                      logIds: [log.id],
                                    })
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
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className='flex items-center justify-between mt-4'>
                      <div className='text-sm text-muted-foreground'>
                        Showing {(pagination.page - 1) * pagination.limit + 1}{' '}
                        to{' '}
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.totalCount
                        )}{' '}
                        of {pagination.totalCount} results
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setCurrentPage(pagination.page - 1)}
                          disabled={!pagination.hasPrev}
                        >
                          <ChevronLeft className='h-4 w-4' />
                          Previous
                        </Button>
                        <span className='text-sm'>
                          Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setCurrentPage(pagination.page + 1)}
                          disabled={!pagination.hasNext}
                        >
                          Next
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value='analytics' className='space-y-4'>
          {statsLoading ? (
            <div className='flex items-center justify-center py-8'>
              <RefreshCw className='h-6 w-6 animate-spin' />
              <span className='ml-2'>Loading analytics...</span>
            </div>
          ) : stats ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {/* Total Logs */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Activity className='h-5 w-5' />
                    Total Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-3xl font-bold'>{stats.totalLogs}</div>
                  <p className='text-sm text-muted-foreground'>
                    All time activity
                  </p>
                </CardContent>
              </Card>

              {/* Top Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Top Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {stats.logsByAction.slice(0, 5).map((item: any) => (
                      <div
                        key={item.action}
                        className='flex justify-between items-center'
                      >
                        <span className='text-sm'>{item.action}</span>
                        <Badge variant='outline'>{item._count.action}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Entities */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Top Entities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {stats.logsByEntity.slice(0, 5).map((item: any) => (
                      <div
                        key={item.entity}
                        className='flex justify-between items-center'
                      >
                        <span className='text-sm'>{item.entity}</span>
                        <Badge variant='outline'>{item._count.entity}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Users */}
              <Card className='md:col-span-2 lg:col-span-3'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Most Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {stats.userStats.slice(0, 10).map((user: any) => (
                      <div
                        key={user.userId}
                        className='flex justify-between items-center p-2 border rounded'
                      >
                        <div>
                          <div className='font-medium'>{user.userName}</div>
                          <div className='text-sm text-muted-foreground'>
                            {user.userEmail}
                          </div>
                          <Badge variant='outline' className='text-xs'>
                            {user.userRole}
                          </Badge>
                        </div>
                        <Badge variant='default'>{user.count} actions</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className='text-center py-8 text-muted-foreground'>
              No analytics data available
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-red-500' />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              {deleteMode === 'selected'
                ? `Are you sure you want to delete ${selectedLogs.length} selected logs? This action cannot be undone.`
                : 'Are you sure you want to delete all logs matching the current filters? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={confirmDelete}
              disabled={deleteLogsMutation.isPending}
            >
              {deleteLogsMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
