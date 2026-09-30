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

// START_HIDDEN_BLOCK
import { reportDemoPhase } from '../../shared/demo-preview/lifecycle';
export { DEMO_ASSETS_BASE_URL };
// END_HIDDEN_BLOCK

// ============================================================================
// Configuration
// ============================================================================

// highlight-license
const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-advanced-video-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-license

// ============================================================================
// Initialize Advanced Video Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // START_HIDDEN_BLOCK
    reportDemoPhase('created');
    // END_HIDDEN_BLOCK
    // START_HIDDEN_BLOCK
    (window as any).cesdk = cesdk;
    // END_HIDDEN_BLOCK

    await initAdvancedVideoEditor(cesdk);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // highlight-scene-loading
    await cesdk.load(
      `${DEMO_ASSETS_BASE_URL}/assets/templates/lunar-video-default/scene.scene`
    );
    // highlight-scene-loading
    // START_HIDDEN_BLOCK
    reportDemoPhase('ready');
    // END_HIDDEN_BLOCK
  })
  .catch((error) => {
    // START_HIDDEN_BLOCK
    reportDemoPhase('failed');
    // END_HIDDEN_BLOCK
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
