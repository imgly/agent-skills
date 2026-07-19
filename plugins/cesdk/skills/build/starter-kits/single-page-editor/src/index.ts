/**
 * CE.SDK Single Page Editor Starterkit - Main Entry Point
 *
 * A design editor configured for single-page designs like social media posts,
 * business cards, or fixed single-page graphics.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initSinglePageEditor } from './imgly';

/**
 * Demo assets for this example (scene archives, …) are loaded from the
 * IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/0.1.0/starterkit-single-page-editor';

// ============================================================================
// Configuration
// ============================================================================

// highlight-license
const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-single-page-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  // highlight-single-page-config
  // Single-page mode is enabled via featureFlags
  featureFlags: {
    singlePageMode: true
  },
  // highlight-single-page-config

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-license

// ============================================================================
// Initialize Single Page Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initSinglePageEditor(cesdk);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // highlight-scene-loading
    // Load a multi-page social media template to demonstrate single-page mode
    // This 4-page Instagram post template showcases page navigation in single-page mode
    // Alternatively, create a blank scene via: await cesdk.actions.run('scene.create');
    await cesdk.loadFromArchiveURL(
      `${DEMO_ASSETS_BASE_URL}/assets/ig-post.archive`
    );
    // highlight-scene-loading
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
