/**
 * 3D Mockup Editor - Constants
 *
 * All constants for the 3D mockup editor including render defaults and product definitions.
 */

import type { Product } from './ProductSelector/ProductSelector';
import { resolveAssetPath } from './resolveAssetPath';

// ============================================================================
// Render Defaults
// ============================================================================

/** Default maximum number of placeholder slots in mockup scenes */
export const DEFAULT_MAX_PLACEHOLDERS = 10;

/** Default debounce interval for auto-refresh (ms) */
export const DEFAULT_RENDER_DEBOUNCE_MS = 1500;

/** Default export dimensions for design pages */
export const DEFAULT_EXPORT_WIDTH = 1048;
export const DEFAULT_EXPORT_HEIGHT = 1048;

// ============================================================================
// Product Configuration
// ============================================================================

/**
 * Product configurations for 3D mockup editor.
 * Each product has assets in public/{assetsFolderName}/.
 */
export const PRODUCTS: Record<string, Product> = {
  businesscard: {
    label: 'Business Card',
    assetsFolderName: 'business-card',
    baseColorTextureIndex: 0,
    cameraOrbit: '160deg 90deg'
  },
  cap: {
    label: 'Baseball Cap',
    assetsFolderName: 'cap',
    baseColorTextureIndex: 0,
    cameraOrbit: '160deg 90deg'
  },
  apparel: {
    label: 'Apparel',
    assetsFolderName: 't-shirt',
    baseColorTextureIndex: 1,
    cameraOrbit: '0deg 90deg'
  }
};

// ============================================================================
// Scene URL Configuration
// ============================================================================

// ============================================================================
// Scene URL Helpers
// ============================================================================

/**
 * Get the URL for a product's design scene.
 */
export function getDesignSceneUrl(productKey: string): string {
  const product = PRODUCTS[productKey];
  if (!product) {
    throw new Error(`Unknown product key: ${productKey}`);
  }
  return resolveAssetPath(`/${product.assetsFolderName}/design.scene`);
}

/**
 * Get the URL for a product's texture mockup scene.
 */
export function getMockupSceneUrl(productKey: string): string {
  const product = PRODUCTS[productKey];
  if (!product) {
    throw new Error(`Unknown product key: ${productKey}`);
  }
  return resolveAssetPath(
    `/${product.assetsFolderName}/textures/Material_baseColor.scene`
  );
}

/**
 * Get the URL for a product's 3D model (local).
 */
export function getModelUrl(productKey: string): string {
  const product = PRODUCTS[productKey];
  if (!product) {
    throw new Error(`Unknown product key: ${productKey}`);
  }
  return `/${product.assetsFolderName}/scene.gltf`;
}
