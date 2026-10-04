/**
 * Podcast API - iTunes Search API Integration
 *
 * Handles podcast search functionality using the iTunes Search API.
 */

import type { Podcast } from './transformer';

import { ITUNES_SEARCH_API } from '../constants';

/**
 * Search podcasts from iTunes API.
 *
 * @param query - Search query string
 * @returns Array of podcast results
 */
export async function searchPodcasts(query: string): Promise<Podcast[]> {
  if (!query.trim()) {
    return [];
  }

  const url = `${ITUNES_SEARCH_API}?entity=podcast&limit=4&term=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.results;
}

/**
 * Extract dominant color from an image URL.
 *
 * Uses canvas to sample the image and extract the average color.
 *
 * @param src - Image URL to analyze
 * @returns Hex color string (e.g., '#ff5500')
 */
export async function getMainColor(src: string): Promise<string> {
  return new Promise((resolve) => {
    const context = document.createElement('canvas').getContext('2d');
    if (!context) {
      resolve('#9933FF'); // Default fallback
      return;
    }

    context.imageSmoothingEnabled = true;

    const img = new Image();
    img.src = src;
    img.crossOrigin = '';

    img.onload = () => {
      context.drawImage(img, 0, 0, 1, 1);
      const data = context.getImageData(0, 0, 1, 1).data;
      const hex =
        '#' +
        ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2])
          .toString(16)
          .slice(1);
      resolve(hex);
    };

    img.onerror = () => {
      resolve('#9933FF'); // Default fallback on error
    };
  });
}
