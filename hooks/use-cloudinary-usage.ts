import { useState, useEffect, useCallback } from 'react';

export interface CloudinaryUsage {
  credits: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  storage: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  transformations: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  bandwidth: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  requests: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
}

export interface UseCloudinaryUsageReturn {
  usage: CloudinaryUsage | null;
  isLoading: boolean;
  error: string | null;
  refreshUsage: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useCloudinaryUsage(): UseCloudinaryUsageReturn {
  const [usage, setUsage] = useState<CloudinaryUsage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchUsage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/files/usage');
      const data = await response.json();

      if (data.success && data.data) {
        setUsage(data.data);
        setLastUpdated(new Date());
      } else {
        setError(data.error || 'Failed to fetch usage data');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch usage data'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    usage,
    isLoading,
    error,
    refreshUsage: fetchUsage,
    lastUpdated,
  };
}

// Helper function to format bytes
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to format numbers with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Helper function to get usage status color
export function getUsageStatusColor(percentage: number): string {
  if (percentage >= 90) return 'text-red-600';
  if (percentage >= 75) return 'text-yellow-600';
  return 'text-green-600';
}

// Helper function to get usage status
export function getUsageStatus(percentage: number): string {
  if (percentage >= 90) return 'Critical';
  if (percentage >= 75) return 'Warning';
  return 'Good';
}
