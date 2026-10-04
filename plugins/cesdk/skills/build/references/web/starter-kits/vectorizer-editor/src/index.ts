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


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-vectorizer-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Vectorizer Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

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
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
