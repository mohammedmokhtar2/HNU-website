'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSocketConfig } from '@/lib/socket-config';

interface SocketMessage {
  id: string;
  messageConfig: any;
  createdAt: string;
  updatedAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  newMessage: SocketMessage | null;
  newContactMessage: ContactMessage | null;
  messageStatusUpdate: any;
  messageDeleted: any;
}

export function useSocket(): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState<SocketMessage | null>(null);
  const [newContactMessage, setNewContactMessage] =
    useState<ContactMessage | null>(null);
  const [messageStatusUpdate, setMessageStatusUpdate] = useState<any>(null);
  const [messageDeleted, setMessageDeleted] = useState<any>(null);

  useEffect(() => {
    const config = getSocketConfig();
    const socketInstance = io(config.url, {
      path: config.path,
      transports: config.transports,
      autoConnect: config.autoConnect,
    });

    socketInstance.on('connect', () => {
      console.log('Admin socket connected');
      setIsConnected(true);
      // Join admin room
      socketInstance.emit('join-admin');
    });

    socketInstance.on('disconnect', () => {
      console.log('Admin socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', error => {
      console.error('Admin socket connection error:', error);
      setIsConnected(false);
    });

    socketInstance.on('error', error => {
      console.error('Admin socket error:', error);
    });

    // Listen for new messages
    socketInstance.on('new-message', (data: SocketMessage) => {
      console.log('New message received:', data);
      setNewMessage(data);
      // Clear after 5 seconds
      setTimeout(() => setNewMessage(null), 5000);
    });

    // Listen for new contact messages
    socketInstance.on('new-contact-message', (data: ContactMessage) => {
      console.log('New contact message received:', data);
      setNewContactMessage(data);
      // Clear after 10 seconds
      setTimeout(() => setNewContactMessage(null), 10000);
    });

    // Listen for message status updates
    socketInstance.on('message-status-changed', (data: any) => {
      console.log('Message status updated:', data);
      setMessageStatusUpdate(data);
      // Clear after 3 seconds
      setTimeout(() => setMessageStatusUpdate(null), 3000);
    });

    // Listen for message deletions
    socketInstance.on('message-deleted', (data: any) => {
      console.log('Message deleted:', data);
      setMessageDeleted(data);
      // Clear after 3 seconds
      setTimeout(() => setMessageDeleted(null), 3000);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.emit('leave-admin');
      socketInstance.disconnect();
    };
  }, []);

  return {
    socket,
    isConnected,
    newMessage,
    newContactMessage,
    messageStatusUpdate,
    messageDeleted,
  };
}
