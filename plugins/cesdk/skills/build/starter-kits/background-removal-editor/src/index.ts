/**
 * CE.SDK Background Removal Editor Starterkit - Main Entry Point
 *
 * A design editor with AI-powered background removal prominently featured.
 * Click on an image to see the background removal option in the canvas menu.
 *
 * @see https://img.ly/docs/cesdk/js/plugins/background-removal/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initBackgroundRemovalEditor } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

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
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initBackgroundRemovalEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the background removal demo scene
    // This scene contains an image optimized for demonstrating background removal
    //
    await cesdk.loadFromURL(resolveAssetPath('/assets/scene.scene'));
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
