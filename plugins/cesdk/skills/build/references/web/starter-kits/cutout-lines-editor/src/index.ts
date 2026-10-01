/**
 * CE.SDK Cutout Lines Editor Starterkit - Main Entry Point
 *
 * A design editor with cutout line creation prominently featured.
 * Click on a shape and select "Create Cutout" from the canvas menu.
 *
 * @see https://img.ly/docs/cesdk/js/stickers-and-shapes/create-cutout-384be3/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initCutoutLinesEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-cutout-lines-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Cutout Lines Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initCutoutLinesEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the cutout lines demo scene.
    // This scene contains pre-made shapes ready for cutout line creation.
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/example.scene`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
