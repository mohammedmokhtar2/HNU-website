'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import Image from 'next/image';
import { LogService, AuditLog } from '@/services/log.service';

// Types
interface AuditLogMetadata {
  ip?: string;
  url?: string;
  entity?: string;
  method?: string;
  referer?: string;
  duration?: number;
  resource?: string;
  operation?: string;
  timestamp?: string;
  userAgent?: string;
  statusCode?: number;
  [key: string]: any; // For any additional fields
}

export default function LogsPage() {
  // Note: Permission checks removed - all users can access logs for now
  const queryClient = useQueryClient();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [userType, setUserType] = useState<string>('all'); // all, guest, authenticated
  const [sessionId, setSessionId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'selected' | 'filtered' | 'all'>(
    'selected'
  );
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState<AuditLogMetadata | null>(null);

  const limit = 20;

  // Query parameters
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit,
      userId: selectedUser === 'all' ? undefined : selectedUser,
      action: selectedAction === 'all' ? undefined : selectedAction,
      isGuest: userType === 'all' ? undefined : userType === 'guest',
      sessionId: sessionId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [
      currentPage,
      selectedUser,
      selectedAction,
      userType,
      sessionId,
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
    queryFn: () => LogService.getLogs(queryParams),
  });

  const { data: searchData } = useQuery({
    queryKey: ['logs-search', { ...queryParams, query: searchQuery }],
    queryFn: () => LogService.searchLogs({ ...queryParams, query: searchQuery }),
    enabled: !!searchQuery,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['logs-stats', { startDate, endDate }],
    queryFn: () => LogService.getLogStats({ startDate, endDate }),
  });

  // Mutations
  const deleteLogsMutation = useMutation({
    mutationFn: LogService.deleteLogs,
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

  const deleteAllLogsMutation = useMutation({
    mutationFn: LogService.deleteAllLogs,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['logs-search'] });
      queryClient.invalidateQueries({ queryKey: ['logs-stats'] });
      setSelectedLogs([]);
      setShowDeleteDialog(false);
      toast.success(`Successfully deleted all logs`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete all logs');
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
    setUserType('all');
    setSessionId('');
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

  const handleDeleteAll = useCallback(() => {
    setDeleteMode('all');
    setShowDeleteDialog(true);
  }, []);

  const handleViewMetadata = useCallback((metadata: AuditLogMetadata) => {
    setSelectedMetadata(metadata);
    setShowMetadataModal(true);
  }, []);

  const renderMetadataDetails = (metadata: AuditLogMetadata) => {
    const knownFields = [
      { key: 'ip', label: 'IP Address', icon: '🌐' },
      { key: 'url', label: 'URL', icon: '🔗' },
      { key: 'entity', label: 'Entity', icon: '📦' },
      { key: 'method', label: 'HTTP Method', icon: '⚡' },
      { key: 'referer', label: 'Referer', icon: '↩️' },
      { key: 'duration', label: 'Duration (ms)', icon: '⏱️' },
      { key: 'resource', label: 'Resource', icon: '📄' },
      { key: 'operation', label: 'Operation', icon: '🔧' },
      { key: 'timestamp', label: 'Timestamp', icon: '🕒' },
      { key: 'userAgent', label: 'User Agent', icon: '🖥️' },
      { key: 'statusCode', label: 'Status Code', icon: '📊' },
    ];

    const unknownFields = Object.keys(metadata).filter(
      key => !knownFields.some(field => field.key === key)
    );

    return (
      <div className='space-y-4'>
        {/* Known Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {knownFields.map(field => {
            const value = metadata[field.key as keyof AuditLogMetadata];
            if (value === undefined || value === null) return null;

            return (
              <div key={field.key} className='bg-gray-800/50 rounded-lg p-3 border border-gray-600'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='text-lg'>{field.icon}</span>
                  <span className='text-sm font-medium text-gray-300'>{field.label}</span>
                </div>
                <div className='text-white text-sm break-all'>
                  {field.key === 'duration' ? `${value}ms` :
                    field.key === 'statusCode' ? (
                      <span className={`px-2 py-1 rounded text-xs ${Number(value) >= 200 && Number(value) < 300 ? 'bg-green-600' :
                        Number(value) >= 300 && Number(value) < 400 ? 'bg-yellow-600' :
                          Number(value) >= 400 ? 'bg-red-600' : 'bg-gray-600'
                        }`}>
                        {value}
                      </span>
                    ) : String(value)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Unknown Fields */}
        {unknownFields.length > 0 && (
          <div className='mt-6'>
            <h4 className='text-white font-medium mb-3 flex items-center gap-2'>
              <span>📋</span>
              Additional Data
            </h4>
            <div className='bg-gray-900/50 rounded-lg p-4 border border-gray-700'>
              <pre className='text-white text-sm whitespace-pre-wrap font-mono'>
                {JSON.stringify(
                  unknownFields.reduce((acc, key) => {
                    acc[key] = metadata[key];
                    return acc;
                  }, {} as Record<string, any>),
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  const confirmDelete = useCallback(() => {
    if (deleteMode === 'selected') {
      deleteLogsMutation.mutate(selectedLogs);
    } else if (deleteMode === 'filtered') {
      deleteLogsMutation.mutate(queryParams as any);
    } else if (deleteMode === 'all') {
      deleteAllLogsMutation.mutate();
    }
  }, [deleteMode, selectedLogs, queryParams, deleteLogsMutation, deleteAllLogsMutation]);

  // Note: Access control removed - all users can access logs for now

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-500';
    if (action.includes('UPDATE') || action.includes('EDIT'))
      return 'bg-blue-500';
    if (action.includes('DELETE')) return 'bg-red-500';
    if (action.includes('GET')) return 'bg-gray-500';
    if (action.includes('PAGE_VISIT')) return 'bg-purple-500';
    if (action.includes('API_CALL')) return 'bg-indigo-500';
    if (action.includes('FORM_SUBMIT')) return 'bg-yellow-500';
    if (action.includes('FILE_UPLOAD')) return 'bg-orange-500';
    if (action.includes('FILE_DOWNLOAD')) return 'bg-cyan-500';
    if (action.includes('SEARCH')) return 'bg-pink-500';
    if (action.includes('BUTTON_CLICK')) return 'bg-teal-500';
    if (action.includes('LINK_CLICK')) return 'bg-lime-500';
    if (action.includes('CUSTOM_ACTION')) return 'bg-violet-500';
    return 'bg-gray-500';
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
      case 'page':
        return '📄';
      case 'file':
        return '📁';
      case 'form':
        return '📝';
      case 'search':
        return '🔍';
      case 'api':
        return '⚡';
      case 'example':
        return '🧪';
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
          <Button
            variant='destructive'
            onClick={handleDeleteAll}
            disabled={!logs.length}
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Delete All
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
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4'>
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
                      <SelectItem value='PAGE_VISIT'>PAGE_VISIT</SelectItem>
                      <SelectItem value='API_CALL'>API_CALL</SelectItem>
                      <SelectItem value='FORM_SUBMIT'>FORM_SUBMIT</SelectItem>
                      <SelectItem value='FILE_UPLOAD'>FILE_UPLOAD</SelectItem>
                      <SelectItem value='FILE_DOWNLOAD'>FILE_DOWNLOAD</SelectItem>
                      <SelectItem value='SEARCH'>SEARCH</SelectItem>
                      <SelectItem value='BUTTON_CLICK'>BUTTON_CLICK</SelectItem>
                      <SelectItem value='LINK_CLICK'>LINK_CLICK</SelectItem>
                      <SelectItem value='CUSTOM_ACTION'>CUSTOM_ACTION</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='userType'>User Type</Label>
                  <Select
                    value={userType}
                    onValueChange={setUserType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='All users' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All users</SelectItem>
                      <SelectItem value='guest'>Guest users</SelectItem>
                      <SelectItem value='authenticated'>Authenticated users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='sessionId'>Session ID</Label>
                  <Input
                    id='sessionId'
                    placeholder='Enter session ID...'
                    value={sessionId}
                    onChange={e => setSessionId(e.target.value)}
                  />
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
              </div>
              <div className='flex items-end gap-2 mt-4'>
                <Button onClick={handleSearch} className='flex-1'>
                  <Search className='h-4 w-4 mr-2' />
                  Search
                </Button>
                <Button variant='outline' onClick={handleClearFilters}>
                  Clear
                </Button>
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
                        <TableHead>IP/Session</TableHead>
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
                              {log.isGuest ? (
                                <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                                  <User className='h-4 w-4 text-orange-600' />
                                </div>
                              ) : log.clerkUser?.imageUrl ? (
                                <Image
                                  width={32}
                                  height={32}
                                  src={log.clerkUser.imageUrl}
                                  alt={log.clerkUser.name || 'User'}
                                  className='w-8 h-8 rounded-full object-cover'
                                />
                              ) : (
                                <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                                  <User className='h-4 w-4' />
                                </div>
                              )}
                              <div>
                                {log.isGuest ? (
                                  <>
                                    <div className='font-medium text-orange-600'>
                                      Guest User
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                      Session: {log.sessionId?.substring(0, 12)}...
                                    </div>
                                    <Badge variant='outline' className='text-xs bg-orange-100 text-orange-700'>
                                      Guest
                                    </Badge>
                                  </>
                                ) : (
                                  <>
                                    <div className='font-medium'>
                                      {log.clerkUser?.name || 'Unknown User'}
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                      {log.clerkUser?.email || log.clerkId}
                                    </div>
                                    <Badge variant='outline' className='text-xs'>
                                      {log.clerkUser?.role || 'User'}
                                    </Badge>
                                  </>
                                )}
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
                                <div className='text-sm text-muted-foreground mb-1'>
                                  <span className='font-medium'>ID:</span> {log.entityId}
                                </div>
                              )}
                              {log.metadata && (
                                <div className='text-xs'>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => log.metadata && handleViewMetadata(log.metadata)}
                                    className='h-6 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                                  >
                                    View Details
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='text-sm'>
                              {log.ipAddress && (
                                <div className='text-muted-foreground'>
                                  IP: {log.ipAddress}
                                </div>
                              )}
                              {log.sessionId && (
                                <div className='text-xs text-blue-600 font-mono'>
                                  {log.sessionId.substring(0, 8)}...
                                </div>
                              )}
                              {log.userAgent && (
                                <div className='text-xs text-muted-foreground truncate max-w-32'>
                                  {log.userAgent.split(' ')[0]}
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
                                    deleteLogsMutation.mutate([log.id])
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
                    <div className='flex items-center justify-between mt-6'>
                      <div className='text-sm text-muted-foreground'>
                        Showing {(pagination.page - 1) * pagination.limit + 1}{' '}
                        to{' '}
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}{' '}
                        of {pagination.total} results
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setCurrentPage(1)}
                          disabled={pagination.page === 1}
                        >
                          First
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setCurrentPage(pagination.page - 1)}
                          disabled={!pagination.hasPrevPage}
                        >
                          <ChevronLeft className='h-4 w-4' />
                          Previous
                        </Button>
                        <div className='flex items-center gap-1'>
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                            if (pageNum > pagination.totalPages) return null;
                            return (
                              <Button
                                key={pageNum}
                                variant={pageNum === pagination.page ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => setCurrentPage(pageNum)}
                                className='w-8 h-8 p-0'
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setCurrentPage(pagination.page + 1)}
                          disabled={!pagination.hasNextPage}
                        >
                          Next
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setCurrentPage(pagination.totalPages)}
                          disabled={pagination.page === pagination.totalPages}
                        >
                          Last
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
                  <div className='text-3xl font-bold'>{stats.stats.totalLogs}</div>
                  <p className='text-sm text-muted-foreground'>
                    All time activity
                  </p>
                </CardContent>
              </Card>

              {/* Guest vs Authenticated */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    User Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm'>Guest Users</span>
                      <Badge variant='outline' className='bg-orange-100 text-orange-700'>
                        {stats.stats.guestLogs}
                      </Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm'>Authenticated Users</span>
                      <Badge variant='outline' className='bg-blue-100 text-blue-700'>
                        {stats.stats.authenticatedLogs}
                      </Badge>
                    </div>
                  </div>
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
                    {Object.entries(stats.stats.logsByAction)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .slice(0, 5)
                      .map(([action, count]) => (
                        <div
                          key={action}
                          className='flex justify-between items-center'
                        >
                          <span className='text-sm'>{action}</span>
                          <Badge variant='outline'>{count as number}</Badge>
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
                : deleteMode === 'filtered'
                  ? 'Are you sure you want to delete all logs matching the current filters? This action cannot be undone.'
                  : 'Are you sure you want to delete ALL logs in the system? This action cannot be undone and will remove all audit history.'}
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
              disabled={deleteLogsMutation.isPending || deleteAllLogsMutation.isPending}
            >
              {(deleteLogsMutation.isPending || deleteAllLogsMutation.isPending) ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Metadata Modal */}
      <Dialog open={showMetadataModal} onOpenChange={setShowMetadataModal}>
        <DialogContent className='max-w-6xl max-h-[90vh] bg-black/90 border-gray-700'>
          <DialogHeader>
            <DialogTitle className='text-white'>Metadata Details</DialogTitle>
            <DialogDescription className='text-gray-300'>
              Detailed information about this log entry
            </DialogDescription>
          </DialogHeader>
          <div className='overflow-auto max-h-[70vh]'>
            {selectedMetadata && renderMetadataDetails(selectedMetadata)}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowMetadataModal(false)}
              className='border-gray-600 text-gray-300 hover:bg-gray-800'
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
