import { useState, useCallback, useRef, useEffect } from 'react';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  isInitialLoad: boolean;
  retryCount: number;
}

export interface LoadingStateActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  retry: () => void;
  reset: () => void;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

export function useLoadingState(
  initialLoading = true
): LoadingState & LoadingStateActions {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(initialLoading);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setLoading = useCallback(
    (loading: boolean) => {
      setIsLoading(loading);
      if (!loading && isInitialLoad) {
        setIsInitialLoad(false);
      }
    },
    [isInitialLoad]
  );

  const setErrorState = useCallback((error: string | null) => {
    setError(error);
    if (error) {
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      setErrorState('Maximum retry attempts reached');
      return;
    }

    setRetryCount(prev => prev + 1);
    setErrorState(null);
    setIsLoading(true);

    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Add delay before retry
    retryTimeoutRef.current = setTimeout(() => {
      // This will be handled by the component using this hook
    }, RETRY_DELAY);
  }, [retryCount, setErrorState]);

  const reset = useCallback(() => {
    setIsLoading(initialLoading);
    setErrorState(null);
    setIsInitialLoad(initialLoading);
    setRetryCount(0);

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, [initialLoading, setErrorState]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    error,
    isInitialLoad,
    retryCount,
    setLoading,
    setError: setErrorState,
    retry,
    reset,
  };
}

// Hook for managing multiple loading states
export function useMultipleLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<
    Record<string, LoadingState>
  >({});

  const setLoadingState = useCallback(
    (key: string, state: Partial<LoadingState>) => {
      setLoadingStates(prev => ({
        ...prev,
        [key]: { ...prev[key], ...state },
      }));
    },
    []
  );

  const getLoadingState = useCallback(
    (key: string): LoadingState => {
      return (
        loadingStates[key] || {
          isLoading: false,
          error: null,
          isInitialLoad: false,
          retryCount: 0,
        }
      );
    },
    [loadingStates]
  );

  const isAnyLoading = Object.values(loadingStates).some(
    state => state.isLoading
  );
  const hasAnyError = Object.values(loadingStates).some(state => state.error);

  return {
    loadingStates,
    setLoadingState,
    getLoadingState,
    isAnyLoading,
    hasAnyError,
  };
}
