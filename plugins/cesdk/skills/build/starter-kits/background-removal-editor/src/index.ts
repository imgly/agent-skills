/**
 * CE.SDK Background Removal Editor Starterkit - Main Entry Point
 *
 * A design editor with AI-powered background removal prominently featured.
 * Click on an image to see the background removal option in the canvas menu.
 *
 * @see https://img.ly/docs/cesdk/js/edit-image/remove-bg-9dfcf7/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initBackgroundRemovalEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';

// START_HIDDEN_BLOCK
import { reportDemoPhase } from '../../shared/demo-preview/lifecycle';
// END_HIDDEN_BLOCK

// ============================================================================
// Configuration
// ============================================================================

const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-background-removal-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};

// ============================================================================
// Initialize Background Removal Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // START_HIDDEN_BLOCK
    reportDemoPhase('created');
    // END_HIDDEN_BLOCK
    // START_HIDDEN_BLOCK
    (window as any).cesdk = cesdk;
    // END_HIDDEN_BLOCK

    await initBackgroundRemovalEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the background removal demo scene
    // This scene contains an image optimized for demonstrating background removal
    //
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/scene.scene`);
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
