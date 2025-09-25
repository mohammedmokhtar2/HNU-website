'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function VisitorCountDisplay() {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const footerT = useTranslations('footer');

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/configs');
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.globalConfig?.counter || 0);
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorCount();
  }, []);

  if (loading) {
    return (
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center'>
        <div className='animate-pulse'>
          <div className='h-4 bg-white/20 rounded mb-2'></div>
          <div className='h-6 bg-white/30 rounded'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center shadow-lg'>
      <div className='text-white'>
        <div className='text-sm font-medium mb-1 opacity-90'>
          {footerT('Total_Visitors')}
        </div>
        <div className='text-2xl font-bold'>
          {visitorCount.toLocaleString()}
        </div>
        <div className='text-xs opacity-75 mt-1'>
          {footerT('Unique_Visitors')}
        </div>
      </div>
    </div>
  );
}
