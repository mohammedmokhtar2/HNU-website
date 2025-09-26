'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSocket } from '@/hooks/use-socket';
import { Mail, User, CheckCircle, AlertCircle, Reply } from 'lucide-react';

export function useMessageNotifications() {
  const {
    isConnected,
    newMessage,
    newContactMessage,
    messageStatusUpdate,
    messageDeleted,
  } = useSocket();

  useEffect(() => {
    if (newMessage) {
      const config = newMessage.messageConfig as any;

      toast.success('New Message Received', {
        description: `From: ${config?.from || 'Unknown'}`,
        duration: 5000,
        action: {
          label: 'View',
          onClick: () => {
            // Scroll to message in the list
            const messageElement = document.querySelector(
              `[data-message-id="${newMessage.id}"]`
            );
            if (messageElement) {
              messageElement.scrollIntoView({ behavior: 'smooth' });
            }
          },
        },
      });
    }
  }, [newMessage]);

  useEffect(() => {
    if (newContactMessage) {
      toast.success('New Contact Message', {
        description: `${newContactMessage.name} - ${newContactMessage.subject}`,
        duration: 5000,
        action: {
          label: 'Reply',
          onClick: () => {
            // Find the message and trigger reply modal
            const messageElement = document.querySelector(
              `[data-message-id="${newContactMessage.id}"]`
            );
            if (messageElement) {
              messageElement.scrollIntoView({ behavior: 'smooth' });
              // Trigger reply button click
              const replyButton = messageElement.querySelector(
                '[data-reply-button]'
              ) as HTMLButtonElement;
              if (replyButton) {
                replyButton.click();
              }
            }
          },
        },
      });
    }
  }, [newContactMessage]);

  useEffect(() => {
    if (messageStatusUpdate) {
      toast.info('Message Status Updated', {
        description: `Status changed to: ${messageStatusUpdate.status}`,
        duration: 3000,
      });
    }
  }, [messageStatusUpdate]);

  useEffect(() => {
    if (messageDeleted) {
      toast.error('Message Deleted', {
        description: `Message ID: ${messageDeleted.id}`,
        duration: 3000,
      });
    }
  }, [messageDeleted]);

  return {
    isConnected,
  };
}
