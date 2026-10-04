/**
 * CE.SDK Advanced Video Editor Starterkit - Main Entry Point
 *
 * Advanced video editing with full timeline and multi-track support.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initAdvancedVideoEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-advanced-video-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Advanced Video Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initAdvancedVideoEditor(cesdk);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    await cesdk.load(
      `${DEMO_ASSETS_BASE_URL}/assets/templates/lunar-video-default/scene.scene`
    );
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
