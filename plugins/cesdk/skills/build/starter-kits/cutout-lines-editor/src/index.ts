/**
 * CE.SDK Cutout Lines Editor Starterkit - Main Entry Point
 *
 * A design editor with cutout line creation prominently featured.
 * Click on a shape and select "Create Cutout" from the canvas menu.
 *
 * @see https://img.ly/docs/cesdk/js/stickers-and-shapes/create-cutout-384be3/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initCutoutLinesEditor } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

// START_HIDDEN_BLOCK
import { reportDemoPhase } from '../../shared/demo-preview/lifecycle';
// END_HIDDEN_BLOCK

// ============================================================================
// Configuration
// ============================================================================

const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-cutout-lines-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};

// ============================================================================
// Initialize Cutout Lines Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // START_HIDDEN_BLOCK
    reportDemoPhase('created');
    // END_HIDDEN_BLOCK
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initCutoutLinesEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the cutout lines demo scene.
    // This scene contains pre-made shapes ready for cutout line creation.
    await cesdk.load(resolveAssetPath('/assets/example.scene'));
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
