/**
 * CE.SDK Pexels Image Editor Starterkit - Main Entry Point
 *
 * A design editor with Pexels stock photos integrated as the primary image source.
 * Search and browse millions of free stock photos from Pexels directly within the editor.
 *
 * ## Configuration Approaches
 *
 * There are two ways to configure the Pexels API key:
 *
 * ### 1. Environment Variables (Recommended for new projects)
 * Create a `.env` file with:
 * ```
 * VITE_PEXELS_API_KEY=your-pexels-api-key
 * ```
 *
 * ### 2. Direct Parameters (For existing projects)
 * Pass the API key directly to the init function:
 * ```typescript
 * await initPexelsImageEditor(cesdk, {
 *   pexelsApiKey: 'your-pexels-api-key'
 * });
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://www.pexels.com/api/documentation/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initPexelsImageEditor } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

// ============================================================================
// Configuration
// ============================================================================

// highlight-license
const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-pexels-asset-source-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-license

// ============================================================================
// Pexels Configuration
// ============================================================================

// highlight-pexels-config
// Option 1: Read from environment variables (recommended for new projects with .env)
const pexelsConfig = {
  pexelsApiKey: import.meta.env.VITE_PEXELS_API_KEY as string | undefined
};

// Option 2: Direct configuration (for existing projects or custom setups)
// Uncomment to use direct configuration instead of environment variables:
// const pexelsConfig = {
//   pexelsApiKey: 'your-pexels-api-key'
// };
// highlight-pexels-config

// ============================================================================
// Initialize Pexels Image Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    // highlight-init
    // Initialize the editor with Pexels integration
    await initPexelsImageEditor(cesdk, pexelsConfig);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // highlight-scene-loading
    // Load the Pexels demo scene from CDN
    // This scene showcases images that can be replaced with photos from Pexels
    await cesdk.loadFromURL(resolveAssetPath('/assets/pexels.scene'));
    // highlight-scene-loading
    // highlight-init
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
