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
  selectedUniversityId: string | null;
  setSelectedUniversityId: (id: string | null) => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(
  undefined
);

interface UniversityProviderProps {
  children: ReactNode;
  initialUniversityId?: string;
}

// Cache for storing fetched data
const dataCache = new Map<
  string,
  { university: University; sections: Section[]; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function UniversityProvider({
  children,
  initialUniversityId,
}: UniversityProviderProps) {
  const [university, setUniversity] = useState<University | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    string | null
  >(initialUniversityId || null);

  const fetchUniversityData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Always fetch all universities first
        const universitiesResponse = await fetch('/api/university');
        if (!universitiesResponse.ok) {
          throw new Error('Failed to fetch universities list');
        }

        const universitiesData = await universitiesResponse.json();
        setUniversities(universitiesData);

        // Determine which university to fetch data for
        let currentUniversityId = selectedUniversityId;

        // If no university is selected, select the first one
        if (!currentUniversityId && universitiesData.length > 0) {
          currentUniversityId = universitiesData[0].id;
          setSelectedUniversityId(currentUniversityId);
        }

        if (!currentUniversityId) {
          setLoading(false);
          setIsInitialLoad(false);
          return;
        }

        // Check cache first
        const cacheKey = `university-${currentUniversityId}`;
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
          fetch(`/api/university/${currentUniversityId}`),
          fetch(`/api/sections?universityId=${currentUniversityId}`),
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

        console.log('✅ Successfully loaded:', {
          university: uniData.name,
          sectionsCount: sectionsData.length,
          sections: sectionsData.map((s: any) => ({
            id: s.id,
            type: s.type,
            order: s.order,
          })),
        });

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
    [selectedUniversityId]
  );

  // Initial fetch and refetch when selectedUniversityId changes
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
      selectedUniversityId,
      setSelectedUniversityId,
    }),
    [
      university,
      universities,
      sections,
      loading,
      error,
      refetch,
      isInitialLoad,
      selectedUniversityId,
    ]
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
