import { VisitorData } from '@/types/configa';
import {
  getVisitorCountry,
  getBrowserInfo,
  getDeviceType,
  generateSessionId,
} from './geolocation';

const VISITOR_SESSION_KEY = 'hnu_visitor_session';
const VISITOR_STORAGE_KEY = 'hnu_visitor_data';
const SESSION_DURATION = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

interface VisitorSession {
  timestamp: number;
  hasVisited: boolean;
  sessionId: string;
}

interface StoredVisitorData {
  firstVisit: number;
  lastVisit: number;
  visitCount: number;
  sessionId: string;
}

/**
 * Check if current session is valid (within 5 days)
 */
function isSessionValid(session: VisitorSession): boolean {
  const now = Date.now();
  return now - session.timestamp < SESSION_DURATION;
}

/**
 * Get visitor session from sessionStorage
 */
function getVisitorSession(): VisitorSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = sessionStorage.getItem(VISITOR_SESSION_KEY);
    if (!sessionData) return null;

    const session: VisitorSession = JSON.parse(sessionData);
    return isSessionValid(session) ? session : null;
  } catch (error) {
    console.error('Error reading visitor session:', error);
    return null;
  }
}

/**
 * Set visitor session in sessionStorage
 */
function setVisitorSession(sessionId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const session: VisitorSession = {
      timestamp: Date.now(),
      hasVisited: true,
      sessionId,
    };
    sessionStorage.setItem(VISITOR_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error setting visitor session:', error);
  }
}

/**
 * Get stored visitor data from localStorage
 */
function getStoredVisitorData(): StoredVisitorData | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading stored visitor data:', error);
    return null;
  }
}

/**
 * Update stored visitor data in localStorage
 */
function updateStoredVisitorData(sessionId: string): StoredVisitorData {
  if (typeof window === 'undefined') {
    return {
      firstVisit: Date.now(),
      lastVisit: Date.now(),
      visitCount: 1,
      sessionId,
    };
  }

  try {
    const existingData = getStoredVisitorData();
    const now = Date.now();

    const newData: StoredVisitorData = {
      firstVisit: existingData?.firstVisit || now,
      lastVisit: now,
      visitCount: (existingData?.visitCount || 0) + 1,
      sessionId,
    };

    localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(newData));
    return newData;
  } catch (error) {
    console.error('Error updating stored visitor data:', error);
    return {
      firstVisit: Date.now(),
      lastVisit: Date.now(),
      visitCount: 1,
      sessionId,
    };
  }
}

/**
 * Collect comprehensive visitor data
 */
async function collectVisitorData(): Promise<VisitorData> {
  const sessionId = generateSessionId();
  const timestamp = new Date().toISOString();

  // Check if this is a new visitor
  const storedData = getStoredVisitorData();
  const isNewVisitor = !storedData;

  // Update stored data
  const updatedStoredData = updateStoredVisitorData(sessionId);

  // Collect all analytics data
  const [country, browser, device] = await Promise.all([
    getVisitorCountry(),
    Promise.resolve(getBrowserInfo()),
    Promise.resolve(getDeviceType()),
  ]);

  return {
    timestamp,
    isNewVisitor,
    device,
    browser,
    country,
    pageViews: 1, // Will be updated by page view tracking
    sessionId,
  };
}

/**
 * Send visitor data to API
 */
async function sendVisitorData(visitorData: VisitorData): Promise<void> {
  try {
    const response = await fetch('/api/configs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'track_visitor',
        data: visitorData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to track visitor: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}

/**
 * Main function to handle comprehensive visitor tracking
 */
export async function trackVisitor(): Promise<void> {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return;

  // Get current session
  const currentSession = getVisitorSession();

  // If no valid session exists, track visitor and create new session
  if (!currentSession) {
    const visitorData = await collectVisitorData();
    await sendVisitorData(visitorData);
    setVisitorSession(visitorData.sessionId);
  }
}

/**
 * Track page view (for existing sessions)
 */
export async function trackPageView(): Promise<void> {
  if (typeof window === 'undefined') return;

  const currentSession = getVisitorSession();
  if (currentSession) {
    try {
      await fetch('/api/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'track_page_view',
          sessionId: currentSession.sessionId,
        }),
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }
}

/**
 * Get visitor statistics from API
 */
export async function getVisitorStats(): Promise<any> {
  try {
    const response = await fetch('/api/configs');
    if (!response.ok) {
      throw new Error(`Failed to fetch visitor stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return null;
  }
}
