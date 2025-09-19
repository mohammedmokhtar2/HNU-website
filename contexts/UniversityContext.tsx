'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { University } from '@/types/university';
import { Section } from '@/types/section';

interface UniversityContextType {
  university: University | null;
  universities: University[];
  sections: Section[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isInitialLoad: boolean;
}

const UniversityContext = createContext<UniversityContextType | undefined>(
  undefined
);

interface UniversityProviderProps {
  children: ReactNode;
  universityId?: string;
}

// Cache for storing fetched data
const dataCache = new Map<
  string,
  { university: University; sections: Section[]; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function UniversityProvider({
  children,
  universityId,
}: UniversityProviderProps) {
  const [university, setUniversity] = useState<University | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchUniversityData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Always fetch all universities first
        const universitiesResponse = await fetch('/api/university');
        if (universitiesResponse.ok) {
          const universitiesData = await universitiesResponse.json();
          setUniversities(universitiesData);
        }

        if (!universityId) {
          setLoading(false);
          setIsInitialLoad(false);
          return;
        }

        // Check cache first
        const cacheKey = `university-${universityId}`;
        const cachedData = dataCache.get(cacheKey);
        const now = Date.now();

        if (
          !forceRefresh &&
          cachedData &&
          now - cachedData.timestamp < CACHE_DURATION
        ) {
          setUniversity(cachedData.university);
          setSections(cachedData.sections);
          setLoading(false);
          setIsInitialLoad(false);
          return;
        }

        // Use Promise.all for parallel requests
        const [uniResponse, sectionsResponse] = await Promise.all([
          fetch(`/api/university/${universityId}`),
          fetch(`/api/sections?universityId=${universityId}`),
        ]);

        if (!uniResponse.ok) {
          throw new Error('Failed to fetch university data');
        }
        if (!sectionsResponse.ok) {
          throw new Error('Failed to fetch sections data');
        }

        const [uniData, sectionsData] = await Promise.all([
          uniResponse.json(),
          sectionsResponse.json(),
        ]);

        // Update state
        setUniversity(uniData);
        setSections(sectionsData);

        // Cache the data
        dataCache.set(cacheKey, {
          university: uniData,
          sections: sectionsData,
          timestamp: now,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching university data:', err);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    },
    [universityId]
  );

  useEffect(() => {
    fetchUniversityData();
  }, [fetchUniversityData]);

  const refetch = useCallback(async () => {
    await fetchUniversityData(true);
  }, [fetchUniversityData]);

  const value: UniversityContextType = useMemo(
    () => ({
      university,
      universities,
      sections,
      loading,
      error,
      refetch,
      isInitialLoad,
    }),
    [university, universities, sections, loading, error, refetch, isInitialLoad]
  );

  return (
    <UniversityContext.Provider value={value}>
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const context = useContext(UniversityContext);
  if (context === undefined) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
}
