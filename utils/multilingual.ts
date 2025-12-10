// Utility functions for handling multilingual content

export function getMultilingualText(
  text: Record<string, any> | string | null | undefined,
  locale: string = 'en',
  fallback: string = ''
): string {
  if (!text) return fallback;

  if (typeof text === 'string') {
    return text;
  }

  if (typeof text === 'object') {
    // Try to get the text for the specified locale
    if (text[locale]) {
      return String(text[locale]);
    }

    // Fallback to English if available
    if (text.en) {
      return String(text.en);
    }

    // Fallback to Arabic if available
    if (text.ar) {
      return String(text.ar);
    }

    // If none of the above, try to get the first available value
    const firstValue = Object.values(text)[0];
    if (firstValue) {
      return String(firstValue);
    }
  }

  return fallback;
}

export function getCollegeName(
  college: { name: Record<string, any> },
  locale: string = 'en'
): string {
  return getMultilingualText(college.name, locale, 'Unknown College');
}

export function getUniversityName(
  university: { name: Record<string, any> },
  locale: string = 'en'
): string {
  return getMultilingualText(university.name, locale, 'Unknown University');
}

export function getCollegeDescription(
  college: { description?: Record<string, any> },
  locale: string = 'en'
): string {
  return getMultilingualText(college.description, locale, '');
}

export function getCollegeImage(college: {
  config?: { logoUrl?: string };
}): string {
  return college.config?.logoUrl || '/images/Placehold/college-placeholder.png';
}
