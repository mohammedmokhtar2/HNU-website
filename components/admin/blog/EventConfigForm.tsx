'use client';

import React from 'react';
import { EventConfig, EventType, EventStatus } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { useEventConfig } from '@/contexts/EventConfigContext';

interface EventConfigFormProps {
  eventConfig: EventConfig | null;
  onChange: (eventConfig: EventConfig | null) => void;
  disabled?: boolean;
}

export function EventConfigForm({
  eventConfig,
  onChange,
  disabled = false,
}: EventConfigFormProps) {
  const { EVENT_TYPES, EVENT_STATUSES } = useEventConfig();
  const handleEventDateChange = (value: string) => {
    const eventDate = value ? new Date(value) : null;
    onChange({
      ...eventConfig,
      eventDate,
    } as EventConfig);
  };

  const handleEventEndDateChange = (value: string) => {
    const eventEndDate = value ? new Date(value) : null;
    onChange({
      ...eventConfig,
      eventEndDate,
    } as EventConfig);
  };

  const handleLocationChange = (value: string) => {
    onChange({
      ...eventConfig,
      location: value || null,
    } as EventConfig);
  };

  const handleEventTypeChange = (value: EventType) => {
    onChange({
      ...eventConfig,
      eventType: value,
    } as EventConfig);
  };

  const handleStatusChange = (value: EventStatus) => {
    onChange({
      ...eventConfig,
      status: value,
    } as EventConfig);
  };

  const formatDateTimeForInput = (date: Date | string | null): string => {
    if (!date) return '';

    // Convert to Date object if it's a string
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return '';

    return new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5' />
          Event Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='eventDate'>Event Date *</Label>
            <Input
              id='eventDate'
              type='datetime-local'
              value={formatDateTimeForInput(eventConfig?.eventDate || null)}
              onChange={e => handleEventDateChange(e.target.value)}
              disabled={disabled}
              required
            />
          </div>

          <div>
            <Label htmlFor='eventEndDate'>Event End Date</Label>
            <Input
              id='eventEndDate'
              type='datetime-local'
              value={formatDateTimeForInput(eventConfig?.eventEndDate || null)}
              onChange={e => handleEventEndDateChange(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <div>
          <Label htmlFor='location' className='flex items-center gap-2'>
            <MapPin className='h-4 w-4' />
            Location *
          </Label>
          <Input
            id='location'
            value={eventConfig?.location || ''}
            onChange={e => handleLocationChange(e.target.value)}
            placeholder='Enter event location'
            disabled={disabled}
            required
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='eventType' className='flex items-center gap-2'>
              <Tag className='h-4 w-4' />
              Event Type *
            </Label>
            <Select
              value={eventConfig?.eventType || ''}
              onValueChange={handleEventTypeChange}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select event type' />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='status'>Event Status *</Label>
            <Select
              value={eventConfig?.status || ''}
              onValueChange={handleStatusChange}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                {EVENT_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component to display event configuration
interface EventConfigDisplayProps {
  eventConfig: EventConfig | null;
  className?: string;
}

export function EventConfigDisplay({
  eventConfig,
  className = '',
}: EventConfigDisplayProps) {
  const {
    formatEventDate,
    formatEventDuration,
    getEventStatusColor,
    getEventTypeDisplay,
  } = useEventConfig();

  if (!eventConfig) {
    return (
      <div className={`text-muted-foreground ${className}`}>
        No event configuration
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className='flex items-center gap-2'>
        <Calendar className='h-4 w-4 text-muted-foreground' />
        <span className='font-medium'>Event Date:</span>
        <span>{formatEventDate(eventConfig.eventDate)}</span>
      </div>

      {eventConfig.eventEndDate && (
        <div className='flex items-center gap-2'>
          <Calendar className='h-4 w-4 text-muted-foreground' />
          <span className='font-medium'>End Date:</span>
          <span>{formatEventDate(eventConfig.eventEndDate)}</span>
        </div>
      )}

      <div className='flex items-center gap-2'>
        <MapPin className='h-4 w-4 text-muted-foreground' />
        <span className='font-medium'>Location:</span>
        <span>{eventConfig.location || 'Not specified'}</span>
      </div>

      <div className='flex items-center gap-2'>
        <Tag className='h-4 w-4 text-muted-foreground' />
        <span className='font-medium'>Type:</span>
        <span className='capitalize'>
          {getEventTypeDisplay(eventConfig.eventType)}
        </span>
      </div>

      <div className='flex items-center gap-2'>
        <span className='font-medium'>Status:</span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(eventConfig.status)}`}
        >
          {eventConfig.status.charAt(0).toUpperCase() +
            eventConfig.status.slice(1)}
        </span>
      </div>

      {eventConfig.eventDate && eventConfig.eventEndDate && (
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Duration:</span>
          <span>
            {formatEventDuration(
              eventConfig.eventDate,
              eventConfig.eventEndDate
            )}
          </span>
        </div>
      )}
    </div>
  );
}
