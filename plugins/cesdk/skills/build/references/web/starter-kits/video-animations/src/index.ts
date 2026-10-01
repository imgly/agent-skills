/**
 * CE.SDK Video Animations Starterkit - Main Entry Point
 *
 * A video editor focused on animations with custom scene templates,
 * audio assets, and auto-opening animation panel.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  DEMO_ASSETS_BASE_URL,
  initVideoAnimationsEditor,
  openAnimationPanel
} from './imgly';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-video-animations-user',

  // Local assets for development

};

// ============================================================================
// Initialize Video Animations Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initVideoAnimationsEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load initial scene from CDN
    await cesdk.load(
      `${DEMO_ASSETS_BASE_URL}/assets/templates/lunar-video-default/scene.scene`
    );

    // ============================================================================
    // Animation Panel
    // ============================================================================

    // Open animation panel on initialization
    openAnimationPanel(cesdk);

    // Open animation panel on scene change
    cesdk.engine.scene.onActiveChanged(() => {
      openAnimationPanel(cesdk);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
