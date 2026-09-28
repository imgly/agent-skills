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

type CreativeEngineInstance = Awaited<ReturnType<typeof CreativeEngine.init>>;

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
  /**
   * An engine to render with. When given, `batchRender` reuses it and leaves it
   * open, so a caller rendering several batches pays for one engine instead of
   * one per call. Without it, `batchRender` creates and disposes its own.
   */
  engine?: CreativeEngineInstance;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Render multiple items from a template scene.
 *
 * Renders the template's **first page** only; further pages are ignored.
 *
 * Creates a fresh engine instance, renders all items, then disposes — unless
 * `options.engine` is given, in which case that engine is reused, left open and
 * handed back with the variables it came with.
 *
 * @param sceneString - The template scene to render
 * @param items - Array of items with images and variables to apply
 * @param options - Configuration options (license, baseURL, mimeType, engine)
 * @returns Array of results with blob and sceneString for each item
 */
export async function batchRender(
  sceneString: string,
  items: BatchItem[],
  options: BatchRenderOptions = {}
): Promise<BatchResult[]> {
  const ownsEngine = options.engine == null;
  const engine =
    options.engine ??
    (await CreativeEngine.init({
      license: options.license,
      baseURL: options.baseURL
    }));
  engine.editor.setSetting('page/title/show', false);

  // The variable store is engine state, not scene state, so a value one item
  // sets outlives it. Every item starts again from this snapshot.
  const variablesBefore = Object.fromEntries(
    engine.variable
      .findAll()
      .map((name) => [name, engine.variable.getString(name)])
  );

  try {
    const results: BatchResult[] = [];
    const mimeType = options.mimeType ?? 'image/png';

    for (const item of items) {
      await engine.scene.load(sceneString);
      resetVariables(engine, variablesBefore);

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
    resetVariables(engine, variablesBefore);
    if (ownsEngine) {
      engine.dispose();
    }
  }
}

/** Puts the variable store back to the values the batch started with. */
function resetVariables(
  engine: CreativeEngineInstance,
  values: Record<string, string>
): void {
  for (const name of engine.variable.findAll()) {
    engine.variable.remove(name);
  }
  for (const [name, value] of Object.entries(values)) {
    engine.variable.setString(name, value);
  }
}
