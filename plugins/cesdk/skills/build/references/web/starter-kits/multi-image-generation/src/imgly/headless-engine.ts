/**
 * CE.SDK Multi-Image Generation - Headless Engine
 *
 * Creates the engine that renders the branded assets. Kept free of any
 * editor import so it also runs in a non-browser runtime such as `@cesdk/node`.
 * Asset source plugins live in `asset-sources.ts` and are registered by the
 * browser entry point.
 */

import CreativeEngine, { type Configuration } from '@cesdk/engine';

/**
 * Initialize a headless CE.SDK engine.
 *
 * @param options - Engine configuration. Pass `core.baseURL` as well when you
 *   host the engine core yourself.
 * @returns The initialized engine. Call `dispose()` when you are done with it.
 */
export async function initMultiImageGenerationHeadlessEngine(
  options: Partial<Configuration> = {}
): Promise<CreativeEngine> {
  return CreativeEngine.init({
    baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
    ...options
  });
}
