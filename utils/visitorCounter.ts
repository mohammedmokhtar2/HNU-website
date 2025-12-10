import { Config } from '@/types/configa';

const VISITOR_SESSION_KEY = 'hnu_visitor_session';
const SESSION_DURATION = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

interface VisitorSession {
  timestamp: number;
  hasVisited: boolean;
}

/**
 * Checks if the current session is valid (within 5 days)
 */
function isSessionValid(session: VisitorSession): boolean {
  const now = Date.now();
  return now - session.timestamp < SESSION_DURATION;
}

/**
 * Gets the current visitor session from sessionStorage
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
 * Sets a visitor session in sessionStorage
 */
function setVisitorSession(): void {
  if (typeof window === 'undefined') return;

  try {
    const session: VisitorSession = {
      timestamp: Date.now(),
      hasVisited: true,
    };
    sessionStorage.setItem(VISITOR_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error setting visitor session:', error);
  }
}

/**
 * Increments the visitor counter in the database
 */
async function incrementVisitorCounter(): Promise<void> {
  try {
    const response = await fetch('/api/configs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'increment_visitor',
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to increment visitor counter: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Error incrementing visitor counter:', error);
  }
}

/**
 * Main utility function to handle visitor counting
 * Only increments counter if this is a new session (within 5 days)
 */
export async function handleVisitorCount(): Promise<void> {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') return;

  // Get current session
  const currentSession = getVisitorSession();

  // If no valid session exists, increment counter and create new session
  if (!currentSession) {
    await incrementVisitorCounter();
    setVisitorSession();
  }
}

/**
 * Utility to get visitor count from config
 */
export async function getVisitorCount(): Promise<number> {
  try {
    const response = await fetch('/api/configs');
    if (!response.ok) {
      throw new Error(`Failed to fetch visitor count: ${response.statusText}`);
    }

    const data = await response.json();
    return data.globalConfig?.counter || 0;
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    return 0;
  }
}
