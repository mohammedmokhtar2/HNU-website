import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef<number>(Date.now());
  const renderStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const loadTime = Date.now() - startTime.current;
    const renderTime = Date.now() - renderStartTime.current;

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        loadTime: `${loadTime}ms`,
        renderTime: `${renderTime}ms`,
        memoryUsage: (performance as any).memory
          ? `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB`
          : 'N/A',
      });
    }

    // Track performance in production (you can send to analytics)
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics service
      // analytics.track('component_performance', { componentName, loadTime, renderTime });
    }
  }, [componentName]);

  const markRenderStart = () => {
    renderStartTime.current = Date.now();
  };

  return { markRenderStart };
}

// Hook for measuring API call performance
export function useApiPerformance() {
  const measureApiCall = async <T>(
    apiCall: () => Promise<T>,
    apiName: string
  ): Promise<T> => {
    const startTime = Date.now();

    try {
      const result = await apiCall();
      const duration = Date.now() - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Performance] ${apiName}: ${duration}ms`);
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Performance] ${apiName} (ERROR): ${duration}ms`);
      }

      throw error;
    }
  };

  return { measureApiCall };
}
