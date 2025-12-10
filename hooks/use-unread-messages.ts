import { useQuery } from '@tanstack/react-query';
import { MessageService } from '@/services/message.service';
import { UnreadMessagesCount } from '@/types/message';

export function useUnreadMessages() {
  return useQuery({
    queryKey: ['unread-messages-count'],
    queryFn: () => MessageService.getUnreadMessagesCount(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
