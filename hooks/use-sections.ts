import { useState, useEffect } from 'react';
import { SectionService } from '@/services/section.service';
import { Section } from '@/types/section';

export function useSections(universityId: string) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await SectionService.getSectionsByUniversity(universityId);
        setSections(data);
      } catch (err) {
        console.error('Error fetching sections:', err);
        setError('Failed to load sections');
      } finally {
        setLoading(false);
      }
    };

    if (universityId) {
      fetchSections();
    }
  }, [universityId]);

  return { sections, loading, error };
}
