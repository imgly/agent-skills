/**
 * usePodcastSearch Hook
 *
 * Manages podcast search state, API calls, and color extraction.
 */

import { useCallback, useRef, useState } from 'react';

import type { Podcast } from '../api/transformer';

import { getMainColor, searchPodcasts } from '../api/podcast';

interface UsePodcastSearchReturn {
  searchQuery: string;
  searchResults: Podcast[];
  isSearching: boolean;
  currentPodcast: Podcast | null;
  handleSearchChange: (query: string) => void;
  handlePodcastSelect: (podcast: Podcast) => Promise<string>;
}

export function usePodcastSearch(): UsePodcastSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Podcast[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);

  const searchDebounceRef = useRef<number | null>(null);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = window.setTimeout(async () => {
      try {
        const results = await searchPodcasts(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Failed to fetch podcasts', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  const handlePodcastSelect = useCallback(
    async (podcast: Podcast): Promise<string> => {
      setCurrentPodcast(podcast);

      // Extract dominant color from artwork
      const mainColor = await getMainColor(podcast.artworkUrl600);
      return mainColor;
    },
    []
  );

  return {
    searchQuery,
    searchResults,
    isSearching,
    currentPodcast,
    handleSearchChange,
    handlePodcastSelect
  };
}
