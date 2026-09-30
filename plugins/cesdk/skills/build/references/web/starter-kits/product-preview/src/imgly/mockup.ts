/**
 * CE.SDK Mockup Rendering
 *
 * Renders designs onto product mockups using a headless CreativeEngine.
 * The engine is lazily initialized on first render and reused.
 *
 * @example
 * ```typescript
 * import { renderMockup, disposeMockupRenderer, CLEAR_IMAGE } from './imgly';
 *
 * const result = await renderMockup(config, 'mockup.scene', {
 *   'Image 1': designBlob,
 *   'Image 2': CLEAR_IMAGE
 * });
 *
 * // When done (e.g., on component unmount)
 * disposeMockupRenderer();
 * ```
 */

import CreativeEngine from '@cesdk/engine';

import type {
  HeadlessEngineConfig,
  Placeholders,
  RenderMockupOptions,
  RenderResult,
  SceneSource
} from './types';

// ============================================================================
// Constants
// ============================================================================

/**
 * Marks a placeholder slot as unused: the slot's fill is switched off instead
 * of being pointed at an image. A `data:` URL cannot stand in for it, because
 * `scene.saveToString` rejects that scheme.
 */
export const CLEAR_IMAGE = 'ly.img.mockup/clear';

// ============================================================================
// Internal State
// ============================================================================

let cachedEngine: CreativeEngine | null = null;

// ============================================================================
// Mockup Rendering
// ============================================================================

/**
 * Renders placeholders onto a mockup scene.
 *
 * The engine is lazily initialized on first call and reused for subsequent renders.
 * Call `disposeMockupRenderer()` when done to clean up resources.
 *
 * @param config - Engine configuration (license, baseURL, etc.)
 * @param sceneSource - URL to scene file or { sceneString } object
 * @param placeholders - Map of placeholder names to images (Blob or URL)
 * @param options - Optional render settings
 * @returns RenderResult with mockup URL and scene string
 */
export async function renderMockup(
  config: HeadlessEngineConfig,
  sceneSource: SceneSource,
  placeholders: Placeholders,
  options?: RenderMockupOptions
): Promise<RenderResult> {
  // Lazy initialize engine
  if (!cachedEngine) {
    cachedEngine = await CreativeEngine.init({
      license: config.license,
      userId: config.userId,
      baseURL: config.baseURL
    });
  }

  const { exportMimeType = 'image/jpeg' } = options ?? {};

  // Load scene
  if (typeof sceneSource === 'string') {
    await cachedEngine.scene.load(sceneSource);
  } else {
    await cachedEngine.scene.load(sceneSource.sceneString);
  }

  // Track blob URLs we create
  const blobUrls: string[] = [];

  try {
    // Replace each placeholder
    for (const [name, source] of Object.entries(placeholders)) {
      const blocks = cachedEngine.block.findByName(name);

      if (source === CLEAR_IMAGE) {
        blocks.forEach((block) =>
          cachedEngine!.block.setFillEnabled(block, false)
        );
        continue;
      }

      const url =
        source instanceof Blob
          ? (blobUrls.push(URL.createObjectURL(source)),
            blobUrls[blobUrls.length - 1])
          : source;

      blocks.forEach((block) => {
        const fill = cachedEngine!.block.getFill(block);
        // A slot cleared by an earlier render still has its fill switched off.
        cachedEngine!.block.setFillEnabled(block, true);
        cachedEngine!.block.setString(fill, 'fill/image/imageFileURI', url);
      });
    }

    // Save scene string
    const sceneString = await cachedEngine.scene.saveToString();

    // Export mockup
    const scene = cachedEngine.scene.get();
    if (scene === null) {
      throw new Error('No scene loaded');
    }

    const mockupBlob = await cachedEngine.block.export(scene, {
      mimeType: exportMimeType
    });

    const mockupUrl = URL.createObjectURL(mockupBlob);
    blobUrls.push(mockupUrl);

    return { mockupUrl, sceneString, blobUrls };
  } catch (error) {
    // A failed render must not leak the object URLs it already created.
    blobUrls.forEach((url) => URL.revokeObjectURL(url));
    throw error;
  }
}

/**
 * Disposes the cached mockup rendering engine.
 * Call this when the mockup editor is unmounted to free resources.
 */
export function disposeMockupRenderer(): void {
  if (cachedEngine) {
    cachedEngine.dispose();
    cachedEngine = null;
  }
}
