/**
 * Constants for Content-Aware Resizing
 *
 * This module defines size presets and templates for the automated resizing demo.
 *
 * @see https://img.ly/docs/cesdk/js/block-layout/content-aware-resize-2eb7ee/
 */

import type { SizePreset, Template } from '../imgly/types';

// ============================================================================
// Size Presets
// ============================================================================

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

// ============================================================================
// Template Presets
// ============================================================================

/**
 * Default templates available for selection in the demo.
 */
export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'example-1',
    sceneUrl: 'example-1.scene',
    previewImagePath: 'example-1.png'
  },
  {
    id: 'example-2',
    sceneUrl: 'example-2.scene',
    previewImagePath: 'example-2.png'
  },
  {
    id: 'example-3',
    sceneUrl: 'example-3.scene',
    previewImagePath: 'example-3.png'
  }
];
