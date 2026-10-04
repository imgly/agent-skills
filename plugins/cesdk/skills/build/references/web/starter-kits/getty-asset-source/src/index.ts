/**
 * CE.SDK Getty Images Editor Starterkit - Main Entry Point
 *
 * A design editor with Getty Images stock photos integrated as the primary image source.
 * Search and browse premium stock photos from Getty Images directly within the editor.
 *
 * ## Configuration Approaches
 *
 * There are two ways to configure the Getty Images proxy URL:
 *
 * ### 1. Environment Variables (Recommended for new projects)
 * Create a `.env` file with:
 * ```
 * VITE_GETTY_IMAGES_PROXY_URL=https://your-proxy-server.com/getty-api
 * ```
 *
 * ### 2. Direct Parameters (For existing projects)
 * Pass the proxy URL directly to the init function:
 * ```typescript
 * await initGettyImagesEditor(cesdk, {
 *   gettyProxyUrl: 'https://your-proxy-server.com/getty-api'
 * });
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 * @see https://developer.gettyimages.com/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initGettyImagesEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-getty-asset-source-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Getty Images Configuration
// ============================================================================

// Option 1: Read from environment variables (recommended for new projects with .env)
const gettyConfig = {
  gettyProxyUrl: (undefined as string | undefined) as
    | string
    | undefined
};

// Option 2: Direct configuration (for existing projects or custom setups)
// Uncomment to use direct configuration instead of environment variables:
// const gettyConfig = {
//   gettyProxyUrl: 'https://your-proxy-server.com/getty-api'
// };

// ============================================================================
// Initialize Getty Images Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    // Initialize the editor with Getty Images integration
    await initGettyImagesEditor(cesdk, gettyConfig);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the Getty Images demo scene from CDN
    // This scene showcases images that can be replaced with photos from Getty Images
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/getty-images.scene`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
