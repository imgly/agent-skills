/**
 * CE.SDK Design Editor Starterkit - Main Entry Point
 *
 * A complete design editor for creating graphics, templates, and multi-page documents.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initDesignEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-design-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Design Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initDesignEditor(cesdk);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    await cesdk.load(
      `${DEMO_ASSETS_BASE_URL}/assets/4-5-marketing-ad/scene.scene`
    );
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
