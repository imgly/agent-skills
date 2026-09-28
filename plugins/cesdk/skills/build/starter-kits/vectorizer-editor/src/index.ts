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
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';

// START_HIDDEN_BLOCK
import { reportDemoPhase } from '../../shared/demo-preview/lifecycle';
export { DEMO_ASSETS_BASE_URL };
// END_HIDDEN_BLOCK

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
    // START_HIDDEN_BLOCK
    reportDemoPhase('created');
    // END_HIDDEN_BLOCK
    // START_HIDDEN_BLOCK
    (window as any).cesdk = cesdk;
    // END_HIDDEN_BLOCK

    await initVectorizerEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the vectorizer demo scene from the public showcases URL
    // This scene contains an image optimized for demonstrating vectorization
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/scene/scene.scene`);

    // Select the first image block for immediate vectorization demonstration
    const imageBlock = cesdk.engine.block.findByKind('image')[0];
    if (imageBlock) {
      cesdk.engine.block.select(imageBlock);
    }
    // START_HIDDEN_BLOCK
    reportDemoPhase('ready');
    // END_HIDDEN_BLOCK
  })
  .catch((error) => {
    // START_HIDDEN_BLOCK
    reportDemoPhase('failed');
    // END_HIDDEN_BLOCK
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
