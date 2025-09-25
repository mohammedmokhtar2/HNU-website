/**
 * Get visitor's country using IP geolocation
 * Uses a free IP geolocation service
 */
export async function getVisitorCountry(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation data');
    }

    const data = await response.json();
    return data.country_name || 'Unknown';
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return 'Unknown';
  }
}

/**
 * Get visitor's browser information
 */
export function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'Unknown';

  const userAgent = window.navigator.userAgent;

  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';

  return 'Other';
}

/**
 * Detect visitor's device type
 */
export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';

  const userAgent = window.navigator.userAgent;
  const screenWidth = window.screen.width;

  // Check for tablet
  if (
    userAgent.includes('iPad') ||
    (userAgent.includes('Android') && !userAgent.includes('Mobile')) ||
    (screenWidth >= 768 && screenWidth <= 1024)
  ) {
    return 'tablet';
  }

  // Check for mobile
  if (
    userAgent.includes('Mobile') ||
    userAgent.includes('Android') ||
    screenWidth < 768
  ) {
    return 'mobile';
  }

  return 'desktop';
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
