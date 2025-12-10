'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
  EventConfig,
  EventType,
  EventStatus,
  EVENT_TYPES,
  EVENT_STATUSES,
} from '@/types/event';

interface EventConfigContextType {
  // Event configuration utilities
  createEventConfig: (data: Partial<EventConfig>) => EventConfig;
  validateEventConfig: (config: EventConfig) => {
    isValid: boolean;
    errors: string[];
  };
  formatEventDate: (date: Date | null) => string;
  formatEventDuration: (startDate: Date | null, endDate: Date | null) => string;
  getEventStatusColor: (status: EventStatus) => string;
  getEventTypeDisplay: (type: EventType) => string;

  // Constants
  EVENT_TYPES: EventType[];
  EVENT_STATUSES: EventStatus[];
}

const EventConfigContext = createContext<EventConfigContextType | undefined>(
  undefined
);

interface EventConfigProviderProps {
  children: ReactNode;
}

export function EventConfigProvider({ children }: EventConfigProviderProps) {
  const createEventConfig = (data: Partial<EventConfig>): EventConfig => {
    return {
      eventDate: data.eventDate || null,
      eventEndDate: data.eventEndDate || null,
      location: data.location || null,
      eventType: data.eventType || EventType.OTHER,
      status: data.status || EventStatus.DRAFT,
      metadata: data.metadata || {},
    };
  };

  const validateEventConfig = (
    config: EventConfig
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!config.eventDate) {
      errors.push('Event date is required');
    }

    if (!config.location || config.location.trim().length < 2) {
      errors.push('Location must be at least 2 characters long');
    }

    if (!config.eventType) {
      errors.push('Event type is required');
    }

    if (!config.status) {
      errors.push('Event status is required');
    }

    // Validate date logic
    if (config.eventDate && config.eventEndDate) {
      const startDate = new Date(config.eventDate);
      const endDate = new Date(config.eventEndDate);

      if (endDate <= startDate) {
        errors.push('End date must be after start date');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const formatEventDate = (date: Date | null): string => {
    if (!date) return 'Not specified';

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatEventDuration = (
    startDate: Date | null,
    endDate: Date | null
  ): string => {
    if (!startDate) return 'Not specified';
    if (!endDate) return 'No end date';

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const getEventStatusColor = (status: EventStatus): string => {
    switch (status) {
      case EventStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case EventStatus.ONGOING:
        return 'bg-green-100 text-green-800';
      case EventStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case EventStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case EventStatus.POSTPONED:
        return 'bg-yellow-100 text-yellow-800';
      case EventStatus.DRAFT:
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeDisplay = (type: EventType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const value: EventConfigContextType = {
    createEventConfig,
    validateEventConfig,
    formatEventDate,
    formatEventDuration,
    getEventStatusColor,
    getEventTypeDisplay,
    EVENT_TYPES,
    EVENT_STATUSES,
  };

  return (
    <EventConfigContext.Provider value={value}>
      {children}
    </EventConfigContext.Provider>
  );
}

export function useEventConfig() {
  const context = useContext(EventConfigContext);
  if (context === undefined) {
    throw new Error(
      'useEventConfig must be used within an EventConfigProvider'
    );
  }
  return context;
}

// Convenience hooks
export const useEventConfigUtils = () => {
  const {
    createEventConfig,
    validateEventConfig,
    formatEventDate,
    formatEventDuration,
  } = useEventConfig();
  return {
    createEventConfig,
    validateEventConfig,
    formatEventDate,
    formatEventDuration,
  };
};

export const useEventDisplay = () => {
  const {
    getEventStatusColor,
    getEventTypeDisplay,
    formatEventDate,
    formatEventDuration,
  } = useEventConfig();
  return {
    getEventStatusColor,
    getEventTypeDisplay,
    formatEventDate,
    formatEventDuration,
  };
};
