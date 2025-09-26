'use client';

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  X,
  Clock,
  User,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationProps {
  type: 'new-message' | 'new-contact' | 'status-update' | 'message-deleted';
  data: any;
  onClose: () => void;
  onView?: () => void;
}

export function MessageNotification({
  type,
  data,
  onClose,
  onView,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getNotificationConfig = () => {
    switch (type) {
      case 'new-message':
        return {
          icon: Mail,
          title: 'New Message',
          color: 'border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-900',
          badgeColor: 'bg-blue-100 text-blue-800',
        };
      case 'new-contact':
        return {
          icon: User,
          title: 'New Contact Message',
          color:
            'border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100',
          iconColor: 'text-emerald-600',
          textColor: 'text-emerald-900',
          badgeColor: 'bg-emerald-100 text-emerald-800',
        };
      case 'status-update':
        return {
          icon: CheckCircle,
          title: 'Message Status Updated',
          color: 'border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100',
          iconColor: 'text-amber-600',
          textColor: 'text-amber-900',
          badgeColor: 'bg-amber-100 text-amber-800',
        };
      case 'message-deleted':
        return {
          icon: AlertCircle,
          title: 'Message Deleted',
          color: 'border-red-300 bg-gradient-to-r from-red-50 to-red-100',
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
          badgeColor: 'bg-red-100 text-red-800',
        };
      default:
        return {
          icon: Mail,
          title: 'Notification',
          color: 'border-gray-200 bg-gray-50',
          iconColor: 'text-gray-600',
          textColor: 'text-gray-800',
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <Card
      className={cn(
        'fixed top-4 right-4 z-50 w-80 shadow-lg transition-all duration-300',
        config.color,
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <CardContent className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start space-x-3'>
            <Icon className={cn('h-5 w-5 mt-0.5', config.iconColor)} />
            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-2 mb-1'>
                <h4 className={cn('text-sm font-semibold', config.textColor)}>
                  {config.title}
                </h4>
                <Badge className={cn('text-xs', config.badgeColor)}>
                  <Clock className='h-3 w-3 mr-1' />
                  Now
                </Badge>
              </div>

              {type === 'new-contact' && data && (
                <div className='space-y-1'>
                  <p className={cn('text-sm', config.textColor)}>
                    <User className='h-3 w-3 inline mr-1' />
                    {data.name}
                  </p>
                  <p className={cn('text-sm', config.textColor)}>
                    <Mail className='h-3 w-3 inline mr-1' />
                    {data.email}
                  </p>
                  <p className={cn('text-sm font-medium', config.textColor)}>
                    Subject: {data.subject}
                  </p>
                </div>
              )}

              {type === 'new-message' && data && (
                <p className={cn('text-sm', config.textColor)}>
                  New message from: {data.messageConfig?.from || 'Unknown'}
                </p>
              )}

              {type === 'status-update' && data && (
                <p className={cn('text-sm', config.textColor)}>
                  Status changed to: {data.status}
                </p>
              )}

              {type === 'message-deleted' && data && (
                <p className={cn('text-sm', config.textColor)}>
                  Message ID: {data.id} has been deleted
                </p>
              )}
            </div>
          </div>

          <div className='flex items-center space-x-1'>
            {onView && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onView}
                className='h-6 px-2 text-xs'
              >
                View
              </Button>
            )}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className='h-6 w-6 p-0'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface NotificationContainerProps {
  notifications: Array<{
    id: string;
    type: 'new-message' | 'new-contact' | 'status-update' | 'message-deleted';
    data: any;
  }>;
  onRemoveNotification: (id: string) => void;
  onViewMessage?: (messageId: string) => void;
}

export function NotificationContainer({
  notifications,
  onRemoveNotification,
  onViewMessage,
}: NotificationContainerProps) {
  return (
    <div className='fixed top-4 right-4 z-50 space-y-2'>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            transform: `translateY(${index * 20}px)`,
            zIndex: 50 - index,
          }}
        >
          <MessageNotification
            type={notification.type}
            data={notification.data}
            onClose={() => onRemoveNotification(notification.id)}
            onView={
              onViewMessage
                ? () => onViewMessage(notification.data.id)
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}
