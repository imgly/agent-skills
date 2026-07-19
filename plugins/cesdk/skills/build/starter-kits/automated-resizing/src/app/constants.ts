/**
 * Constants for Content-Aware Resizing
 *
 * This module defines size presets and templates for the automated resizing demo.
 *
 * @see https://img.ly/docs/cesdk/js/automation/auto-resize-4c2d58/
 */

import type { SizePreset, Template } from '../imgly/types';

/**
 * Demo assets for this example (scenes, previews, icons, …) are loaded from
 * the IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/0.1.0/starterkit-automated-resizing';

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
    sceneUrl: `${DEMO_ASSETS_BASE_URL}/example-1.scene`,
    previewImagePath: `${DEMO_ASSETS_BASE_URL}/example-1.png`
  },
  {
    id: 'example-2',
    sceneUrl: `${DEMO_ASSETS_BASE_URL}/example-2.scene`,
    previewImagePath: `${DEMO_ASSETS_BASE_URL}/example-2.png`
  },
  {
    id: 'example-3',
    sceneUrl: `${DEMO_ASSETS_BASE_URL}/example-3.scene`,
    previewImagePath: `${DEMO_ASSETS_BASE_URL}/example-3.png`
  }
];
