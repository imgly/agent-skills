/**
 * 3D Mockup Editor - App Utilities
 *
 * Helper functions for working with products and scene URLs.
 */

import type { CreativeEngine } from '@cesdk/cesdk-js';

import { CLEAR_IMAGE } from '../imgly/mockup';
import type { Placeholders } from '../imgly/types';
import { PRODUCTS, getDesignSceneUrl, getMockupSceneUrl } from './constants';

// Re-export scene URL helpers
export { getDesignSceneUrl, getMockupSceneUrl };

/**
 * Placeholder naming convention for mockup scenes.
 * Our mockup scenes use "Image 1", "Image 2", etc. as placeholder names.
 * This function generates the name for a given index (0-based).
 */
export function getPlaceholderName(index: number): string {
  return `Image ${index + 1}`;
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
  const filename = `${product.label.toLowerCase().replace(/\s+/g, '-')}-mockup.png`;

  const link = document.createElement('a');
  link.href = mockupUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export every design page as a placeholder image for the mockup scene, then
 * clear the slots the design does not fill.
 *
 * @param engine - The design editor's engine
 * @param maxPlaceholders - How many `Image N` slots the mockup scenes carry
 * @param size - Pixel size each page is exported at
 * @returns The placeholder map `renderMockup` takes
 */
export async function buildPlaceholders(
  engine: CreativeEngine,
  maxPlaceholders: number,
  size: { width: number; height: number }
): Promise<Placeholders> {
  const pages = engine.block.findByKind('page');

  const pageBlobs = await Promise.all(
    pages.map((id) =>
      engine.block.export(id, {
        mimeType: 'image/png',
        targetWidth: size.width,
        targetHeight: size.height
      })
    )
  );

  const placeholders: Placeholders = {};
  pageBlobs.forEach((blob, index) => {
    placeholders[getPlaceholderName(index)] = blob;
  });
  for (let i = pageBlobs.length; i < maxPlaceholders; i++) {
    placeholders[getPlaceholderName(i)] = CLEAR_IMAGE;
  }

  return placeholders;
}
