/**
 * Constants for Content-Aware Resizing
 *
 * This module defines size presets and templates for the automated resizing demo.
 *
 * @see https://img.ly/docs/cesdk/js/automation/auto-resize-4c2d58/
 */

import type { Template } from '../imgly/types';
import { DEMO_ASSETS_BASE_URL } from '../imgly/demo-assets';
export { DEMO_ASSETS_BASE_URL };

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
