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

import { DEFAULT_EXPORT_MIME_TYPE, WHITE_1PX_DATA_URI } from '../constants';
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
 * Transparent 1x1 pixel image for clearing placeholder slots.
 */
export const CLEAR_IMAGE = WHITE_1PX_DATA_URI;

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

  const { exportMimeType = DEFAULT_EXPORT_MIME_TYPE } = options ?? {};

  // Load scene
  if (typeof sceneSource === 'string') {
    await cachedEngine.scene.loadFromURL(sceneSource);
  } else {
    await cachedEngine.scene.loadFromString(sceneSource.sceneString);
  }

  // Track blob URLs we create
  const blobUrls: string[] = [];

  // Replace each placeholder
  for (const [name, source] of Object.entries(placeholders)) {
    const url =
      source instanceof Blob
        ? (blobUrls.push(URL.createObjectURL(source)),
          blobUrls[blobUrls.length - 1])
        : source;

    cachedEngine.block.findByName(name).forEach((block) => {
      const fill = cachedEngine!.block.getFill(block);
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
