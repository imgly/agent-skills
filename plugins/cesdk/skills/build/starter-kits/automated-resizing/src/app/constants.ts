/**
 * Constants for Content-Aware Resizing
 *
 * This module defines size presets and templates for the automated resizing demo.
 *
 * @see https://img.ly/docs/cesdk/js/automation/auto-resize-4c2d58/
 */

import type { Template } from '../imgly/types';

/**
 * Demo assets for this example (scenes, previews, icons, …) are loaded from
 * the IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.80.0/starterkit-automated-resizing';

// ============================================================================
// Size Presets
// ============================================================================

export { DEFAULT_SIZES } from '../imgly/sizes';

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
