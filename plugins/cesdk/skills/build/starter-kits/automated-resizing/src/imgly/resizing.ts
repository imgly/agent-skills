/**
 * Content-Aware Resizing - Generate variants at different sizes
 *
 * This module provides the core resizing functionality that uses CE.SDK's
 * content-aware resizing algorithm to intelligently adapt designs to
 * different aspect ratios and dimensions.
 *
 * @see https://img.ly/docs/cesdk/js/block-layout/content-aware-resize-2eb7ee/
 */

import type { VariantBlob, ResizeOptions } from './types';

/**
 * Generate content-aware resized variants for all specified sizes.
 *
 * Returns blobs (not URLs) - caller handles URL creation and cleanup.
 * This keeps the module stateless and gives the caller full control.
 *
 * @param options - Resize options including engine, sizes, and scene
 * @returns Array of variant results with blobs
 *
 * @example
 * ```typescript
 * const variants = await resize({
 *   engine,
 *   sizes: DEFAULT_SIZES,
 *   scene: templateSceneString,
 *   onProgress: (completed, total) => updateProgress(completed / total)
 * });
 *
 * // Create URLs for rendering
 * const images = variants.map(v => ({
 *   ...v,
 *   url: URL.createObjectURL(v.blob)
 * }));
 *
 * // Later, clean up
 * images.forEach(img => URL.revokeObjectURL(img.url));
 * ```
 */
export async function resize(options: ResizeOptions): Promise<VariantBlob[]> {
  const { engine, sizes, scene, exportOptions = {}, onProgress } = options;

  // Save original scene to restore later
  const originalScene = await engine.scene.saveToString();
  const variants: VariantBlob[] = [];

  try {
    let index = 0;
    for (const size of sizes) {
      // Load source scene fresh for each variant
      await engine.scene.loadFromString(scene);

      // Apply content-aware resizing
      const pages = engine.scene.getPages();
      engine.block.resizeContentAware(pages, size.width, size.height);

      // Export the resized scene
      const sceneBlock = engine.scene.get();
      if (sceneBlock === null) {
        throw new Error('No scene available for export');
      }

      const blob = await engine.block.export(sceneBlock, exportOptions);
      const sceneString = await engine.scene.saveToString();

      const variant: VariantBlob = { size, blob, sceneString };
      variants.push(variant);

      index++;
      onProgress?.(index, sizes.length, variant);
    }

    return variants;
  } finally {
    // Restore original scene
    await engine.scene.loadFromString(originalScene);
  }
}
