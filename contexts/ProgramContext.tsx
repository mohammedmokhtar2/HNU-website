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
import { Program } from '@/types/program';

interface ProgramContextType {
  programs: Program[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isInitialLoad: boolean;
  selectedProgram: Program | null;
  setSelectedProgram: (program: Program | null) => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

interface ProgramProviderProps {
  children: ReactNode;
  collageId?: string;
}

// Cache for storing fetched data
const programDataCache = new Map<
  string,
  { programs: Program[]; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function ProgramProvider({ children, collageId }: ProgramProviderProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const fetchProgramData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Build cache key based on parameters
        const cacheKey = `programs-${collageId || 'all'}`;
        const cachedData = programDataCache.get(cacheKey);
        const now = Date.now();

        // Check cache first
        if (
          !forceRefresh &&
          cachedData &&
          now - cachedData.timestamp < CACHE_DURATION
        ) {
          setPrograms(cachedData.programs);
          setLoading(false);
          setIsInitialLoad(false);
          return;
        }

        // Build API URL
        const programsUrl = collageId
          ? `/api/programs?collageId=${collageId}`
          : '/api/programs';

        console.log('Fetching programs from:', programsUrl);

        const response = await fetch(programsUrl);

        console.log('Programs response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch programs data');
        }

        const data = await response.json();

        console.log('Fetched programs data:', data);

        // Update state - handle both direct array and paginated response
        const programsData = data.data || data;
        setPrograms(programsData);

        // Cache the data
        programDataCache.set(cacheKey, {
          programs: programsData,
          timestamp: now,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching program data:', err);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    },
    [collageId]
  );

  useEffect(() => {
    fetchProgramData();
  }, [fetchProgramData]);

  const refetch = useCallback(async () => {
    await fetchProgramData(true);
  }, [fetchProgramData]);

  const value: ProgramContextType = useMemo(
    () => ({
      programs,
      loading,
      error,
      refetch,
      isInitialLoad,
      selectedProgram,
      setSelectedProgram,
    }),
    [programs, loading, error, refetch, isInitialLoad, selectedProgram]
  );

  return (
    <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
  );
}

export function useProgram() {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
}
