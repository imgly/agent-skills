/**
 * CE.SDK Layouts Editor Starterkit - Main Entry Point
 *
 * A design editor with pre-designed layout templates for creating graphics,
 * collages, and multi-page documents with consistent layouts.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { DEMO_ASSETS_BASE_URL, initLayoutsAssetSource } from './imgly';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-layouts-asset-source-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Layouts Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initLayoutsAssetSource(cesdk);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the custom layouts scene with pre-designed content
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/custom-layouts.scene`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
