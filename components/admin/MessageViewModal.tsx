'use client';

import React, { useState } from 'react';
import { Message } from '@/types/message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Mail,
  User,
  Calendar,
  Clock,
  Send,
  Reply,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { MessageStatus, MessagePriority } from '@/types/message';
import {
  generateMessageReplyHTML,
  generateMessageReplyText,
} from '@/lib/email-templates';
import { useUniversity } from '@/contexts/UniversityContext';

interface MessageViewModalProps {
  message: Message;
  children: React.ReactNode;
  onReply?: (replyData: {
    subject: string;
    body: string;
    htmlBody: string;
  }) => Promise<void>;
  onMarkAsRead?: (messageId: string) => Promise<void>;
}

export function MessageViewModal({
  message,
  children,
  onReply,
  onMarkAsRead,
}: MessageViewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyData, setReplyData] = useState({
    subject: '',
    body: '',
  });
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const config = message.messageConfig as any;
  const { university } = useUniversity();

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
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
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

  const handleOpen = async () => {
    setIsOpen(true);
    // Auto-mark as read when opening
    if (config?.status !== MessageStatus.READ && onMarkAsRead) {
      try {
        await onMarkAsRead(message.id);
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }
  };

  const handleReply = () => {
    setIsReplying(true);
    // Pre-fill subject with "Re: " prefix
    const originalSubject = config?.subject || 'No Subject';
    setReplyData({
      subject: originalSubject.startsWith('Re: ')
        ? originalSubject
        : `Re: ${originalSubject}`,
      body: '',
    });
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyData({ subject: '', body: '' });
  };

  const handleSubmitReply = async () => {
    if (!onReply || !replyData.subject.trim() || !replyData.body.trim()) {
      return;
    }

    setIsSubmittingReply(true);
    try {
      // Generate comprehensive HTML and text versions using the template
      const htmlBody = generateMessageReplyHTML({
        subject: replyData.subject,
        body: replyData.body,
        originalMessage: {
          subject: config?.subject || 'No Subject',
          from: config?.from || 'Unknown',
          date: new Date(message.createdAt),
          body: config?.body || 'No content available',
        },
        universityConfig: university?.config,
      });

      const textBody = generateMessageReplyText({
        subject: replyData.subject,
        body: replyData.body,
        originalMessage: {
          subject: config?.subject || 'No Subject',
          from: config?.from || 'Unknown',
          date: new Date(message.createdAt),
          body: config?.body || 'No content available',
        },
        universityConfig: university?.config,
      });

      await onReply({
        subject: replyData.subject,
        body: textBody, // Use the formatted text version as the plain text body
        htmlBody,
      });

      setIsReplying(false);
      setReplyData({ subject: '', body: '' });
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={handleOpen}>{children}</div>
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Mail className='w-5 h-5' />
            Message Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Message Header */}
          <Card>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='text-lg'>
                    {config?.subject || 'No Subject'}
                  </CardTitle>
                  <div className='flex items-center gap-2 mt-2'>
                    {getStatusBadge(config?.status || MessageStatus.PENDING)}
                    {getPriorityBadge(
                      config?.priority || MessagePriority.NORMAL
                    )}
                  </div>
                </div>
                <div className='text-right text-sm text-gray-600'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-4 h-4' />
                    {format(new Date(message.createdAt), 'MMM dd, yyyy')}
                  </div>
                  <div className='flex items-center gap-1 mt-1'>
                    <Clock className='w-4 h-4' />
                    {format(new Date(message.createdAt), 'HH:mm')}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center gap-2'>
                  <User className='w-4 h-4 text-gray-500' />
                  <div>
                    <Label className='text-sm font-medium text-gray-600'>
                      From
                    </Label>
                    <p className='text-sm'>{config?.from || 'Unknown'}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Mail className='w-4 h-4 text-gray-500' />
                  <div>
                    <Label className='text-sm font-medium text-gray-600'>
                      To
                    </Label>
                    <p className='text-sm'>
                      {Array.isArray(config?.to)
                        ? config.to.join(', ')
                        : config?.to || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Message Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='p-4 rounded-lg'>
                <pre className='whitespace-pre-wrap text-sm text-white font-sans'>
                  {config?.body || 'No content available'}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          {config?.metadata && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {config.metadata.source && (
                    <div className='flex items-center gap-2'>
                      <Label className='text-sm font-medium text-gray-600 w-20'>
                        Source:
                      </Label>
                      <Badge variant='outline'>{config.metadata.source}</Badge>
                    </div>
                  )}
                  {config.metadata.sectionId && (
                    <div className='flex items-center gap-2'>
                      <Label className='text-sm font-medium text-gray-600 w-20'>
                        Section:
                      </Label>
                      <span className='text-sm'>
                        {config.metadata.sectionId}
                      </span>
                    </div>
                  )}
                  {config.metadata.userAgent && (
                    <div className='flex items-start gap-2'>
                      <Label className='text-sm font-medium text-gray-600 w-20'>
                        User Agent:
                      </Label>
                      <span className='text-xs text-gray-500 break-all'>
                        {config.metadata.userAgent}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reply Section */}
          {config?.metadata?.source === 'contact_form' && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Reply className='w-5 h-5' />
                  Reply to Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isReplying ? (
                  <Button onClick={handleReply} className='w-full'>
                    <Reply className='w-4 h-4 mr-2' />
                    Reply to Sender
                  </Button>
                ) : (
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='reply-subject'>Subject</Label>
                      <Input
                        id='reply-subject'
                        value={replyData.subject}
                        onChange={e =>
                          setReplyData(prev => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        className='mt-1'
                      />
                    </div>
                    <div>
                      <Label htmlFor='reply-body'>Message</Label>
                      <Textarea
                        id='reply-body'
                        value={replyData.body}
                        onChange={e =>
                          setReplyData(prev => ({
                            ...prev,
                            body: e.target.value,
                          }))
                        }
                        rows={8}
                        className='mt-1'
                        placeholder='Type your reply message here...'
                      />
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        onClick={handleSubmitReply}
                        disabled={
                          isSubmittingReply ||
                          !replyData.subject.trim() ||
                          !replyData.body.trim()
                        }
                        className='flex-1'
                      >
                        {isSubmittingReply ? (
                          <>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className='w-4 h-4 mr-2' />
                            Send Reply
                          </>
                        )}
                      </Button>
                      <Button
                        variant='outline'
                        onClick={handleCancelReply}
                        disabled={isSubmittingReply}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
