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

const config = {
  userId: 'starterkit-video-player-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Player
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initVideoPlayer(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    await cesdk.load(
      `${DEMO_ASSETS_BASE_URL}/assets/video-fashion-portfolio/scene.scene`
    );

    cesdk.actions.run('zoom.toPage', {
      page: 'first',
      autoFit: true,
      padding: 24
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
