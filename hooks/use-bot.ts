'use client';
import { useState, useEffect, useCallback } from 'react';
import BotService from '../services/bot.service'; // We still use this for session management

// This interface remains IDENTICAL to your old one, so the UI won't break.
export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// The hook's return type also remains the same.
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
  
  // NEW state management, replacing useMutation's state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // --- ALL YOUR LOCALSTORAGE AND SESSION LOGIC REMAINS UNCHANGED ---
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

  useEffect(() => {
    const id = BotService.getSessionId();
    setSessionId(id);
    const savedMessages = localStorage.getItem(`bot_messages_${id}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        console.error('Failed to load saved messages:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (sessionId && messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages, sessionId, saveMessages]);
  // --- END OF YOUR UNCHANGED LOCALSTORAGE LOGIC ---


  // --- THE NEW sendMessage FUNCTION ---
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message immediately, using your existing ChatMessage format
    const userMessage: ChatMessage = {
      from: 'user',
      text: content,
      timestamp: new Date(),
    };
    // Add a placeholder for the bot's response
    const botPlaceholder: ChatMessage = {
      from: 'bot',
      text: '', // Start with empty text
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage, botPlaceholder]);
    
    setIsLoading(true);
    setError(null);

    try {
      // NEW: The streaming fetch call
      const response = await fetch('https://mokh2x-hnu-final.hf.space/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: content }), // The new API doesn't need sessionId here
      });

      if (!response.ok || !response.body) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Update the 'text' of the last message (the bot's placeholder)
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunk };
            return [...prev.slice(0, -1), updatedLastMessage];
        });
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error('An unknown error occurred.');
      setError(err);
      // Update the placeholder with an error message
      setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          const updatedLastMessage = { ...lastMessage, text: 'Sorry, I encountered an error. Please try again.' };
          return [...prev.slice(0, -1), updatedLastMessage];
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]); // Dependency on isLoading to prevent concurrent requests


  const clearMessages = () => {
    setMessages([]);
    if (sessionId) {
      BotService.clearSessionMessages(sessionId);
    }
  };

  const clearSession = () => {
    if (sessionId) {
      BotService.clearSessionMessages(sessionId);
    }
    BotService.clearSessionId();
    const newSessionId = BotService.getSessionId();
    setSessionId(newSessionId);
    setMessages([]);
  };

  return {
    messages,
    isLoading, // Now sourced from our own useState
    error,     // Now sourced from our own useState
    sendMessage,
    clearMessages,
    clearSession,
  };
}