/**
 * Batch Renderer - Headless batch rendering using CE.SDK Engine
 *
 * @example
 * ```typescript
 * const results = await batchRender(sceneString, [
 *   { images: { Photo: '/img/1.jpg' }, variables: { Name: 'Alice' } },
 *   { images: { Photo: '/img/2.jpg' }, variables: { Name: 'Bob' } }
 * ], { baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL });
 *
 * results.forEach(r => console.log(URL.createObjectURL(r.blob)));
 * ```
 */

import CreativeEngine from '@cesdk/engine';

// ============================================================================
// Types
// ============================================================================

export type MimeType = 'image/png' | 'image/jpeg' | 'image/webp';

/** Data for a single item in the batch */
export interface BatchItem {
  /** Image replacements: block name -> image URL */
  images?: Record<string, string>;
  /** Variable substitutions: variable name -> value */
  variables?: Record<string, string>;
}

/** Result for a single rendered item */
export interface BatchResult {
  blob: Blob;
  sceneString: string;
}

/** Options for batch rendering */
export interface BatchRenderOptions {
  /** CE.SDK license key */
  license?: string;
  /** Base URL for CE.SDK assets */
  baseURL?: string;
  /** Output format (default: 'image/png') */
  mimeType?: MimeType;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Render multiple items from a template scene.
 * Creates a fresh engine instance, renders all items, then disposes.
 *
 * @param sceneString - The template scene to render
 * @param items - Array of items with images and variables to apply
 * @param options - Configuration options (license, baseURL, mimeType)
 * @returns Array of results with blob and sceneString for each item
 */
export async function batchRender(
  sceneString: string,
  items: BatchItem[],
  options: BatchRenderOptions = {}
): Promise<BatchResult[]> {
  const engine = await CreativeEngine.init({
    license: options.license,
    baseURL: options.baseURL
  });
  engine.editor.setSetting('page/title/show', false);

  try {
    const results: BatchResult[] = [];
    const mimeType = options.mimeType ?? 'image/png';

    for (const item of items) {
      await engine.scene.loadFromString(sceneString);

      // Apply images
      if (item.images) {
        for (const [blockName, imageUrl] of Object.entries(item.images)) {
          const blocks = engine.block.findByName(blockName);
          for (const block of blocks) {
            const fill = engine.block.getFill(block);
            engine.block.setString(fill, 'fill/image/imageFileURI', imageUrl);
          }
        }
      }

      // Apply variables
      if (item.variables) {
        for (const [name, value] of Object.entries(item.variables)) {
          engine.variable.setString(name, value);
        }
      }

      // Render
      const pages = engine.block.findByType('page');
      if (pages.length === 0) throw new Error('No pages found in scene');
      const blob = await engine.block.export(pages[0], { mimeType });
      const savedScene = await engine.scene.saveToString();

      results.push({ blob, sceneString: savedScene });
    }

    return results;
  } finally {
    engine.dispose();
  }
}
