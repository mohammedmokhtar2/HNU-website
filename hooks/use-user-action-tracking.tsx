import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

/**
 * Client-side interceptor to add Clerk user ID to all requests
 */
export function useUserActionInterceptor() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    // Create session ID for guest users
    let sessionId = localStorage.getItem('session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('session-id', sessionId);
    }

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);

      // Add user ID if available
      if (user?.id) {
        headers.set('x-user-id', user.id);
        headers.set('x-clerk-id', user.id);
      }

      // Add session ID for guest tracking
      headers.set('x-session-id', sessionId);

      // Add timestamp for tracking
      headers.set('x-timestamp', new Date().toISOString());

      return originalFetch(input, {
        ...init,
        headers,
      });
    };

    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      async?: boolean,
      user?: string | null,
      password?: string | null
    ) {
      (this as any)._method = method;
      (this as any)._url = url;
      return originalXHROpen.call(
        this,
        method,
        url,
        async ?? true,
        user,
        password
      );
    };

    XMLHttpRequest.prototype.send = function (
      body?: Document | XMLHttpRequestBodyInit | null
    ) {
      // Add headers
      if (user?.id) {
        this.setRequestHeader('x-user-id', user.id);
        this.setRequestHeader('x-clerk-id', user.id);
      }
      this.setRequestHeader('x-session-id', sessionId);
      this.setRequestHeader('x-timestamp', new Date().toISOString());

      return originalXHRSend.call(this, body);
    };

    // Cleanup function
    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
    };
  }, [user, isLoaded]);
}

/**
 * Hook to track user actions on the client side
 */
export function useUserActionTracking() {
  const { user, isLoaded } = useUser();

  const trackAction = async (
    action: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!isLoaded) return;

    const sessionId = localStorage.getItem('session-id');

    try {
      await fetch('/api/user-actions/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.id && { 'x-user-id': user.id }),
          ...(user?.id && { 'x-clerk-id': user.id }),
          ...(sessionId && { 'x-session-id': sessionId }),
        },
        body: JSON.stringify({
          action,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId,
          },
        }),
      });
    } catch (error) {
      console.error('Failed to track user action:', error);
    }
  };

  const trackPageVisit = (pageTitle?: string) => {
    trackAction('PAGE_VISIT', {
      pageTitle: pageTitle || document.title,
      referer: document.referrer,
    });
  };

  const trackButtonClick = (buttonId: string, buttonText?: string) => {
    trackAction('BUTTON_CLICK', {
      elementId: buttonId,
      elementType: 'button',
      elementText: buttonText,
    });
  };

  const trackLinkClick = (linkUrl: string, linkText?: string) => {
    trackAction('LINK_CLICK', {
      elementType: 'link',
      elementText: linkText,
      targetUrl: linkUrl,
    });
  };

  const trackFormSubmit = (formId: string, formData?: any) => {
    trackAction('FORM_SUBMIT', {
      elementId: formId,
      elementType: 'form',
      formData,
    });
  };

  const trackSearch = (query: string, filters?: any) => {
    trackAction('SEARCH', {
      searchQuery: query,
      filterCriteria: filters,
    });
  };

  const trackFileUpload = (fileInfo: {
    fileName: string;
    fileSize: number;
    fileType: string;
  }) => {
    trackAction('FILE_UPLOAD', {
      fileInfo,
    });
  };

  const trackFileDownload = (fileInfo: {
    fileName: string;
    fileSize?: number;
    fileType?: string;
  }) => {
    trackAction('FILE_DOWNLOAD', {
      fileInfo,
    });
  };

  const trackCustomAction = (
    action: string,
    metadata: Record<string, any> = {}
  ) => {
    trackAction(action, metadata);
  };

  return {
    trackAction,
    trackPageVisit,
    trackButtonClick,
    trackLinkClick,
    trackFormSubmit,
    trackSearch,
    trackFileUpload,
    trackFileDownload,
    trackCustomAction,
    isLoaded,
    user,
  };
}

/**
 * Higher-order component to automatically track page visits
 */
export function withPageTracking<T extends object>(
  Component: React.ComponentType<T>,
  pageTitle?: string
) {
  return function TrackedComponent(props: T) {
    const { trackPageVisit } = useUserActionTracking();

    useEffect(() => {
      trackPageVisit(pageTitle);
    }, [trackPageVisit]);

    return <Component {...props} />;
  };
}

/**
 * Utility function to track clicks on specific elements
 * Note: This should be used within a React component that has access to useUserActionTracking
 */
export function createElementClickTracker() {
  return function trackElementClick(
    elementId: string,
    elementType: string = 'element',
    additionalMetadata: Record<string, any> = {}
  ) {
    // This should be called from within a component that uses useUserActionTracking
    console.warn(
      'trackElementClick should be used within a React component with useUserActionTracking hook'
    );
  };
}

/**
 * Utility function to track navigation events
 * Note: This should be used within a React component that has access to useUserActionTracking
 */
export function createNavigationTracker() {
  return function trackNavigation(
    fromUrl: string,
    toUrl: string,
    method: string = 'click'
  ) {
    // This should be called from within a component that uses useUserActionTracking
    console.warn(
      'trackNavigation should be used within a React component with useUserActionTracking hook'
    );
  };
}
