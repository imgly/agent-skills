/**
 * Mockup Editor - App Utilities
 *
 * Helper functions for working with products and scene URLs.
 */

import { PRODUCTS } from '../constants';
import { resolveAssetPath } from './resolveAssetPath';

/**
 * Placeholder naming convention for mockup scenes.
 * Our mockup scenes use "Image 1", "Image 2", etc. as placeholder names.
 * This function generates the name for a given index (0-based).
 */
export function getPlaceholderName(index: number): string {
  return `Image ${index + 1}`;
}

/**
 * Gets the full URL for a product's design scene.
 */
export function getDesignSceneUrl(productKey: string): string {
  const product = PRODUCTS[productKey];
  if (!product) {
    throw new Error(`Unknown product key: ${productKey}`);
  }
  return resolveAssetPath(`/${product.scenePath}`);
}

/**
 * Gets the full URL for a product's mockup scene.
 */
export function getMockupSceneUrl(productKey: string): string {
  const product = PRODUCTS[productKey];
  if (!product) {
    throw new Error(`Unknown product key: ${productKey}`);
  }
  return resolveAssetPath(`/${product.mockupScenePath}`);
}

/**
 * Gets the default product key (first in the catalog).
 */
export function getDefaultProductKey(): string {
  return Object.keys(PRODUCTS)[0];
}

/**
 * Downloads a mockup image from a blob URL.
 *
 * @param mockupUrl - The blob URL of the mockup image
 * @param productKey - The product key for naming the file
 */
export function downloadMockup(mockupUrl: string, productKey: string): void {
  const product = PRODUCTS[productKey];
  const filename = `${product.label.toLowerCase().replace(/\s+/g, '-')}-mockup.jpg`;

  const link = document.createElement('a');
  link.href = mockupUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
