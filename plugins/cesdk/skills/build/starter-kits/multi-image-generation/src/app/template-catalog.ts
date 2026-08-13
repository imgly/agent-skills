/**
 * Multi-Image Generation App - Template Catalog
 *
 * Template configurations for multi-image generation.
 */

import { DEMO_ASSETS_BASE_URL } from './restaurant-catalog';
import type { Template } from '../imgly';

/**
 * Available templates for image generation.
 */
export const TEMPLATES: Record<string, Template> = {
  Square: {
    label: 'Square',
    sceneKey: 'square',
    previewImagePath: `${DEMO_ASSETS_BASE_URL}/images/placeholder-1.png`,
    outputFormat: 'image/png',
    width: 240,
    height: 240
  },
  Portrait: {
    label: 'Portrait',
    sceneKey: 'portrait',
    previewImagePath: `${DEMO_ASSETS_BASE_URL}/images/placeholder-2.png`,
    outputFormat: 'image/png',
    width: 200,
    height: 280
  },
  Landscape: {
    label: 'Landscape',
    sceneKey: 'landscape',
    previewImagePath: `${DEMO_ASSETS_BASE_URL}/images/placeholder-3.png`,
    outputFormat: 'image/png',
    width: 280,
    height: 200
  }
};
