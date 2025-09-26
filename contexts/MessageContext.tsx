'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageService } from '@/services/message.service';
import { useSocket } from '@/hooks/use-socket';
import {
  Message,
  CreateMessageInput,
  UpdateMessageInput,
  MessageQueryParams,
  PaginatedMessageResponse,
  MessageStats,
  UnreadMessagesCount,
  MessageServiceResponse,
} from '@/types/message';

interface MessageContextType {
  // Data
  messages: Message[];
  paginatedMessages: PaginatedMessageResponse | null;
  currentMessage: Message | null;
  stats: MessageStats | null;
  unreadCount: UnreadMessagesCount | null;

  // Loading states
  loading: boolean;
  loadingStats: boolean;
  loadingUnreadCount: boolean;
  isInitialLoad: boolean;

  // Error states
  error: string | null;

  // Socket states
  isSocketConnected: boolean;
  newMessageNotification: any;
  newContactMessageNotification: any;

  // Query parameters
  queryParams: MessageQueryParams;
  setQueryParams: (params: Partial<MessageQueryParams>) => void;

  // Actions
  refetch: () => Promise<any>;
  refetchStats: () => Promise<any>;
  refetchUnreadCount: () => Promise<any>;
  getMessageById: (id: string) => Promise<Message | null>;
  createMessage: (data: CreateMessageInput) => Promise<Message>;
  updateMessage: (id: string, data: UpdateMessageInput) => Promise<Message>;
  deleteMessage: (id: string) => Promise<void>;
  sendMessage: (id: string) => Promise<MessageServiceResponse<Message>>;
  markAsRead: (id: string) => Promise<MessageServiceResponse<Message>>;
  retryMessage: (id: string) => Promise<MessageServiceResponse<Message>>;
  scheduleMessage: (
    id: string,
    scheduledAt: string
  ) => Promise<MessageServiceResponse<Message>>;
  cancelScheduledMessage: (
    id: string
  ) => Promise<MessageServiceResponse<Message>>;
  bulkUpdateStatus: (
    ids: string[],
    status: string
  ) => Promise<MessageServiceResponse>;
  bulkDelete: (ids: string[]) => Promise<MessageServiceResponse>;
  sendReply: (
    messageId: string,
    replyData: {
      subject: string;
      body: string;
      htmlBody?: string;
    }
  ) => Promise<MessageServiceResponse<Message>>;
  getReplyHistory: (messageId: string) => Promise<Message[]>;

  // Search and filtering
  searchMessages: (query: string) => Promise<void>;
  filterByStatus: (status: string) => Promise<void>;
  filterByType: (type: string) => Promise<void>;
  filterByPriority: (priority: string) => Promise<void>;
  filterByDateRange: (dateFrom: string, dateTo: string) => Promise<void>;

  // Clear functions
  clearCurrentMessage: () => void;
  clearError: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
  children: ReactNode;
  initialParams?: Partial<MessageQueryParams>;
}

// Query keys
const MESSAGES_QUERY_KEY = 'messages';
const MESSAGE_STATS_QUERY_KEY = 'message-stats';
const UNREAD_COUNT_QUERY_KEY = 'unread-count';

export function MessageProvider({
  children,
  initialParams = {},
}: MessageProviderProps) {
  const queryClient = useQueryClient();
  const { isConnected, newMessage, newContactMessage } = useSocket();

  // State
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [queryParams, setQueryParamsState] = useState<MessageQueryParams>({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    orderDirection: 'desc',
    ...initialParams,
  });
  const [error, setError] = useState<string | null>(null);

  // Set query parameters
  const setQueryParams = useCallback((params: Partial<MessageQueryParams>) => {
    setQueryParamsState(prev => ({ ...prev, ...params }));
  }, []);

  // Handle socket events
  useEffect(() => {
    if (newMessage) {
      // Invalidate and refetch messages when a new message arrives
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MESSAGE_STATS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    }
  }, [newMessage, queryClient]);

  useEffect(() => {
    if (newContactMessage) {
      // Invalidate and refetch messages when a new contact message arrives
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MESSAGE_STATS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    }
  }, [newContactMessage, queryClient]);

  // Main messages query
  const {
    data: paginatedMessages,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [MESSAGES_QUERY_KEY, queryParams],
    queryFn: () => MessageService.getMessages(queryParams),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Message stats query
  const {
    data: stats,
    isLoading: loadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: [MESSAGE_STATS_QUERY_KEY],
    queryFn: () => MessageService.getMessageStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Unread count query
  const {
    data: unreadCount,
    isLoading: loadingUnreadCount,
    refetch: refetchUnreadCount,
  } = useQuery({
    queryKey: [UNREAD_COUNT_QUERY_KEY],
    queryFn: () => MessageService.getUnreadMessagesCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  // Extract messages from paginated response and convert dates
  const messages = useMemo(() => {
    if (!paginatedMessages?.data) return [];
    return paginatedMessages.data.map(msg => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
      updatedAt: new Date(msg.updatedAt),
    }));
  }, [paginatedMessages]);

  // Check if this is initial load
  const isInitialLoad = loading && !paginatedMessages;

  // Set error from query
  useEffect(() => {
    if (queryError) {
      setError(
        queryError instanceof Error ? queryError.message : 'An error occurred'
      );
    }
  }, [queryError]);

  // Get message by ID
  const getMessageById = useCallback(
    async (id: string): Promise<Message | null> => {
      try {
        const message = await MessageService.getMessageById(id);
        setCurrentMessage(message);
        return message;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to fetch message'
        );
        return null;
      }
    },
    []
  );

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: (data: CreateMessageInput) =>
      MessageService.createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MESSAGE_STATS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
    onError: error => {
      setError(
        error instanceof Error ? error.message : 'Failed to create message'
      );
    },
  });

  const createMessage = useCallback(
    async (data: CreateMessageInput): Promise<Message> => {
      return createMessageMutation.mutateAsync(data);
    },
    [createMessageMutation]
  );

  // Update message mutation
  const updateMessageMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMessageInput }) =>
      MessageService.updateMessage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MESSAGE_STATS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
    onError: error => {
      setError(
        error instanceof Error ? error.message : 'Failed to update message'
      );
    },
  });

  const updateMessage = useCallback(
    async (id: string, data: UpdateMessageInput): Promise<Message> => {
      return updateMessageMutation.mutateAsync({ id, data });
    },
    [updateMessageMutation]
  );

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => MessageService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MESSAGE_STATS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
    onError: error => {
      setError(
        error instanceof Error ? error.message : 'Failed to delete message'
      );
    },
  });

  const deleteMessage = useCallback(
    async (id: string): Promise<void> => {
      await deleteMessageMutation.mutateAsync(id);
    },
    [deleteMessageMutation]
  );

  // Send message
  const sendMessage = useCallback(
    async (id: string): Promise<MessageServiceResponse<Message>> => {
      try {
        const result = await MessageService.sendMessage(id);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
          queryClient.invalidateQueries({
            queryKey: [MESSAGE_STATS_QUERY_KEY],
          });
          queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to send message',
        };
      }
    },
    [queryClient]
  );

  // Mark as read
  const markAsRead = useCallback(
    async (id: string): Promise<MessageServiceResponse<Message>> => {
      try {
        const result = await MessageService.markAsRead(id);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
          queryClient.invalidateQueries({
            queryKey: [MESSAGE_STATS_QUERY_KEY],
          });
          queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to mark message as read',
        };
      }
    },
    [queryClient]
  );

  // Retry message
  const retryMessage = useCallback(
    async (id: string): Promise<MessageServiceResponse<Message>> => {
      try {
        const result = await MessageService.retryMessage(id);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
          queryClient.invalidateQueries({
            queryKey: [MESSAGE_STATS_QUERY_KEY],
          });
          queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to retry message',
        };
      }
    },
    [queryClient]
  );

  // Schedule message
  const scheduleMessage = useCallback(
    async (
      id: string,
      scheduledAt: string
    ): Promise<MessageServiceResponse<Message>> => {
      try {
        const result = await MessageService.scheduleMessage(id, scheduledAt);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
          queryClient.invalidateQueries({
            queryKey: [MESSAGE_STATS_QUERY_KEY],
          });
          queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to schedule message',
        };
      }
    },
    [queryClient]
  );

  // Cancel scheduled message
  const cancelScheduledMessage = useCallback(
    async (id: string): Promise<MessageServiceResponse<Message>> => {
      try {
        const result = await MessageService.cancelScheduledMessage(id);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
          queryClient.invalidateQueries({
            queryKey: [MESSAGE_STATS_QUERY_KEY],
          });
          queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to cancel scheduled message',
        };
      }
    },
    [queryClient]
  );

  // Bulk update status
  const bulkUpdateStatus = useCallback(
    async (ids: string[], status: string): Promise<MessageServiceResponse> => {
      try {
        const result = await MessageService.bulkUpdateStatus(ids, status);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
          queryClient.invalidateQueries({
            queryKey: [MESSAGE_STATS_QUERY_KEY],
          });
          queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to bulk update messages',
        };
      }
    },
    [queryClient]
  );

  // Bulk delete
  const bulkDelete = useCallback(
    async (ids: string[]): Promise<MessageServiceResponse> => {
      try {
        const result = await MessageService.bulkDelete(ids);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
          queryClient.invalidateQueries({
            queryKey: [MESSAGE_STATS_QUERY_KEY],
          });
          queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to bulk delete messages',
        };
      }
    },
    [queryClient]
  );

  // Send reply
  const sendReply = useCallback(
    async (
      messageId: string,
      replyData: {
        subject: string;
        body: string;
        htmlBody?: string;
      }
    ): Promise<MessageServiceResponse<Message>> => {
      try {
        const result = await MessageService.sendReply(messageId, replyData);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
          queryClient.invalidateQueries({
            queryKey: [MESSAGE_STATS_QUERY_KEY],
          });
          queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to send reply',
        };
      }
    },
    [queryClient]
  );

  // Get reply history
  const getReplyHistory = useCallback(
    async (messageId: string): Promise<Message[]> => {
      try {
        return await MessageService.getReplyHistory(messageId);
      } catch (error) {
        console.error('Error fetching reply history:', error);
        return [];
      }
    },
    []
  );

  // Search and filtering functions
  const searchMessages = useCallback(
    async (query: string): Promise<void> => {
      setQueryParams({ search: query, page: 1 });
    },
    [setQueryParams]
  );

  const filterByStatus = useCallback(
    async (status: string): Promise<void> => {
      setQueryParams({ status: status as any, page: 1 });
    },
    [setQueryParams]
  );

  const filterByType = useCallback(
    async (type: string): Promise<void> => {
      setQueryParams({ type: type as any, page: 1 });
    },
    [setQueryParams]
  );

  const filterByPriority = useCallback(
    async (priority: string): Promise<void> => {
      setQueryParams({ priority: priority as any, page: 1 });
    },
    [setQueryParams]
  );

  const filterByDateRange = useCallback(
    async (dateFrom: string, dateTo: string): Promise<void> => {
      setQueryParams({ dateFrom, dateTo, page: 1 });
    },
    [setQueryParams]
  );

  // Clear functions
  const clearCurrentMessage = useCallback(() => {
    setCurrentMessage(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: MessageContextType = useMemo(
    () => ({
      // Data
      messages,
      paginatedMessages: paginatedMessages || null,
      currentMessage,
      stats: stats || null,
      unreadCount: unreadCount || null,

      // Loading states
      loading,
      loadingStats,
      loadingUnreadCount,
      isInitialLoad,

      // Error states
      error,

      // Socket states
      isSocketConnected: isConnected,
      newMessageNotification: newMessage,
      newContactMessageNotification: newContactMessage,

      // Query parameters
      queryParams,
      setQueryParams,

      // Actions
      refetch,
      refetchStats,
      refetchUnreadCount,
      getMessageById,
      createMessage,
      updateMessage,
      deleteMessage,
      sendMessage,
      markAsRead,
      retryMessage,
      scheduleMessage,
      cancelScheduledMessage,
      bulkUpdateStatus,
      bulkDelete,
      sendReply,
      getReplyHistory,

      // Search and filtering
      searchMessages,
      filterByStatus,
      filterByType,
      filterByPriority,
      filterByDateRange,

      // Clear functions
      clearCurrentMessage,
      clearError,
    }),
    [
      messages,
      paginatedMessages,
      currentMessage,
      stats,
      unreadCount,
      loading,
      loadingStats,
      loadingUnreadCount,
      isInitialLoad,
      error,
      isConnected,
      newMessage,
      newContactMessage,
      queryParams,
      setQueryParams,
      refetch,
      refetchStats,
      refetchUnreadCount,
      getMessageById,
      createMessage,
      updateMessage,
      deleteMessage,
      sendMessage,
      markAsRead,
      retryMessage,
      scheduleMessage,
      cancelScheduledMessage,
      bulkUpdateStatus,
      bulkDelete,
      sendReply,
      getReplyHistory,
      searchMessages,
      filterByStatus,
      filterByType,
      filterByPriority,
      filterByDateRange,
      clearCurrentMessage,
      clearError,
    ]
  );

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}
