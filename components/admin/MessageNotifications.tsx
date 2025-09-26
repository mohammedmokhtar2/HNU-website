'use client';

import React, { useState } from 'react';
import { Bell, Mail, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUnreadMessages } from '@/hooks/use-unread-messages';
import { useMessage } from '@/contexts/MessageContext';
import { MessageStatus, MessageType } from '@/types/message';
import { format } from 'date-fns';

interface MessageNotificationProps {
  className?: string;
}

export function MessageNotifications({ className }: MessageNotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadCount, isLoading } = useUnreadMessages();
  const { messages, markAsRead, refetch } = useMessage();

  // Get recent unread messages (last 10)
  const recentUnreadMessages = messages
    .filter(msg => {
      const config = msg.messageConfig as any;
      return (
        config?.status === MessageStatus.PENDING ||
        config?.status === MessageStatus.SENT
      );
    })
    .slice(0, 10);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsRead(messageId);
      refetch();
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const promises = recentUnreadMessages.map(msg => markAsRead(msg.id));
      await Promise.all(promises);
      refetch();
    } catch (error) {
      console.error('Failed to mark all messages as read:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case MessageStatus.PENDING:
        return <Clock className='w-4 h-4 text-yellow-500' />;
      case MessageStatus.SENT:
        return <CheckCircle className='w-4 h-4 text-blue-500' />;
      case MessageStatus.FAILED:
        return <AlertCircle className='w-4 h-4 text-red-500' />;
      default:
        return <Mail className='w-4 h-4 text-gray-500' />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case MessageType.EMAIL:
        return <Mail className='w-3 h-3' />;
      case MessageType.SMS:
        return <span className='text-xs'>SMS</span>;
      case MessageType.PUSH_NOTIFICATION:
        return <Bell className='w-3 h-3' />;
      case MessageType.SYSTEM_NOTIFICATION:
        return <AlertCircle className='w-3 h-3' />;
      default:
        return <Mail className='w-3 h-3' />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='sm' className={`relative ${className}`}>
          <Bell className='w-4 h-4' />
          {unreadCount && unreadCount.total > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs'
            >
              {unreadCount.total > 99 ? '99+' : unreadCount.total}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-0' align='end'>
        <Card className='border-0 shadow-none'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-sm font-medium'>Messages</CardTitle>
              <div className='flex items-center gap-2'>
                {recentUnreadMessages.length > 0 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleMarkAllAsRead}
                    className='h-6 px-2 text-xs'
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsOpen(false)}
                  className='h-6 w-6 p-0'
                >
                  <X className='w-3 h-3' />
                </Button>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='p-4 text-center text-sm text-gray-500'>
                Loading messages...
              </div>
            ) : recentUnreadMessages.length === 0 ? (
              <div className='p-4 text-center text-sm text-gray-500'>
                <Mail className='w-8 h-8 mx-auto mb-2 text-gray-300' />
                No unread messages
              </div>
            ) : (
              <ScrollArea className='h-80'>
                <div className='space-y-1'>
                  {recentUnreadMessages.map(message => {
                    const config = message.messageConfig as any;
                    return (
                      <div
                        key={message.id}
                        className='flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer'
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        <div className='flex-shrink-0 mt-0.5'>
                          {getStatusIcon(config?.status)}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <Badge variant='outline' className='text-xs'>
                              {getTypeIcon(config?.type || MessageType.EMAIL)}
                            </Badge>
                            <span className='text-xs text-gray-500'>
                              {format(
                                new Date(message.createdAt),
                                'MMM dd, HH:mm'
                              )}
                            </span>
                          </div>
                          <p className='text-sm font-medium text-gray-900 truncate'>
                            {config?.subject || 'No Subject'}
                          </p>
                          <p className='text-xs text-gray-500 truncate'>
                            To:{' '}
                            {Array.isArray(config?.to)
                              ? config.to.join(', ')
                              : config?.to || 'N/A'}
                          </p>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100'
                          onClick={e => {
                            e.stopPropagation();
                            handleMarkAsRead(message.id);
                          }}
                        >
                          <CheckCircle className='w-3 h-3' />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
          {recentUnreadMessages.length > 0 && (
            <>
              <Separator />
              <div className='p-3'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full'
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to messages page
                    window.location.href = '/admin/system/messages';
                  }}
                >
                  View all messages
                </Button>
              </div>
            </>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
}
