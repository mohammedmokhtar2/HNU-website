'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface VisitorStats {
  counter: number;
  newVisitors: number;
  returningVisitors: number;
  lastVisit: string;
  dailyStats: {
    [date: string]: {
      visitors: number;
      pageViews: number;
      sessions: number;
      newVisitors: number;
      returningVisitors: number;
    };
  };
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  countryStats: {
    [country: string]: number;
  };
}

export default function VisitorCountDisplay() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const footerT = useTranslations('footer');

  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        const response = await fetch('/api/configs');
        if (response.ok) {
          const data = await response.json();

          // Ensure we have a proper structure
          const globalConfig = data.globalConfig || {};
          const safeStats = {
            counter: globalConfig.counter || 0,
            newVisitors: globalConfig.newVisitors || 0,
            returningVisitors: globalConfig.returningVisitors || 0,
            lastVisit: globalConfig.lastVisit || new Date().toISOString(),
            dailyStats: globalConfig.dailyStats || {},
            deviceStats: globalConfig.deviceStats || {
              desktop: 0,
              mobile: 0,
              tablet: 0,
            },
            countryStats: globalConfig.countryStats || {},
          };

          setStats(safeStats);
        }
      } catch (error) {
        console.error('Error fetching visitor stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorStats();
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

  if (!stats) {
    return (
      <div className='bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-center shadow-lg'>
        <div className='text-white'>
          <div className='text-sm font-medium'>Error loading stats</div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayStats = stats.dailyStats?.[today];
  const topCountry = stats.countryStats
    ? Object.entries(stats.countryStats).sort(([, a], [, b]) => b - a)[0]
    : null;

  return (
    <div className='space-y-3'>
      {/* Main Counter */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center shadow-lg'>
        <div className='text-white'>
          <div className='text-sm font-medium mb-1 opacity-90'>
            {footerT('Total_Visitors')}
          </div>
          <div className='text-2xl font-bold'>
            {(stats.counter || 0).toLocaleString()}
          </div>
          <div className='text-xs opacity-75 mt-1'>
            {footerT('Unique_Visitors')}
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      {todayStats && (
        <div className='bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-3 text-center shadow-lg'>
          <div className='text-white'>
            <div className='text-xs font-medium mb-1 opacity-90'>Today</div>
            <div className='text-lg font-bold'>{todayStats.visitors}</div>
            <div className='text-xs opacity-75'>visitors</div>
          </div>
        </div>
      )}

      {/* Device Stats */}
      <div className='bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-3 text-center shadow-lg'>
        <div className='text-white'>
          <div className='text-xs font-medium mb-1 opacity-90'>Devices</div>
          <div className='flex justify-center space-x-2 text-xs'>
            <span>📱 {stats.deviceStats?.mobile || 0}</span>
            <span>💻 {stats.deviceStats?.desktop || 0}</span>
            <span>📱 {stats.deviceStats?.tablet || 0}</span>
          </div>
        </div>
      </div>

      {/* Top Country */}
      {topCountry && (
        <div className='bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-3 text-center shadow-lg'>
          <div className='text-white'>
            <div className='text-xs font-medium mb-1 opacity-90'>
              Top Country
            </div>
            <div className='text-sm font-bold'>{topCountry[0]}</div>
            <div className='text-xs opacity-75'>{topCountry[1]} visitors</div>
          </div>
        </div>
      )}
    </div>
  );
}
