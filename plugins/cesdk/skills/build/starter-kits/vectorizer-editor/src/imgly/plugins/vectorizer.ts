/**
 * Vectorizer Plugin
 *
 * Adds image vectorization using @imgly/plugin-vectorizer-web.
 * Converts raster images to vector graphics via the canvas menu.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/plugin-vectorizer-web
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { setupVectorizerPlugin } from './plugins/vectorizer';
 *
 * // After cesdk initialization
 * await setupVectorizerPlugin(cesdk);
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/plugins/vectorizer/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import VectorizerPlugin from '@imgly/plugin-vectorizer-web';

/**
 * Sets up the vectorizer plugin with canvas menu entry.
 *
 * - Canvas menu: Adds "Vectorize" option when an image is selected
 *
 * The vectorizer converts raster images (PNG, JPG, etc.) into vector graphics
 * that can be scaled without losing quality.
 *
 * @param cesdk - The CreativeEditorSDK instance
 */
export async function setupVectorizerPlugin(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // Add official vectorizer plugin
  // This automatically adds "Vectorize" option to the canvas menu
  // when an image block is selected
  await cesdk.addPlugin(
    VectorizerPlugin({
      ui: { locations: 'canvasMenu' }
    })
  );
}
