/**
 * CE.SDK Automated Resizing - Size Presets
 */

import type { SizePreset } from './types';

/**
 * Default size presets for the automated resizing demo.
 * These represent common social media post dimensions.
 */
export const DEFAULT_SIZES: SizePreset[] = [
  {
    id: 'ig-story',
    label: 'Instagram Story',
    width: 1080,
    height: 1920,
    designUnit: 'Pixel',
    platform: 'instagram'
  },
  {
    id: 'ig-post-4-5',
    label: 'Instagram Post 4:5',
    width: 1080,
    height: 1350,
    designUnit: 'Pixel',
    platform: 'instagram'
  },
  {
    id: 'x-post',
    label: 'X (Twitter) Post',
    width: 1200,
    height: 675,
    designUnit: 'Pixel',
    platform: 'x'
  },
  {
    id: 'facebook-post',
    label: 'Facebook Post',
    width: 1200,
    height: 630,
    designUnit: 'Pixel',
    platform: 'facebook'
  }
];
