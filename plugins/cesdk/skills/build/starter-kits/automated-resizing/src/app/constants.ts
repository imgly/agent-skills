/**
 * Constants for Content-Aware Resizing
 *
 * This module defines size presets and templates for the automated resizing demo.
 *
 * @see https://img.ly/docs/cesdk/js/automation/auto-resize-4c2d58/
 */

import type { Template } from '../imgly/types';

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
