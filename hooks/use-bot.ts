'use client';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import BotService, { AiBotResponse } from '../services/bot.service';

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface UseBotReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
  clearSession: () => void;
}

export function useBot(): UseBotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  // Save messages to localStorage
  const saveMessages = useCallback(
    (messagesToSave: ChatMessage[]) => {
      if (sessionId && typeof window !== 'undefined') {
        localStorage.setItem(
          `bot_messages_${sessionId}`,
          JSON.stringify(messagesToSave)
        );
      }
    },
    [sessionId]
  );

  // Initialize session ID and load messages on mount
  useEffect(() => {
    const id = BotService.getSessionId();
    setSessionId(id);

    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem(`bot_messages_${id}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages, sessionId, saveMessages]);

  // Mutation for sending messages to the bot
  const sendMessageMutation = useMutation<AiBotResponse, Error, string>({
    mutationFn: async (content: string) => {
      if (!sessionId) {
        throw new Error('Session ID not available');
      }
      return await BotService.postRequest({ content, sessionId });
    },
    onSuccess: data => {
      // Add bot response to messages
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: data.output,
          timestamp: new Date(),
        },
      ]);
    },
    onError: () => {
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    },
  });

  const sendMessage = (content: string) => {
    if (!content.trim() || !sessionId) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      from: 'user',
      text: content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Send to bot
    sendMessageMutation.mutate(content);
  };

  const clearMessages = () => {
    setMessages([]);
    if (sessionId) {
      BotService.clearSessionMessages(sessionId);
    }
  };

  const clearSession = () => {
    // Clear current session messages
    if (sessionId) {
      BotService.clearSessionMessages(sessionId);
    }

    // Generate new session
    BotService.clearSessionId();
    const newSessionId = BotService.getSessionId();
    setSessionId(newSessionId);
    setMessages([]);
  };

  return {
    messages,
    isLoading: sendMessageMutation.isPending,
    error: sendMessageMutation.error,
    sendMessage,
    clearMessages,
    clearSession,
  };
}
