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

          const globalConfig = data.globalConfig || {};
          const safeStats: VisitorStats = {
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
      <div className='p-4 text-center'>
        <div className='animate-pulse'>
          <div className='h-4 bg-white/20 rounded mb-2'></div>
          <div className='h-6 bg-white/30 rounded'></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className='p-4 text-center'>
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
    <div className='flex justify-center w-full'>
      {/* Main Counter */}
      <div className='p-4 min-h-[150px] flex flex-col items-center rounded-lg w-full max-w-sm'>
        <div className='flex w-full items-center text-white px-2 gap-4'>
          {/* الكلام على اليمين */}
          <div className='text-sm font-medium opacity-90 text-right flex-shrink-0'>
            {footerT('Total_Visitors')}
          </div>

          {/* الرقم في النص */}
          <div className='text-2xl font-bold flex-grow text-center'>
            {(stats.counter || 0).toLocaleString()}
          </div>

          {/* التوضيح على الشمال */}
          <div className='text-xs opacity-75 text-left flex-shrink-0'>
            {footerT('Unique_Visitors')}
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      {/* {todayStats && (
        <div className='p-4 min-h-[150px] flex items-center'>
          <div className='flex w-full justify-between items-center text-white px-4'>
            <div className='text-sm font-medium opacity-90 text-right'>
              {footerT('Today')}
            </div>

            <div className='text-2xl font-bold'>{todayStats.visitors}</div>

            <div className='text-xs opacity-75 text-left'>
              {footerT('visitors')}
            </div>
          </div>
        </div>
      )} */}
      {/* Device Stats */}
      {/* <div className='p-4 min-h-[150px] flex flex-col justify-center'>
        <div className='text-white'>
          <div className='text-sm font-medium mb-1 opacity-90'>
            {footerT('Devices')}
          </div>
          <div className='flex justify-center gap-3 text-xs mt-1'>
            <span>💻 {stats.deviceStats?.desktop || 0}</span>
            <span>📱 {stats.deviceStats?.mobile || 0}</span>
            <span>📱 {stats.deviceStats?.tablet || 0}</span>
          </div>
        </div>
      </div> */}

      {/* Top Country */}
      {/* {topCountry && (
        <div className='p-4 min-h-[150px] flex flex-col justify-center'>
          <div className='text-white'>
            <div className='text-sm font-medium mb-1 opacity-90'>
              {footerT('Top_Country')}
            </div>
            <div className='text-lg font-bold'>{topCountry[0]}</div>
            <div className='text-xs opacity-75'>
              {topCountry[1]} {footerT('visitors')}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
