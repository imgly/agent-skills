/**
 * CE.SDK Vectorizer Editor Starterkit - Main Entry Point
 *
 * A design editor with image vectorization prominently featured.
 * Click on an image to see the "Vectorize" option in the canvas menu.
 *
 * @see https://img.ly/docs/cesdk/js/edit-image/vectorize-2b4c7f/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initVectorizerEditor } from './imgly';

/**
 * Demo assets for this example (scene archives, …) are loaded from the
 * IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.81.0-rc.1/starterkit-vectorizer-editor';

// ============================================================================
// Configuration
// ============================================================================

const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-vectorizer-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};

// ============================================================================
// Initialize Vectorizer Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initVectorizerEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the vectorizer demo scene from the public showcases URL
    // This scene contains an image optimized for demonstrating vectorization
    await cesdk.load(
      `${DEMO_ASSETS_BASE_URL}/assets/scene.archive`
    );

    // Select the image block for immediate vectorization demonstration
    const imageBlock = cesdk.engine.block.findByName('SelectedImage')[0];
    if (imageBlock) {
      cesdk.engine.block.select(imageBlock);
    }
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
