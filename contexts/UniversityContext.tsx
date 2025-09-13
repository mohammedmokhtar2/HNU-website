'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { University } from '@/types/university';
import { Section } from '@/types/section';

interface UniversityContextType {
  university: University | null;
  sections: Section[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const UniversityContext = createContext<UniversityContextType | undefined>(
  undefined
);

interface UniversityProviderProps {
  children: ReactNode;
  universityId?: string;
}

export function UniversityProvider({
  children,
  universityId,
}: UniversityProviderProps) {
  const [university, setUniversity] = useState<University | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversityData = async () => {
    if (!universityId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch university data
      const uniResponse = await fetch(`/api/university/${universityId}`);
      if (!uniResponse.ok) {
        throw new Error('Failed to fetch university data');
      }
      const uniData = await uniResponse.json();
      setUniversity(uniData);

      // Fetch sections data
      const sectionsResponse = await fetch(
        `/api/sections?universityId=${universityId}`
      );
      if (!sectionsResponse.ok) {
        throw new Error('Failed to fetch sections data');
      }
      const sectionsData = await sectionsResponse.json();
      setSections(sectionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching university data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversityData();
  }, [universityId]);

  const refetch = async () => {
    await fetchUniversityData();
  };

  const value: UniversityContextType = {
    university,
    sections,
    loading,
    error,
    refetch,
  };

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
