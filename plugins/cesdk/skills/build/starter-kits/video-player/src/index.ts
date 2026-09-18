/**
 * CE.SDK Player Starterkit - Main Entry Point
 *
 * A playback-only video player with no editing capabilities.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initVideoPlayer } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';
export { DEMO_ASSETS_BASE_URL };

// ============================================================================
// Configuration
// ============================================================================

// highlight-license
const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-video-player-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-license

// ============================================================================
// Initialize Player
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // START_HIDDEN_BLOCK
    (window as any).cesdk = cesdk;
    // END_HIDDEN_BLOCK

    await initVideoPlayer(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // highlight-scene-loading
    await cesdk.load(
      `${DEMO_ASSETS_BASE_URL}/assets/video-fashion-portfolio/scene.scene`
    );

    cesdk.actions.run('zoom.toPage', {
      page: 'first',
      autoFit: true,
      padding: 24
    });
    // highlight-scene-loading
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
