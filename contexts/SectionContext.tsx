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
import { Section, SectionWithRelationsResponse } from '@/types/section';

interface SectionContextType {
  sections: Section[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getSectionById: (id: string) => Promise<Section | null>;
  getSectionsByUniversity: (universityId: string) => Promise<Section[]>;
  getSectionsByCollege: (collegeId: string) => Promise<Section[]>;
  getSectionsByType: (type: string) => Promise<Section[]>;
  isInitialLoad: boolean;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

interface SectionProviderProps {
  children: ReactNode;
  universityId?: string;
  collegeId?: string;
}

// Cache for storing fetched data
const dataCache = new Map<string, { sections: Section[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function SectionProvider({
  children,
  universityId,
  collegeId,
}: SectionProviderProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchSections = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        if (universityId) params.append('universityId', universityId);
        if (collegeId) params.append('collegeId', collegeId);

        const cacheKey = `sections-${universityId || 'all'}-${collegeId || 'all'}`;
        const cachedData = dataCache.get(cacheKey);
        const now = Date.now();

        // Check cache first
        if (
          !forceRefresh &&
          cachedData &&
          now - cachedData.timestamp < CACHE_DURATION
        ) {
          setSections(cachedData.sections);
          setLoading(false);
          setIsInitialLoad(false);
          return;
        }

        const response = await fetch(`/api/sections?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch sections');
        }

        const sectionsData = await response.json();

        // Update state
        setSections(sectionsData);

        // Cache the data
        dataCache.set(cacheKey, {
          sections: sectionsData,
          timestamp: now,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching sections:', err);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    },
    [universityId, collegeId]
  );

  const getSectionById = useCallback(
    async (id: string): Promise<Section | null> => {
      try {
        const response = await fetch(`/api/sections/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error('Failed to fetch section');
        }

        const section = await response.json();
        return section;
      } catch (err) {
        console.error('Error fetching section by ID:', err);
        return null;
      }
    },
    []
  );

  const getSectionsByUniversity = useCallback(
    async (universityId: string): Promise<Section[]> => {
      try {
        const response = await fetch(
          `/api/sections?universityId=${universityId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch sections by university');
        }

        const sectionsData = await response.json();
        return sectionsData;
      } catch (err) {
        console.error('Error fetching sections by university:', err);
        return [];
      }
    },
    []
  );

  const getSectionsByCollege = useCallback(
    async (collegeId: string): Promise<Section[]> => {
      try {
        const response = await fetch(`/api/sections?collegeId=${collegeId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch sections by college');
        }

        const sectionsData = await response.json();
        return sectionsData;
      } catch (err) {
        console.error('Error fetching sections by college:', err);
        return [];
      }
    },
    []
  );

  const getSectionsByType = useCallback(
    async (type: string): Promise<Section[]> => {
      try {
        const response = await fetch(`/api/sections?type=${type}`);

        if (!response.ok) {
          throw new Error('Failed to fetch sections by type');
        }

        const sectionsData = await response.json();
        return sectionsData;
      } catch (err) {
        console.error('Error fetching sections by type:', err);
        return [];
      }
    },
    []
  );

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const refetch = useCallback(async () => {
    await fetchSections(true);
  }, [fetchSections]);

  const value: SectionContextType = useMemo(
    () => ({
      sections,
      loading,
      error,
      refetch,
      getSectionById,
      getSectionsByUniversity,
      getSectionsByCollege,
      getSectionsByType,
      isInitialLoad,
    }),
    [
      sections,
      loading,
      error,
      refetch,
      getSectionById,
      getSectionsByUniversity,
      getSectionsByCollege,
      getSectionsByType,
      isInitialLoad,
    ]
  );

  return (
    <SectionContext.Provider value={value}>{children}</SectionContext.Provider>
  );
}

export function useSection() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error('useSection must be used within a SectionProvider');
  }
  return context;
}
