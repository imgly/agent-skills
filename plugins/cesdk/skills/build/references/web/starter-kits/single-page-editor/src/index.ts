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
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-single-page-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

  // Single-page mode is enabled via featureFlags
  featureFlags: {
    singlePageMode: true
  },

};

// ============================================================================
// Initialize Single Page Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initSinglePageEditor(cesdk);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load a multi-page social media template to demonstrate single-page mode
    // This 4-page Instagram post template showcases page navigation in single-page mode
    // Alternatively, create a blank scene via: await cesdk.actions.run('scene.create');
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/ig-post/scene.scene`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
