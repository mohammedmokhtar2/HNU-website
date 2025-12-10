'use client';

import { useEffect } from 'react';
import { trackVisitor, trackPageView } from '@/utils/visitorAnalytics';

export default function VisitorCounter() {
  useEffect(() => {
    // Track visitor when component mounts
    trackVisitor();

    // Track page view for existing sessions
    trackPageView();
  }, []);

  // This component doesn't render anything visible
  return null;
}
