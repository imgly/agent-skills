/**
 * Mockup Editor - Constants
 *
 * All constants for the mockup editor including render defaults and product definitions.
 */

import type { Product } from './app/ProductSelector/ProductSelector';

// ============================================================================
// Render Defaults
// ============================================================================

/** Default maximum number of placeholder slots in mockup scenes */
export const DEFAULT_MAX_PLACEHOLDERS = 10;

/** Default debounce interval for auto-refresh (ms) */
export const DEFAULT_RENDER_DEBOUNCE_MS = 1500;

/** Default export dimensions for design pages */
export const DEFAULT_EXPORT_WIDTH = 512;
export const DEFAULT_EXPORT_HEIGHT = 512;

/** Default MIME type for mockup export */
export const DEFAULT_EXPORT_MIME_TYPE = 'image/jpeg' as const;

// ============================================================================
// Mockup Placeholder Configuration
// ============================================================================

/**
 * Data URI for a 1x1 white pixel image.
 * Used to clear unused placeholder slots in mockup scenes.
 * Using a data URI avoids external network requests.
 */
export const WHITE_1PX_DATA_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

// ============================================================================
// Scene Configuration
// ============================================================================

/**
 * Product configurations with design and mockup scene paths.
 * Each product has a user-editable design scene and a mockup scene for rendering.
 */
export const PRODUCTS: Record<string, Product> = {
  businesscard: {
    label: 'Business Card',
    scenePath: 'business-card.scene',
    mockupScenePath: 'business-card-mockup.scene'
  },
  poster: {
    label: 'Poster',
    scenePath: 'poster.scene',
    mockupScenePath: 'poster-mockup.scene'
  },
  socialmedia: {
    label: 'Social Media',
    scenePath: 'social-media.scene',
    mockupScenePath: 'social-media-mockup.scene'
  },
  postcard: {
    label: 'Post Card',
    scenePath: 'postcard.scene',
    mockupScenePath: 'postcard-mockup.scene'
  },
  apparel: {
    label: 'Apparel',
    scenePath: 'apparel.scene',
    mockupScenePath: 'apparel-mockup.scene'
  }
};
