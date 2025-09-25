'use client';

import React, { useState, useEffect } from 'react';
import { useMessage } from '@/contexts/MessageContext';
import { MessageStatus, MessageType, MessagePriority } from '@/types/message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Mail,
    Send,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Filter,
    Plus,
    RefreshCw,
    Eye,
    Trash2,
    RotateCcw,
    Calendar,
    MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';

function MessagesContent() {
    const {
        messages,
        paginatedMessages,
        stats,
        unreadCount,
        loading,
        loadingStats,
        queryParams,
        setQueryParams,
        refetch,
        refetchStats,
        deleteMessage,
        sendMessage,
        markAsRead,
        retryMessage,
        scheduleMessage,
        cancelScheduledMessage,
        bulkUpdateStatus,
        bulkDelete,
        searchMessages,
        filterByStatus,
        filterByType,
        filterByPriority,
    } = useMessage();

    const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    // Auto-refresh data every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
            refetchStats();
        }, 30000);

        return () => clearInterval(interval);
    }, [refetch, refetchStats]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        searchMessages(query);
    };

    const handleStatusFilter = (status: string) => {
        if (status === 'all') {
            setQueryParams({ status: undefined, page: 1 });
        } else {
            filterByStatus(status);
        }
    };

    const handleTypeFilter = (type: string) => {
        if (type === 'all') {
            setQueryParams({ type: undefined, page: 1 });
        } else {
            filterByType(type);
        }
    };

    const handlePriorityFilter = (priority: string) => {
        if (priority === 'all') {
            setQueryParams({ priority: undefined, page: 1 });
        } else {
            filterByPriority(priority);
        }
    };

    const handleSelectMessage = (messageId: string) => {
        setSelectedMessages(prev =>
            prev.includes(messageId)
                ? prev.filter(id => id !== messageId)
                : [...prev, messageId]
        );
    };

    const handleSelectAll = () => {
        if (selectedMessages.length === messages.length) {
            setSelectedMessages([]);
        } else {
            setSelectedMessages(messages.map(msg => msg.id));
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedMessages.length === 0) return;

        try {
            switch (action) {
                case 'delete':
                    await bulkDelete(selectedMessages);
                    break;
                case 'mark-sent':
                    await bulkUpdateStatus(selectedMessages, MessageStatus.SENT);
                    break;
                case 'mark-read':
                    await bulkUpdateStatus(selectedMessages, MessageStatus.READ);
                    break;
            }
            setSelectedMessages([]);
        } catch (error) {
            console.error('Bulk action failed:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            [MessageStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            [MessageStatus.SENT]: { color: 'bg-blue-100 text-blue-800', icon: Send },
            [MessageStatus.DELIVERED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            [MessageStatus.READ]: { color: 'bg-green-100 text-green-800', icon: Eye },
            [MessageStatus.FAILED]: { color: 'bg-red-100 text-red-800', icon: XCircle },
            [MessageStatus.SCHEDULED]: { color: 'bg-purple-100 text-purple-800', icon: Calendar },
        };

        const config = statusConfig[status as MessageStatus] || statusConfig[MessageStatus.PENDING];
        const Icon = config.icon;

        return (
            <Badge className={config.color}>
                <Icon className="w-3 h-3 mr-1" />
                {status}
            </Badge>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const priorityConfig = {
            [MessagePriority.LOW]: 'bg-gray-100 text-gray-800',
            [MessagePriority.NORMAL]: 'bg-blue-100 text-blue-800',
            [MessagePriority.HIGH]: 'bg-orange-100 text-orange-800',
            [MessagePriority.URGENT]: 'bg-red-100 text-red-800',
        };

        return (
            <Badge className={priorityConfig[priority as MessagePriority] || priorityConfig[MessagePriority.NORMAL]}>
                {priority}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Messages</h1>
                    <p className="text-gray-600">Manage and monitor all messages</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => refetch()} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                New Message
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Message</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <p className="text-gray-600">Message creation form will be implemented here.</p>
                                <Button onClick={() => setShowCreateDialog(false)}>Close</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unread</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{unreadCount?.total || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
                            <Send className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.recentActivity.last24Hours}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Failed</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.failed}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search messages..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value={MessageStatus.PENDING}>Pending</SelectItem>
                                    <SelectItem value={MessageStatus.SENT}>Sent</SelectItem>
                                    <SelectItem value={MessageStatus.DELIVERED}>Delivered</SelectItem>
                                    <SelectItem value={MessageStatus.READ}>Read</SelectItem>
                                    <SelectItem value={MessageStatus.FAILED}>Failed</SelectItem>
                                    <SelectItem value={MessageStatus.SCHEDULED}>Scheduled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={handleTypeFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value={MessageType.EMAIL}>Email</SelectItem>
                                    <SelectItem value={MessageType.SMS}>SMS</SelectItem>
                                    <SelectItem value={MessageType.PUSH_NOTIFICATION}>Push</SelectItem>
                                    <SelectItem value={MessageType.SYSTEM_NOTIFICATION}>System</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={handlePriorityFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priority</SelectItem>
                                    <SelectItem value={MessagePriority.LOW}>Low</SelectItem>
                                    <SelectItem value={MessagePriority.NORMAL}>Normal</SelectItem>
                                    <SelectItem value={MessagePriority.HIGH}>High</SelectItem>
                                    <SelectItem value={MessagePriority.URGENT}>Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedMessages.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                {selectedMessages.length} message(s) selected
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('mark-sent')}
                                >
                                    Mark as Sent
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('mark-read')}
                                >
                                    Mark as Read
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleBulkAction('delete')}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Messages Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b">
                                <tr>
                                    <th className="text-left p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedMessages.length === messages.length && messages.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded"
                                        />
                                    </th>
                                    <th className="text-left p-4">Subject</th>
                                    <th className="text-left p-4">To</th>
                                    <th className="text-left p-4">Type</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Priority</th>
                                    <th className="text-left p-4">Created</th>
                                    <th className="text-left p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="text-center p-8">
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Loading messages...
                                            </div>
                                        </td>
                                    </tr>
                                ) : messages.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center p-8 text-gray-500">
                                            No messages found
                                        </td>
                                    </tr>
                                ) : (
                                    messages.map((message) => {
                                        const config = message.messageConfig as any;
                                        return (
                                            <tr key={message.id} className="border-b hover:bg-gray-50">
                                                <td className="p-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMessages.includes(message.id)}
                                                        onChange={() => handleSelectMessage(message.id)}
                                                        className="rounded"
                                                    />
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {config?.subject || 'No Subject'}
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {Array.isArray(config?.to) ? config.to.join(', ') : config?.to || 'N/A'}
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline">{config?.type || 'EMAIL'}</Badge>
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(config?.status || MessageStatus.PENDING)}
                                                </td>
                                                <td className="p-4">
                                                    {getPriorityBadge(config?.priority || MessagePriority.NORMAL)}
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-1">
                                                        {config?.status === MessageStatus.PENDING && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => sendMessage(message.id)}
                                                            >
                                                                <Send className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                        {config?.status === MessageStatus.FAILED && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => retryMessage(message.id)}
                                                            >
                                                                <RotateCcw className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                        {config?.status === MessageStatus.SCHEDULED && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => cancelScheduledMessage(message.id)}
                                                            >
                                                                <XCircle className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => markAsRead(message.id)}
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => deleteMessage(message.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {paginatedMessages && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Showing {((queryParams.page - 1) * queryParams.limit) + 1} to{' '}
                        {Math.min(queryParams.page * queryParams.limit, paginatedMessages.pagination.total)} of{' '}
                        {paginatedMessages.pagination.total} messages
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!paginatedMessages.pagination.hasPrev}
                            onClick={() => setQueryParams({ page: queryParams.page - 1 })}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!paginatedMessages.pagination.hasNext}
                            onClick={() => setQueryParams({ page: queryParams.page + 1 })}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MessagesPage() {
    return <MessagesContent />;
}
