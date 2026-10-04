/**
 * CE.SDK Background Removal Editor Starterkit - Main Entry Point
 *
 * A design editor with AI-powered background removal prominently featured.
 * Click on an image to see the background removal option in the canvas menu.
 *
 * @see https://img.ly/docs/cesdk/js/edit-image/remove-bg-9dfcf7/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initBackgroundRemovalEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-background-removal-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Background Removal Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initBackgroundRemovalEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the background removal demo scene
    // This scene contains an image optimized for demonstrating background removal
    //
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/scene.scene`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
