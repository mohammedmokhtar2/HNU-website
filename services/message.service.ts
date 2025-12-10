import axios from 'axios';
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

export class MessageService {
  private static baseUrl = '/api/messages';

  // Get all messages with pagination and filtering
  static async getMessages(
    params: MessageQueryParams
  ): Promise<PaginatedMessageResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await axios.get(
      `${this.baseUrl}?${searchParams.toString()}`
    );
    return response.data;
  }

  // Get message by ID
  static async getMessageById(id: string): Promise<Message> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  // Create new message
  static async createMessage(data: CreateMessageInput): Promise<Message> {
    const response = await axios.post(this.baseUrl, data);
    return response.data.data;
  }

  // Update message
  static async updateMessage(
    id: string,
    data: UpdateMessageInput
  ): Promise<Message> {
    const response = await axios.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  // Delete message
  static async deleteMessage(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  // Get message statistics
  static async getMessageStats(): Promise<MessageStats> {
    const response = await axios.get(`${this.baseUrl}/stats`);
    return response.data.data;
  }

  // Get unread messages count
  static async getUnreadMessagesCount(): Promise<UnreadMessagesCount> {
    const response = await axios.get(`${this.baseUrl}/unread-count`);
    return response.data.data;
  }

  // Send message (process and send)
  static async sendMessage(
    id: string
  ): Promise<MessageServiceResponse<Message>> {
    try {
      const message = await this.getMessageById(id);

      // Update status to SENT
      const updatedMessage = await this.updateMessage(id, {
        messageConfig: {
          ...message.messageConfig,
          status: 'SENT' as any,
        },
      });

      return {
        success: true,
        data: updatedMessage,
        message: 'Message sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to send message',
      };
    }
  }

  // Mark message as read
  static async markAsRead(
    id: string
  ): Promise<MessageServiceResponse<Message>> {
    try {
      const message = await this.getMessageById(id);

      const updatedMessage = await this.updateMessage(id, {
        messageConfig: {
          ...message.messageConfig,
          status: 'READ' as any,
        },
      });

      return {
        success: true,
        data: updatedMessage,
        message: 'Message marked as read',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to mark message as read',
      };
    }
  }

  // Retry failed message
  static async retryMessage(
    id: string
  ): Promise<MessageServiceResponse<Message>> {
    try {
      const message = await this.getMessageById(id);

      if (!message.messageConfig) {
        throw new Error('Message config not found');
      }

      const retryCount = (message.messageConfig.retryCount || 0) + 1;
      const maxRetries = message.messageConfig.maxRetries || 3;

      if (retryCount > maxRetries) {
        throw new Error('Maximum retry attempts exceeded');
      }

      const updatedMessage = await this.updateMessage(id, {
        messageConfig: {
          ...message.messageConfig,
          retryCount,
          status: 'PENDING' as any,
        },
      });

      return {
        success: true,
        data: updatedMessage,
        message: 'Message retry initiated',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to retry message',
      };
    }
  }

  // Schedule message
  static async scheduleMessage(
    id: string,
    scheduledAt: string
  ): Promise<MessageServiceResponse<Message>> {
    try {
      const message = await this.getMessageById(id);

      const updatedMessage = await this.updateMessage(id, {
        messageConfig: {
          ...message.messageConfig,
          scheduledAt,
          status: 'SCHEDULED' as any,
        },
      });

      return {
        success: true,
        data: updatedMessage,
        message: 'Message scheduled successfully',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to schedule message',
      };
    }
  }

  // Cancel scheduled message
  static async cancelScheduledMessage(
    id: string
  ): Promise<MessageServiceResponse<Message>> {
    try {
      const message = await this.getMessageById(id);

      const updatedMessage = await this.updateMessage(id, {
        messageConfig: {
          ...message.messageConfig,
          scheduledAt: undefined,
          status: 'PENDING' as any,
        },
      });

      return {
        success: true,
        data: updatedMessage,
        message: 'Scheduled message cancelled',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to cancel scheduled message',
      };
    }
  }

  // Bulk operations
  static async bulkUpdateStatus(
    ids: string[],
    status: string
  ): Promise<MessageServiceResponse> {
    try {
      const promises = ids.map(id =>
        this.updateMessage(id, {
          messageConfig: { status: status as any },
        })
      );

      await Promise.all(promises);

      return {
        success: true,
        message: `Updated ${ids.length} messages successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to bulk update messages',
      };
    }
  }

  static async bulkDelete(ids: string[]): Promise<MessageServiceResponse> {
    try {
      const promises = ids.map(id => this.deleteMessage(id));
      await Promise.all(promises);

      return {
        success: true,
        message: `Deleted ${ids.length} messages successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to bulk delete messages',
      };
    }
  }

  // Send reply to contact form message
  static async sendReply(
    messageId: string,
    replyData: {
      subject: string;
      body: string;
      htmlBody?: string;
    }
  ): Promise<MessageServiceResponse<Message>> {
    try {
      const response = await axios.post('/api/messages/reply', {
        messageId,
        ...replyData,
      });

      return {
        success: true,
        data: response.data.data.replyMessageId,
        message: 'Reply sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to send reply',
      };
    }
  }

  // Get reply history for a message
  static async getReplyHistory(messageId: string): Promise<Message[]> {
    try {
      const response = await axios.get(
        `/api/messages/reply?messageId=${messageId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reply history:', error);
      return [];
    }
  }
}
