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
import { College } from '@/types/college';
import { Section } from '@/types/section';

interface CollegeContextType {
  colleges: College[];
  sections: Section[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isInitialLoad: boolean;
  selectedCollege: College | null;
  setSelectedCollege: (college: College | null) => void;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

interface CollegeProviderProps {
  children: ReactNode;
  universityId?: string;
  collegeId?: string;
}

// Cache for storing fetched data
const collegeDataCache = new Map<
  string,
  { colleges: College[]; sections: Section[]; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function CollegeProvider({
  children,
  universityId,
  collegeId,
}: CollegeProviderProps) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  const fetchCollegeData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Build cache key based on parameters
        const cacheKey = `colleges-${universityId || 'all'}-${collegeId || 'all'}`;
        const cachedData = collegeDataCache.get(cacheKey);
        const now = Date.now();

        // Check cache first
        if (
          !forceRefresh &&
          cachedData &&
          now - cachedData.timestamp < CACHE_DURATION
        ) {
          setColleges(cachedData.colleges);
          setSections(cachedData.sections);
          setLoading(false);
          setIsInitialLoad(false);
          return;
        }

        // Build API URLs
        const collegesUrl = universityId
          ? `/api/colleges?universityId=${universityId}`
          : '/api/colleges';

        // For debugging, also fetch all colleges to compare
        const allCollegesUrl = '/api/colleges';

        const sectionsUrl = collegeId
          ? `/api/sections?collegeId=${collegeId}`
          : universityId
            ? `/api/sections?universityId=${universityId}`
            : '/api/sections';

        console.log('Fetching colleges from:', collegesUrl);
        console.log('Fetching all colleges from:', allCollegesUrl);
        console.log('Fetching sections from:', sectionsUrl);

        // Use Promise.all for parallel requests
        const [collegesResponse, sectionsResponse, allCollegesResponse] =
          await Promise.all([
            fetch(collegesUrl),
            fetch(sectionsUrl),
            fetch(allCollegesUrl),
          ]);

        console.log('Colleges response status:', collegesResponse.status);
        console.log('Sections response status:', sectionsResponse.status);
        console.log(
          'All colleges response status:',
          allCollegesResponse.status
        );

        if (!collegesResponse.ok) {
          throw new Error('Failed to fetch colleges data');
        }
        if (!sectionsResponse.ok) {
          throw new Error('Failed to fetch sections data');
        }

        const [collegesData, sectionsData, allCollegesData] = await Promise.all(
          [
            collegesResponse.json(),
            sectionsResponse.json(),
            allCollegesResponse.json(),
          ]
        );

        console.log('Fetched colleges data (filtered):', collegesData);
        console.log(
          'Number of colleges fetched (filtered):',
          collegesData.length
        );
        console.log('Fetched colleges data (all):', allCollegesData);
        console.log(
          'Number of colleges fetched (all):',
          allCollegesData.length
        );
        console.log('Fetched sections data:', sectionsData);

        // Update state - temporarily use all colleges for debugging
        setColleges(
          allCollegesData.length > 0 ? allCollegesData : collegesData
        );
        setSections(sectionsData);

        // Set selected college if collegeId is provided
        if (collegeId && collegesData.length > 0) {
          const college = collegesData.find((c: College) => c.id === collegeId);
          setSelectedCollege(college || null);
        }

        // Cache the data - use the same data we're setting in state
        const dataToCache =
          allCollegesData.length > 0 ? allCollegesData : collegesData;
        collegeDataCache.set(cacheKey, {
          colleges: dataToCache,
          sections: sectionsData,
          timestamp: now,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching college data:', err);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    },
    [universityId, collegeId]
  );

  useEffect(() => {
    fetchCollegeData();
  }, [fetchCollegeData]);

  const refetch = useCallback(async () => {
    await fetchCollegeData(true);
  }, [fetchCollegeData]);

  const value: CollegeContextType = useMemo(
    () => ({
      colleges,
      sections,
      loading,
      error,
      refetch,
      isInitialLoad,
      selectedCollege,
      setSelectedCollege,
    }),
    [
      colleges,
      sections,
      loading,
      error,
      refetch,
      isInitialLoad,
      selectedCollege,
    ]
  );

  return (
    <CollegeContext.Provider value={value}>{children}</CollegeContext.Provider>
  );
}

export function useCollege() {
  const context = useContext(CollegeContext);
  if (context === undefined) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
}
