/**
 * CE.SDK Cutout Lines Editor Starterkit - Main Entry Point
 *
 * A design editor with cutout line creation prominently featured.
 * Click on a shape and select "Create Cutout" from the canvas menu.
 *
 * @see https://img.ly/docs/cesdk/js/plugins/cutout-library/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initCutoutLinesEditor } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

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
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initCutoutLinesEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the cutout lines demo scene.
    // This scene contains pre-made shapes ready for cutout line creation.
    await cesdk.loadFromURL(resolveAssetPath('/assets/example.scene'));
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
