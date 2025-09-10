'use client';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
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

  // Initialize session ID on mount
  useEffect(() => {
    const id = BotService.getSessionId();
    setSessionId(id);
  }, []);

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
  };

  const clearSession = () => {
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
