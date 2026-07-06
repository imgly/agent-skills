/**
 * Multi-Image Generation App - Types
 *
 * Domain types specific to this application.
 */

import SCENES from './scenes.json';

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
  sceneKey: keyof typeof SCENES;
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
