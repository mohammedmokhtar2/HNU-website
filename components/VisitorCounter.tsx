'use client';

import { useEffect } from 'react';
import { handleVisitorCount } from '@/utils/visitorCounter';

export default function VisitorCounter() {
    useEffect(() => {
        // Handle visitor count when component mounts
        handleVisitorCount();
    }, []);

    // This component doesn't render anything visible
    return null;
}
