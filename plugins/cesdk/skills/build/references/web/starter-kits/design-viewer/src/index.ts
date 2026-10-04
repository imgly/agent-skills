/**
 * CE.SDK Viewer Starterkit - Main Entry Point
 *
 * A read-only viewer for design preview and approval workflows.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initDesignViewer } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';
export { DEMO_ASSETS_BASE_URL };

// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-design-viewer-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Viewer
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initDesignViewer(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    await cesdk.load(
      `${DEMO_ASSETS_BASE_URL}/assets/1-1-marketing-multipost/scene.scene`
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
