/**
 * CE.SDK Video Animations Starterkit - Main Entry Point
 *
 * A video editor focused on animations with custom scene templates,
 * audio assets, and auto-opening animation panel.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initVideoAnimationsEditor, openAnimationPanel } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

// ============================================================================
// Configuration
// ============================================================================

// highlight-license
const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-video-animations-user',

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-license

// ============================================================================
// Initialize Video Animations Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as unknown as { cesdk: CreativeEditorSDK }).cesdk = cesdk;

    await initVideoAnimationsEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // highlight-scene-loading
    // Load initial scene from CDN
    await cesdk.loadFromURL(
      resolveAssetPath('/assets/templates/lunar-cosmetics.scene')
    );
    // highlight-scene-loading

    // ============================================================================
    // Animation Panel
    // ============================================================================

    // highlight-animation-panel
    // Open animation panel on initialization
    openAnimationPanel(cesdk);

    // Open animation panel on scene change
    cesdk.engine.scene.onActiveChanged(() => {
      openAnimationPanel(cesdk);
    });
    // highlight-animation-panel
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
