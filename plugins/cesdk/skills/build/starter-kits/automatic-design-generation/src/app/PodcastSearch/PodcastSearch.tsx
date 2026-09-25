/**
 * Podcast Search Component
 *
 * Allows users to search and select podcasts from iTunes.
 */

import classNames from 'classnames';

import type { Podcast } from '../api/transformer';

import { resolveAssetPath } from '../resolveAssetPath';

import styles from './PodcastSearch.module.css';

interface PodcastSearchProps {
  searchQuery: string;
  searchResults: Podcast[];
  isSearching: boolean;
  selectedPodcast: Podcast | null;
  onSearchChange: (query: string) => void;
  onPodcastSelect: (podcast: Podcast) => void;
}

export function PodcastSearch({
  searchQuery,
  searchResults,
  isSearching,
  selectedPodcast,
  onSearchChange,
  onPodcastSelect
}: PodcastSearchProps) {
  const showPlaceholders = isSearching || searchResults.length === 0;

  return (
    <div className={styles.searchWrapper}>
      <input
        className={styles.searchBar}
        type="text"
        placeholder='e.g. "Conan O Brien Needs A Friend"'
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className={styles.searchResults}>
        {showPlaceholders
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={classNames(
                  styles.podcastResultCard,
                  styles.disabled,
                  isSearching && styles.loading
                )}
              >
                <div className={styles.placeholderImageWrapper}>
                  <img
                    src={resolveAssetPath('/placeholder-search-result.png')}
                    alt="Search Placeholder"
                    className={styles.placeholderImage}
                  />
                </div>
                <div className={styles.placeholderTextSection}>
                  <div
                    className={classNames(styles.placeholderText, styles.long)}
                  />
                  <div
                    className={classNames(styles.placeholderText, styles.short)}
                  />
                </div>
              </div>
            ))
          : searchResults.map((podcast) => {
              const isSelected =
                podcast.collectionId === selectedPodcast?.collectionId;
              return (
                <button
                  key={podcast.collectionId}
                  className={classNames(
                    styles.podcastResultCard,
                    isSelected && styles.selected
                  )}
                  onClick={() => onPodcastSelect(podcast)}
                >
                  <img
                    src={podcast.artworkUrl600}
                    alt={podcast.collectionName}
                    className={styles.podcastResultCardImage}
                  />
                  <div className={styles.podcastResultCardText}>
                    <p
                      className={classNames(
                        styles.podcastResultCardTitle,
                        styles.truncate
                      )}
                    >
                      {podcast.collectionName}
                    </p>
                    <p className={styles.truncate}>{podcast.artistName}</p>
                  </div>
                </button>
              );
            })}
      </div>
    </div>
  );
}
