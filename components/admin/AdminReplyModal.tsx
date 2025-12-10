'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageService } from '@/services/message.service';
import {
  MessageConfig,
  MessageStatus,
  MessageType,
  MessagePriority,
} from '@/types/message';
import { Mail, Send, User, Calendar, MessageSquare, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface AdminReplyModalProps {
  message: {
    id: string;
    messageConfig: any;
    createdAt: string;
    updatedAt: string;
  };
  children: React.ReactNode;
}

export function AdminReplyModal({ message, children }: AdminReplyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [replyData, setReplyData] = useState({
    subject: '',
    message: '',
  });
  const { toast } = useToast();

  const config = message.messageConfig as any;
  const originalSender = config?.from || 'Unknown';
  const originalSubject = config?.subject || 'No Subject';
  const originalMessage = config?.body || 'No Message';

  const handleReply = async () => {
    if (!replyData.subject.trim() || !replyData.message.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both subject and message fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      const replyConfig: MessageConfig = {
        from: config?.to || 'admin@university.edu', // Admin email
        to: originalSender,
        subject: `Re: ${originalSubject}`,
        body: replyData.message,
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Reply from Admin
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Original Message:</strong></p>
              <p style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
                ${originalMessage.replace(/\n/g, '<br>')}
              </p>
            </div>
            <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
              <h3 style="color: #333; margin-top: 0;">Admin Reply:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${replyData.message}</p>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 12px; text-align: center;">
              This is an automated reply from the university administration.
            </p>
          </div>
        `,
        status: MessageStatus.PENDING,
        type: MessageType.EMAIL,
        priority: MessagePriority.NORMAL,
        retryCount: 0,
        maxRetries: 3,
        metadata: {
          source: 'admin_reply',
          originalMessageId: message.id,
          adminReply: true,
          timestamp: new Date().toISOString(),
        },
      };

      await MessageService.createMessage({ messageConfig: replyConfig });

      toast({
        title: 'Reply Sent',
        description: 'Your reply has been sent successfully.',
      });

      // Reset form and close modal
      setReplyData({ subject: '', message: '' });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error sending reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reply. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReplyData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Reply className='h-5 w-5 text-blue-600' />
            Reply to Message
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Original Message */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Original Message
            </h3>
            <div className='bg-gray-50 p-4 rounded-lg border'>
              <div className='flex items-center gap-4 mb-3'>
                <div className='flex items-center gap-2'>
                  <User className='h-4 w-4 text-gray-500' />
                  <span className='font-medium'>{originalSender}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-gray-500' />
                  <span className='text-sm text-gray-500'>
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              <div className='space-y-2'>
                <div>
                  <Label className='text-sm font-medium text-gray-700'>
                    Subject
                  </Label>
                  <p className='text-sm text-gray-900'>{originalSubject}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-700'>
                    Message
                  </Label>
                  <div className='bg-white p-3 rounded border text-sm text-gray-900 whitespace-pre-wrap'>
                    {originalMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reply Form */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Your Reply</h3>

            <div className='space-y-4'>
              <div>
                <Label htmlFor='subject'>Subject</Label>
                <Input
                  id='subject'
                  name='subject'
                  value={replyData.subject}
                  onChange={handleInputChange}
                  placeholder={`Re: ${originalSubject}`}
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='message'>Message</Label>
                <Textarea
                  id='message'
                  name='message'
                  value={replyData.message}
                  onChange={handleInputChange}
                  placeholder='Type your reply here...'
                  rows={6}
                  className='mt-1'
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button
              variant='outline'
              onClick={() => setIsOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReply}
              disabled={
                isSending ||
                !replyData.subject.trim() ||
                !replyData.message.trim()
              }
              className='bg-blue-600 hover:bg-blue-700'
            >
              {isSending ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                  Sending...
                </>
              ) : (
                <>
                  <Send className='h-4 w-4 mr-2' />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
