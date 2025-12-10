'use client';

import React, { useState, useEffect } from 'react';
import { useMessage } from '@/contexts/MessageContext';
import { MessageStatus, MessageType, MessagePriority } from '@/types/message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageViewModal } from '@/components/admin/MessageViewModal';
import { EmailConfigSection } from '@/components/admin/EmailConfigSection';
import {
  Mail,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  RotateCcw,
  Calendar,
  MoreHorizontal,
  Wifi,
  WifiOff,
  Reply,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function MessagesContent() {
  const {
    messages,
    paginatedMessages,
    stats,
    unreadCount,
    loading,
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
    sendReply,
    searchMessages,
    filterByStatus,
    filterByType,
    filterByPriority,
  } = useMessage();

  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      refetchStats();
    }, 50000);

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

  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      // Prepare data for export
      const exportData = messages.map(message => {
        const config = message.messageConfig as any;
        return {
          'Message ID': message.id,
          Subject: config?.subject || 'No Subject',
          From: Array.isArray(config?.from)
            ? config.from.join(', ')
            : config?.from || 'N/A',
          To: Array.isArray(config?.to)
            ? config.to.join(', ')
            : config?.to || 'N/A',
          Type: config?.type || 'EMAIL',
          Status: config?.status || MessageStatus.PENDING,
          Priority: config?.priority || MessagePriority.NORMAL,
          'Created At': format(
            new Date(message.createdAt),
            'yyyy-MM-dd HH:mm:ss'
          ),
          'Updated At': format(
            new Date(message.updatedAt),
            'yyyy-MM-dd HH:mm:ss'
          ),
          'Message Body': config?.body || 'No content',
          'HTML Body': config?.htmlBody || 'No HTML content',
          'Retry Count': config?.retryCount || 0,
          'Max Retries': config?.maxRetries || 3,
          Source: config?.metadata?.source || 'Unknown',
          'Section ID': config?.metadata?.sectionId || 'N/A',
          'User Agent': config?.metadata?.userAgent || 'N/A',
          'Admin Reply': config?.metadata?.adminReply ? 'Yes' : 'No',
          'Original Message ID': config?.metadata?.originalMessageId || 'N/A',
          'Replied At': config?.repliedAt
            ? format(new Date(config.repliedAt), 'yyyy-MM-dd HH:mm:ss')
            : 'N/A',
          'Reply Message ID': config?.replyMessageId || 'N/A',
        };
      });

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Message ID
        { wch: 30 }, // Subject
        { wch: 25 }, // From
        { wch: 25 }, // To
        { wch: 10 }, // Type
        { wch: 12 }, // Status
        { wch: 10 }, // Priority
        { wch: 20 }, // Created At
        { wch: 20 }, // Updated At
        { wch: 50 }, // Message Body
        { wch: 50 }, // HTML Body
        { wch: 12 }, // Retry Count
        { wch: 12 }, // Max Retries
        { wch: 15 }, // Source
        { wch: 15 }, // Section ID
        { wch: 30 }, // User Agent
        { wch: 12 }, // Admin Reply
        { wch: 20 }, // Original Message ID
        { wch: 20 }, // Replied At
        { wch: 20 }, // Reply Message ID
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const fileName = `messages_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`;

      saveAs(blob, fileName);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export messages. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      [MessageStatus.PENDING]: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
      },
      [MessageStatus.SENT]: { color: 'bg-blue-100 text-blue-800', icon: Send },
      [MessageStatus.DELIVERED]: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      [MessageStatus.READ]: { color: 'bg-green-100 text-green-800', icon: Eye },
      [MessageStatus.FAILED]: {
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
      },
      [MessageStatus.SCHEDULED]: {
        color: 'bg-purple-100 text-purple-800',
        icon: Calendar,
      },
    };

    const config =
      statusConfig[status as MessageStatus] ||
      statusConfig[MessageStatus.PENDING];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className='w-3 h-3 mr-1' />
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
      <Badge
        className={
          priorityConfig[priority as MessagePriority] ||
          priorityConfig[MessagePriority.NORMAL]
        }
      >
        {priority}
      </Badge>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Messages
            </h1>
            <p className='text-gray-600'>Manage and monitor all messages</p>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={handleExportToExcel}
            variant='outline'
            size='sm'
            className='hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800'
            disabled={isExporting || messages.length === 0}
          >
            {isExporting ? (
              <>
                <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                Exporting...
              </>
            ) : (
              <>
                <Download className='w-4 h-4 mr-2' />
                Export to Excel
              </>
            )}
          </Button>
          <Button
            onClick={() => refetch()}
            variant='outline'
            size='sm'
            className='hover:bg-blue-50'
          >
            <RefreshCw className='w-4 h-4 mr-2' />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card className='border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Total Messages
              </CardTitle>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Mail className='h-4 w-4 text-blue-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-blue-600'>
                {stats.total}
              </div>
              <p className='text-xs text-gray-500 mt-1'>All time</p>
            </CardContent>
          </Card>
          <Card className='border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Unread
              </CardTitle>
              <div className='p-2 bg-orange-100 rounded-lg'>
                <AlertCircle className='h-4 w-4 text-orange-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-orange-600'>
                {unreadCount?.total || 0}
              </div>
              <p className='text-xs text-gray-500 mt-1'>Requires attention</p>
            </CardContent>
          </Card>
          <Card className='border-l-4 border-l-green-500 hover:shadow-lg transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Sent Today
              </CardTitle>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Send className='h-4 w-4 text-green-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-green-600'>
                {stats.recentActivity?.last24Hours || 0}
              </div>
              <p className='text-xs text-gray-500 mt-1'>Last 24 hours</p>
            </CardContent>
          </Card>
          <Card className='border-l-4 border-l-red-500 hover:shadow-lg transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Failed
              </CardTitle>
              <div className='p-2 bg-red-100 rounded-lg'>
                <XCircle className='h-4 w-4 text-red-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-red-600'>
                {stats.failed}
              </div>
              <p className='text-xs text-gray-500 mt-1'>Need retry</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className='border-0 shadow-sm '>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  placeholder='Search messages by subject, content, or sender...'
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className='pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>
            <div className='flex gap-3'>
              <Select onValueChange={handleStatusFilter}>
                <SelectTrigger className='w-36 h-11 border-gray-200'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value={MessageStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={MessageStatus.SENT}>Sent</SelectItem>
                  <SelectItem value={MessageStatus.DELIVERED}>
                    Delivered
                  </SelectItem>
                  <SelectItem value={MessageStatus.READ}>Read</SelectItem>
                  <SelectItem value={MessageStatus.FAILED}>Failed</SelectItem>
                  <SelectItem value={MessageStatus.SCHEDULED}>
                    Scheduled
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleTypeFilter}>
                <SelectTrigger className='w-36 h-11 border-gray-200'>
                  <SelectValue placeholder='Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  <SelectItem value={MessageType.EMAIL}>Email</SelectItem>
                  <SelectItem value={MessageType.SMS}>SMS</SelectItem>
                  <SelectItem value={MessageType.PUSH_NOTIFICATION}>
                    Push
                  </SelectItem>
                  <SelectItem value={MessageType.SYSTEM_NOTIFICATION}>
                    System
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>
                {selectedMessages.length} message(s) selected
              </span>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleBulkAction('mark-sent')}
                >
                  Mark as Sent
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleBulkAction('mark-read')}
                >
                  Mark as Read
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className='w-4 h-4 mr-2' />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages Table */}
      <Card className='overflow-hidden shadow-sm'>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='text-white border-b'>
                <tr>
                  <th className='text-left p-4 font-semibold text-white'>
                    <input
                      type='checkbox'
                      checked={
                        selectedMessages.length === messages.length &&
                        messages.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='text-left p-4 font-semibold text-white'>
                    Subject
                  </th>
                  <th className='text-left p-4 font-semibold  text-white'>
                    from
                  </th>
                  <th className='text-left p-4 font-semibold text-white'>
                    Type
                  </th>
                  <th className='text-left p-4 font-semibold  text-white'>
                    Status
                  </th>
                  <th className='text-left p-4 font-semibold  text-white'>
                    Priority
                  </th>
                  <th className='text-left p-4 font-semibold  text-white'>
                    Created
                  </th>
                  <th className='text-left p-4 font-semibold  text-white'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className='text-center p-12'>
                      <div className='flex items-center justify-center'>
                        <RefreshCw className='w-5 h-5 mr-2 animate-spin text-blue-600' />
                        <span className='text-gray-600'>
                          Loading messages...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan={8} className='text-center p-12 text-gray-500'>
                      <div className='flex flex-col items-center'>
                        <Mail className='w-12 h-12 text-gray-300 mb-4' />
                        <p className='text-lg font-medium'>No messages found</p>
                        <p className='text-sm'>
                          Try adjusting your filters or search terms
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  messages.map(message => {
                    const isReply =
                      message.messageConfig?.metadata?.source === 'admin_reply';
                    if (isReply) return null;
                    const config = message.messageConfig as any;
                    return (
                      <tr
                        key={message.id}
                        className='border-b transition-colors'
                        data-message-id={message.id}
                      >
                        <td className='p-4'>
                          <input
                            type='checkbox'
                            checked={selectedMessages.includes(message.id)}
                            onChange={() => handleSelectMessage(message.id)}
                            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                          />
                        </td>
                        <td className='p-4 font-medium text-gray-900'>
                          <MessageViewModal
                            message={message}
                            onReply={async replyData => {
                              try {
                                const result = await sendReply(
                                  message.id,
                                  replyData
                                );
                                if (!result.success) {
                                  console.error(
                                    'Failed to send reply:',
                                    result.error
                                  );
                                }
                              } catch (error) {
                                console.error('Error sending reply:', error);
                              }
                            }}
                            onMarkAsRead={async messageId => {
                              try {
                                await markAsRead(messageId);
                              } catch (error) {
                                console.error('Error marking as read:', error);
                              }
                            }}
                          >
                            <button className='text-blue-600 hover:text-blue-800 hover:underline text-left'>
                              {config?.subject || 'No Subject'}
                            </button>
                          </MessageViewModal>
                        </td>
                        <td className='p-4 text-sm text-gray-600'>
                          {Array.isArray(config?.from)
                            ? config.from.join(', ')
                            : config?.from || 'N/A'}
                        </td>
                        <td className='p-4'>
                          <Badge variant='outline' className='text-xs'>
                            {config?.type || 'EMAIL'}
                          </Badge>
                        </td>
                        <td className='p-4'>
                          {getStatusBadge(
                            config?.status || MessageStatus.PENDING
                          )}
                        </td>
                        <td className='p-4'>
                          {getPriorityBadge(
                            config?.priority || MessagePriority.NORMAL
                          )}
                        </td>
                        <td className='p-4 text-sm text-gray-600'>
                          {format(
                            new Date(message.createdAt),
                            'MMM dd, yyyy HH:mm'
                          )}
                        </td>
                        <td className='p-4'>
                          <div className='flex gap-1'>
                            {config?.status === MessageStatus.PENDING &&
                              !isReply && (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => sendMessage(message.id)}
                                >
                                  <Send className='w-3 h-3' />
                                </Button>
                              )}
                            {config?.status === MessageStatus.FAILED &&
                              !isReply && (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => retryMessage(message.id)}
                                >
                                  <RotateCcw className='w-3 h-3' />
                                </Button>
                              )}
                            {config?.status === MessageStatus.SCHEDULED &&
                              !isReply && (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() =>
                                    cancelScheduledMessage(message.id)
                                  }
                                >
                                  <XCircle className='w-3 h-3' />
                                </Button>
                              )}
                            {!isReply && (
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => markAsRead(message.id)}
                              >
                                <Eye className='w-3 h-3' />
                              </Button>
                            )}
                            {!isReply && (
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => deleteMessage(message.id)}
                              >
                                <Trash2 className='w-3 h-3' />
                              </Button>
                            )}
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
        <div className='flex justify-between items-center'>
          <div className='text-sm text-gray-600'>
            Showing {(queryParams.page - 1) * queryParams.limit + 1} to{' '}
            {Math.min(
              queryParams.page * queryParams.limit,
              paginatedMessages.pagination.total
            )}{' '}
            of {paginatedMessages.pagination.total} messages
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={!paginatedMessages.pagination.hasPrev}
              onClick={() => setQueryParams({ page: queryParams.page - 1 })}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={!paginatedMessages.pagination.hasNext}
              onClick={() => setQueryParams({ page: queryParams.page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Email Configuration Section */}
      <EmailConfigSection />
    </div>
  );
}

export default function MessagesPage() {
  return <MessagesContent />;
}
