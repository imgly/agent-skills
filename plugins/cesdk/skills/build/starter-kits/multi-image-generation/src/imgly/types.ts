/**
 * CE.SDK Multi-Image Generation - Shared Types
 *
 * Common type definitions used across the imgly module.
 */

/**
 * RGBA color type used by CE.SDK engine.
 */
export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Restaurant data for template personalization.
 */
export interface Restaurant {
  name: string;
  photoPath: string;
  price: string;
  reviewCount: number;
  rating: number;
  cardPath: string;
  logoPath: string;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Template configuration for image generation.
 */
export interface Template {
  label: string;
  sceneKey: string;
  previewImagePath: string;
  outputFormat: 'image/png' | 'image/jpeg';
  width: number;
  height: number;
}

/**
 * Generated asset state.
 */
export interface GeneratedAsset {
  isLoading: boolean;
  src: string | null;
  sceneString: string | null;
  label: string;
}
