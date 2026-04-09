import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import type { AreaSuggestion } from '../types';

interface UseAreaSearchResult {
  suggestions: AreaSuggestion[];
  isLoading: boolean;
  error: string | null;
}

export function useAreaSearch(input: string): UseAreaSearchResult {
  const [suggestions, setSuggestions] = useState<AreaSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    if (debouncedInput.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    // Cancel the previous request if the user types again before it finishes
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/autocomplete?input=${encodeURIComponent(debouncedInput)}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error('Failed to fetch suggestions');

        const data: AreaSuggestion[] = await response.json();
        setSuggestions(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Could not load area suggestions. Please try again.');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
    return () => controller.abort();
  }, [debouncedInput]);

  return { suggestions, isLoading, error };
}